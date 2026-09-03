
import { resetStore } from "../src/store";
import {
  createOrderAndAttempt,
  sendPaymentWebhook,
  getOrder,
  getPaidReports,
  createOrderWithWebhook,
  createConcurrentPaymentAttempts,
  createFailedThenSuccessfulPayment,
  getBillableReports,
} from "./helpers";
import request from "supertest";
import { createApp } from "../src/app";
import { randomUUID } from "node:crypto";
import type { PaymentReport } from "./types";

const app = createApp();

describe("Payment Billing and Reporting - Prevent billing for failed/incomplete payments", () => {
  beforeEach(() => resetStore());

  it("TC1: A declined payment should not trigger billing", async () => {
    const { order } = await createOrderWithWebhook("declined");

    expect(order.paymentStatus).toBe("declined");
    expect(order.billingState).toBe("unbilled");
    expect(order.invoiceId).toBeUndefined();
  });

  it("TC2: A payment interrupted by user (no webhook) should remain pending without invoice", async () => {
    const { orderId } = await createOrderAndAttempt();
    const order = await getOrder(orderId);

    expect(order.paymentStatus).toBe("pending");
    expect(order.billingState).toBe("unbilled");
  });

  it("TC3: A payment timeout should not trigger billing", async () => {
    const { order } = await createOrderWithWebhook("expired");

    expect(order.paymentStatus).toBe("expired");
    expect(order.billingState).toBe("unbilled");
  });

  it("TC4: A corrective webhook (paid -> declined) after billing should block the order, not silently ignore", async () => {
    const { orderId, paymentId } = await createOrderAndAttempt();

    await sendPaymentWebhook(paymentId, "paid");
    let order = await getOrder(orderId);
    expect(order.billingState).toBe("invoiced");

    await sendPaymentWebhook(paymentId, "declined");
    order = await getOrder(orderId);

    expect(order.paymentStatus).toBe("declined");
    expect(order.billingState).toBe("blocked");
  });

  it("TC5: Duplicate webhooks with same eventId should not cause duplicate billing", async () => {
    const { orderId, paymentId } = await createOrderAndAttempt();
    const eventId = randomUUID();

    const first = await sendPaymentWebhook(paymentId, "paid", "new-gateway", eventId);
    const second = await sendPaymentWebhook(paymentId, "paid", "new-gateway", eventId);

    expect(first.body.applied).toBe(true);
    expect(second.body.applied).toBe(false);

    const order = await getOrder(orderId);
    expect(order.invoiceId).toBeDefined();

    const reports = await getPaidReports();
    const reportsForOrder = reports.filter((report: PaymentReport) => report.orderId === orderId);
    expect(reportsForOrder).toHaveLength(1);
  });

  it("TC6: With concurrent payment attempts, only the successful one should trigger billing", async () => {
    const orderRes = await request(app).post("/orders").send({ amount: 500, currency: "CZK" });
    const orderId = orderRes.body.id as string;

    const { paymentId1, paymentId2 } = await createConcurrentPaymentAttempts(orderId);

    await sendPaymentWebhook(paymentId2, "paid");
    let order = await getOrder(orderId);
    expect(order.billingState).toBe("invoiced");

    await sendPaymentWebhook(paymentId1, "declined");
    order = await getOrder(orderId);

    expect(order.billingState).toBe("invoiced");
  });

  it("TC7: Unknown or error responses from gateway should never result in a 'paid' status", async () => {
    const { order: initialOrder } = await createOrderWithWebhook("gateway_internal_error_xyz");

    expect(initialOrder.paymentStatus).toBe("needs_review");
    expect(initialOrder.billingState).toBe("unbilled");
  });

  it("TC8: A successful retry after failed payment should bill only the successful attempt, with full history", async () => {
    const { order } = await createFailedThenSuccessfulPayment();

    expect(order.billingState).toBe("invoiced");
    expect(order.attempts).toHaveLength(2);
    expect(order.attempts?.[0].status).toBe("declined");
    expect(order.attempts?.[1].status).toBe("paid");
  });

  it("TC9: Payment reports with onlyBillable=true should only include paid (billable) payments", async () => {
    await createOrderWithWebhook("declined");

    await createOrderWithWebhook("paid");

    const reports = await getBillableReports();
    const statuses = reports.map((report: PaymentReport) => report.status);

    expect(statuses).toEqual(["paid"]);
  });
});
