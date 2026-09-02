import { describe, it, expect, beforeEach } from "vitest";
import { resetStore } from "../src/store";
import { attemptPayment, createOrderWithWebhook } from "./helpers";

describe("Payment Constraints - Cannot create new payment on already paid order", () => {
  beforeEach(() => resetStore());

  it("Should return 409 when attempting to create payment on already-paid order", async () => {
    const { orderId } = await createOrderWithWebhook("paid");
    const newPaymentResponse = await attemptPayment(orderId);

    expect(newPaymentResponse.status).toBe(409);
    expect(newPaymentResponse.body.code).toBe("ORDER_ALREADY_PAID");
  });
});
