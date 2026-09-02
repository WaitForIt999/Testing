# payment-mock-api

Malé mock API simulující chování nové platební brány – postavené podle test analýzy
(viz `test-analyza-platebni-brana.pdf`). Slouží jako demo projekt pro technické
kolo pohovoru: ukazuje, jak by šly ověřit klíčové rizikové scénáře z dokumentu
(mapování stavů, idempotence webhooků, fail-safe u neznámých stavů, audit trail).

## Spuštění

```bash
npm install
npm run dev      # spustí API na http://localhost:3000
npm test         # spustí testy (Vitest + Supertest)
```

## Endpointy

- `POST /orders` `{ amount, currency }` – založí objednávku
- `GET /orders/:id` – detail objednávky (stav, historie pokusů, audit log)
- `POST /orders/:id/payments` `{ method }` – zahájí platební pokus (bod 12 – lze opakovat, dokud není objednávka `invoiced`)
- `POST /webhooks/gateway` `{ eventId, paymentId, status, occurredAt, gateway }` – simulace webhooku od brány
- `GET /reports/payments?gateway=&status=&onlyBillable=true` – export přehledu plateb (bod 5)

## Implementované rizikové scénáře (viz test-analyza-platebni-brana.docx, bod 2)

Testy v `test/payments.test.ts` (TC1–TC9) přímo odpovídají tabulce testovacích případů
z Wordu:

| TC  | Scénář                            | Klíčové pravidlo v kódu                                      |
| --- | --------------------------------- | ------------------------------------------------------------ |
| 1–3 | declined / přerušeno / timeout    | `NON_BILLABLE_STATUSES` – fakturace se spustí jen na `paid`  |
| 4   | pozdní opravný webhook po faktuře | `billingState -> "blocked"`, ne tiché přepsání               |
| 5   | duplicitní webhook                | idempotence přes `processedWebhookEvents` (Set na `eventId`) |
| 6   | souběžné pokusy                   | více `attempts` na objednávce, fakturuje jen úspěšný         |
| 7   | neznámý/chybový stav brány        | `resolveIncomingStatus` -> fail-safe `needs_review`          |
| 8   | retry po neúspěchu                | `startPayment` odmítne jen `invoiced` objednávky (409)       |
| 9   | export přehledu                   | `listPaymentsReport` s `onlyBillable` filtrem                |

## Co je záměrně zjednodušené 

- In-memory store místo databáze.
- Žádné skutečné volání externí brány – webhook se simuluje ručním POST requestem.
- Bezpečnostní požadavky (bod 6 – zákaz paste/autofill, bod 8 – dvojí potvrzení) nejsou
  součástí tohoto API, protože jde o frontendové/UX chování checkoutu, ne o backendovou logiku.
