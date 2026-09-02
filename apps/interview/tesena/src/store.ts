import { randomUUID } from "node:crypto";
import type { Order, PaymentAttempt, PaymentStatus, GatewayWebhookPayload } from "./types";
import { NON_BILLABLE_STATUSES as NON_BILLABLE } from "./types";

const orders = new Map<string, Order>();
const paymentIdToOrderId = new Map<string, string>();
const processedWebhookEvents = new Set<string>();

export function resetStore() {
  orders.clear();
  paymentIdToOrderId.clear();
  processedWebhookEvents.clear();
}

export function createOrder(amount: number, currency: string): Order {
  const order: Order = {
    id: randomUUID(),
    amount,
    currency,
    billingState: "unbilled",
    paymentStatus: "none",
    attempts: [],
    auditLog: [
      {
        timestamp: new Date().toISOString(),
        fromStatus: null,
        toStatus: "none",
        source: "system",
        reference: "order-created",
      },
    ],
  };
  orders.set(order.id, order);
  return order;
}

export function getOrder(orderId: string): Order | undefined {
  return orders.get(orderId);
}

export class DomainError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function startPayment(
  orderId: string,
  method: string,
  gateway = "new-gateway",
): PaymentAttempt {
  const order = orders.get(orderId);
  if (!order) throw new DomainError("Order not found", "ORDER_NOT_FOUND", 404);

  if (order.billingState === "invoiced") {
    throw new DomainError(
      "Order is already paid - cannot start a new payment attempt",
      "ORDER_ALREADY_PAID",
      409,
    );
  }

  const attempt: PaymentAttempt = {
    id: randomUUID(),
    method,
    status: "pending",
    createdAt: new Date().toISOString(),
    gateway,
  };

  order.attempts.push(attempt);
  order.paymentStatus = "pending";
  order.lastPaymentMethod = method;
  order.auditLog.push({
    timestamp: attempt.createdAt,
    fromStatus:
      order.attempts.length > 1 ? order.attempts[order.attempts.length - 2].status : "none",
    toStatus: "pending",
    source: "system",
    reference: `payment-attempt-started:${attempt.id}`,
  });

  paymentIdToOrderId.set(attempt.id, orderId);
  return attempt;
}

export function processWebhook(payload: GatewayWebhookPayload): { order: Order; applied: boolean } {
  const orderId = paymentIdToOrderId.get(payload.paymentId);
  if (!orderId) throw new DomainError("Unknown paymentId", "PAYMENT_NOT_FOUND", 404);

  const order = orders.get(orderId)!;
  const attempt = order.attempts.find((a) => a.id === payload.paymentId)!;

  if (processedWebhookEvents.has(payload.eventId)) {
    return { order, applied: false };
  }
  processedWebhookEvents.add(payload.eventId);

  const previousAttemptStatus = attempt.status;
  const resolvedStatus = resolveIncomingStatus(payload.status);

  attempt.status = resolvedStatus;
  order.paymentStatus = resolvedStatus;

  order.auditLog.push({
    timestamp: payload.occurredAt,
    fromStatus: previousAttemptStatus,
    toStatus: resolvedStatus,
    source: "webhook",
    reference: payload.eventId,
  });

  if (resolvedStatus === "paid") {
    if (order.billingState !== "invoiced") {
      order.billingState = "invoiced";
      order.invoiceId = `INV-${randomUUID().slice(0, 8)}`;
    }
  } else if (previousAttemptStatus === "paid" && order.billingState === "invoiced") {
    order.billingState = "blocked";
  }

  return { order, applied: true };
}

function resolveIncomingStatus(status: PaymentStatus): PaymentStatus {
  const known: PaymentStatus[] = [
    "pending",
    "authorized",
    "paid",
    "declined",
    "expired",
    "cancelled",
    "failed",
    "needs_review",
  ];
  return known.includes(status) ? status : "needs_review";
}

export function listPaymentsReport(filter: {
  gateway?: string;
  status?: PaymentStatus;
  onlyBillable?: boolean;
}) {
  const rows: Array<{
    orderId: string;
    attemptId: string;
    gateway: string;
    status: PaymentStatus;
    billingState: string;
  }> = [];
  for (const order of orders.values()) {
    for (const attempt of order.attempts) {
      if (filter.gateway && attempt.gateway !== filter.gateway) continue;
      if (filter.status && attempt.status !== filter.status) continue;
      if (filter.onlyBillable && NON_BILLABLE.includes(attempt.status)) continue;
      rows.push({
        orderId: order.id,
        attemptId: attempt.id,
        gateway: attempt.gateway,
        status: attempt.status,
        billingState: order.billingState,
      });
    }
  }
  return rows;
}
