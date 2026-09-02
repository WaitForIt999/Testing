export type PaymentStatus =
  | "none"
  | "pending"
  | "authorized"
  | "paid"
  | "declined"
  | "expired"
  | "cancelled"
  | "failed"
  | "needs_review";

export const NON_BILLABLE_STATUSES: PaymentStatus[] = [
  "none",
  "pending",
  "authorized",
  "declined",
  "expired",
  "cancelled",
  "failed",
  "needs_review",
];

export type BillingState = "unbilled" | "invoiced" | "blocked";

export interface PaymentAttempt {
  id: string;
  method: string;
  status: PaymentStatus;
  createdAt: string;
  gateway: string;
}

export interface AuditEntry {
  timestamp: string;
  fromStatus: PaymentStatus | null;
  toStatus: PaymentStatus;
  source: "webhook" | "redirect" | "system";
  reference: string;
}

export interface Order {
  id: string;
  amount: number;
  currency: string;
  billingState: BillingState;
  paymentStatus: PaymentStatus;
  lastPaymentMethod?: string;
  attempts: PaymentAttempt[];
  auditLog: AuditEntry[];
  invoiceId?: string;
}

export interface GatewayWebhookPayload {
  eventId: string;
  paymentId: string;
  status: PaymentStatus;
  occurredAt: string;
  gateway: string;
}
