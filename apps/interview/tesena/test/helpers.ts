import request from "supertest";
import { randomUUID } from "node:crypto";
import { createApp } from "../src/app";
import type { Order, PaymentReport } from "./types";

const app = createApp();

export async function createOrderAndAttempt(amount = 1000, paymentMethod = "card") {
  const orderResponse = await request(app).post("/orders").send({ amount, currency: "CZK" });

  const orderId = orderResponse.body.id as string;

  const paymentResponse = await request(app)
    .post(`/orders/${orderId}/payments`)
    .send({ method: paymentMethod });

  const paymentId = paymentResponse.body.id as string;

  return { orderId, paymentId };
}

export function sendPaymentWebhook(
  paymentId: string,
  status: string,
  gateway = "new-gateway",
  eventId = randomUUID(),
) {
  const timestamp = new Date().toISOString();

  return request(app).post("/webhooks/gateway").send({
    eventId,
    paymentId,
    status,
    occurredAt: timestamp,
    gateway,
  });
}

export async function getOrder(orderId: string): Promise<Order> {
  return (await request(app).get(`/orders/${orderId}`)).body;
}

export async function getPaymentReport(
  filters: Record<string, string> = {},
): Promise<PaymentReport[]> {
  return (await request(app).get("/reports/payments").query(filters)).body;
}

export function attemptPayment(orderId: string, method = "card") {
  return request(app).post(`/orders/${orderId}/payments`).send({ method });
}

export async function createOrderWithWebhook(status: string) {
  const { orderId, paymentId } = await createOrderAndAttempt();
  await sendPaymentWebhook(paymentId, status);
  const order = await getOrder(orderId);
  return { orderId, paymentId, order };
}

export async function assertOrderState(
  orderId: string,
  expectedPaymentStatus: string,
  expectedBillingState: string,
) {
  const order = await getOrder(orderId);
  return {
    paymentStatus: order.paymentStatus === expectedPaymentStatus,
    billingState: order.billingState === expectedBillingState,
    order,
  };
}

export async function createConcurrentPaymentAttempts(orderId: string) {
  const attempt1 = await attemptPayment(orderId);
  const attempt2 = await attemptPayment(orderId);
  return {
    paymentId1: attempt1.body.id,
    paymentId2: attempt2.body.id,
  };
}

export async function createFailedThenSuccessfulPayment() {
  const { orderId, paymentId } = await createOrderAndAttempt();

  await sendPaymentWebhook(paymentId, "declined");

  const retryResponse = await attemptPayment(orderId);
  const retryPaymentId = retryResponse.body.id;
  await sendPaymentWebhook(retryPaymentId, "paid");

  const order = await getOrder(orderId);
  return { orderId, order };
}

export async function getPaidReports() {
  return getPaymentReport({ status: "paid" });
}

export async function getBillableReports() {
  return getPaymentReport({ onlyBillable: "true" });
}
