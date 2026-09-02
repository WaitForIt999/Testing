import express, { type Request, type Response, type NextFunction } from "express";
import {
  createOrder,
  getOrder,
  startPayment,
  processWebhook,
  listPaymentsReport,
  DomainError,
} from "./store";
import type { PaymentStatus } from "./types";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (_req: Request, res: Response) => {
    res.json({
      name: "Mock payment API",
      routes: [
        "GET /",
        "POST /orders",
        "GET /orders/:id",
        "POST /orders/:id/payments",
        "POST /webhooks/gateway",
        "GET /reports/payments",
      ],
    });
  });

  app.post("/orders", (req: Request, res: Response) => {
    const { amount, currency } = req.body ?? {};
    if (typeof amount !== "number" || amount <= 0 || typeof currency !== "string") {
      return res
        .status(400)
        .json({ error: "amount (number > 0) and currency (string) are required" });
    }
    const order = createOrder(amount, currency);
    res.status(201).json(order);
  });

  app.get("/orders/:id", (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = getOrder(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  app.post("/orders/:id/payments", (req: Request, res: Response, next: NextFunction) => {
    try {
      const { method } = req.body ?? {};
      if (typeof method !== "string" || !method) {
        return res.status(400).json({ error: "method is required" });
      }
      const attempt = startPayment(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
        method,
      );
      res.status(201).json(attempt);
    } catch (err) {
      next(err);
    }
  });

  app.post("/webhooks/gateway", (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventId, paymentId, status, occurredAt, gateway } = req.body ?? {};
      if (!eventId || !paymentId || !status || !occurredAt || !gateway) {
        return res
          .status(400)
          .json({ error: "eventId, paymentId, status, occurredAt, gateway are required" });
      }
      const result = processWebhook({
        eventId,
        paymentId,
        status: status as PaymentStatus,
        occurredAt,
        gateway,
      });
      res
        .status(200)
        .json({ orderId: result.order.id, applied: result.applied, order: result.order });
    } catch (err) {
      next(err);
    }
  });

  app.get("/reports/payments", (req: Request, res: Response) => {
    const { gateway, status, onlyBillable } = req.query;
    const rows = listPaymentsReport({
      gateway: typeof gateway === "string" ? gateway : undefined,
      status: typeof status === "string" ? (status as PaymentStatus) : undefined,
      onlyBillable: onlyBillable === "true",
    });
    res.json(rows);
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: "Not found",
      message: "Unknown route. See GET / for available endpoints.",
    });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof DomainError) {
      return res.status(err.status).json({ error: err.message, code: err.code });
    }
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  });

  return app;
}
