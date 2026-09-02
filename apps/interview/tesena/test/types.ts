export interface Order {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "declined" | "expired" | "needs_review";
  billingState: "unbilled" | "invoiced" | "blocked";
  invoiceId?: string;
  attempts?: PaymentAttempt[];
}

export interface PaymentAttempt {
  id: string;
  status: string;
}

export interface PaymentReport {
  orderId: string;
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
}
