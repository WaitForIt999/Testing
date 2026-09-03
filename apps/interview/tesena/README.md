# Payment Mock API – QA test guide

Tento projekt simuluje chování nové platební brány v omezeném backendovém prostředí. Je navržen pro ověřování klíčových rizikových scénářů v procesu placení, fakturace a zpracování webhooků.

Cílem je poskytnout jednoduchý, předvídatelný testovací sandbox pro QA, který umožní ověřit, zda systém správně:

- neúčtuje platby v neúspěšných nebo přerušených stavech,
- neudělá duplicitní fakturaci,
- řeší chybný nebo neznámý stav gateway,
- správně blokuje nevalidní následné stavy,
- exportuje pouze billable platby.

## 1. Co se testuje

Projekt pokrývá následující rizikové oblasti:

- přerušení platby bez webhooku,
- timeout nebo odmítnutí plateb,
- duplicitní webhooky se stejným `eventId`,
- souběžné pokusy o platbu,
- korekční webhook po úspěšné fakturaci,
- neznámý/invalidní stav od gateway,
- retry po neúspěšném pokusu,
- reporty s filtrem `onlyBillable=true`.

## 2. Jak projekt spustit

```bash
npm install
npm run dev
```

API běží na:

```text
http://localhost:3000
```

Pro spuštění automatických testů:

```bash
npm test
```

## 3. Důležité endpointy

### Vytvoření objednávky

```http
POST /orders
Content-Type: application/json

{
  "amount": 500,
  "currency": "CZK"
}
```

Očekávaný výsledek: vytvoření objednávky s unikátním ID.

### Detail objednávky

```http
GET /orders/:id
```

Vrací stav objednávky, historii pokusů a informaci o billing state.

### Zahájení platebního pokusu

```http
POST /orders/:id/payments
Content-Type: application/json

{
  "method": "card"
}
```

### Simulace webhooku od gateway

```http
POST /webhooks/gateway
Content-Type: application/json

{
  "eventId": "uuid",
  "paymentId": "uuid",
  "status": "paid",
  "occurredAt": "2026-01-01T12:00:00Z",
  "gateway": "new-gateway"
}
```

### Reporty plateb

```http
GET /reports/payments?gateway=&status=&onlyBillable=true
```

## 4. Očekávané stavy a význam

- `pending` – platební pokus byl zahájen, ale ještě nebyl potvrzen,
- `paid` – platba úspěšná a může být fakturovatelná,
- `declined` – platba odmítnuta,
- `expired` – platba vypršela,
- `needs_review` – neznámý nebo chybný stav z gateway,
- `invoiced` – objednávka byla fakturována,
- `blocked` – po fakturaci přišel opravný webhook se stavem, který by měl být zakázán.

## 5. Testovací scénáře pro QA

Níže je seznam scénářů, které mají být verifikovány ručně nebo automaticky.

| TC | Scénář | Krok | Očekávaný výsledek |
| --- | --- | --- | --- |
| TC1 | Zamítnutá platba | vytvořit objednávku a nastavit stav `declined` | objednávka zůstane `unbilled`, žádná faktura |
| TC2 | Přerušená platba bez webhooku | zahájit platbu bez následného webhooku | stav `pending`, `billingState` zůstane `unbilled` |
| TC3 | Timeout platby | nastavit stav `expired` | žádná fakturace |
| TC4 | Opravný webhook po faktuře | zaplatit, fakturovat a pak poslat `declined` | stav se nastaví na `blocked`, ne na `paid` |
| TC5 | Duplicitní webhook | poslat stejný `eventId` dvakrát | druhý webhook je ignorován |
| TC6 | Souběžné pokusy | vytvořit dvě payment attempts pro stejnou objednávku | fakturace se provede pouze pro úspěšný pokus |
| TC7 | Neznámý stav gateway | poslat chybový nebo neznámý status | výsledek je `needs_review`, ne `paid` |
| TC8 | Retry po neúspěchu | neúspěšná platba + nový pokus | fakturace pouze pro úspěšný retry |
| TC9 | Export billable reportů | vyexportovat reporty s `onlyBillable=true` | vrátí pouze `paid` záznamy |

## 6. Příklady validace

### Scénář: zamítnutá platba

1. Vytvořit objednávku.
2. Zahájit payment.
3. Poslat webhook se stavem `declined`.
4. Zkontrolovat detail objednávky.

Očekávání:

- `paymentStatus === "declined"`
- `billingState === "unbilled"`
- `invoiceId` je undefined

### Scénář: duplicitní webhook

1. Zahájit payment.
2. Poslat webhook se stavem `paid` a konkrétním `eventId`.
3. Poslat stejný webhook s tím samým `eventId` ještě jednou.

Očekávání:

- druhý request je označen jako `applied: false`
- faktura se nevytvoří dvakrát
- v reportu je pouze jeden záznam

## 7. Automatické testy

Soubor automatických testů je v adresáři:

- `test/billing.spec.ts`
- `test/constraints.spec.ts`

Tyto testy pokrývají hlavní business pravidla a slouží jako rychlý regressní check po změnách.

## 8. Poznámky pro QA

- Vše je v in-memory storage, takže po restartu serveru se data resetují.
- Neexistuje skutečná externí platební brána; webhooky se simulují ručně.
- Cílem projektu je ověřit business logiku, ne produktové UX ani autentizační flow.
- Pokud se v reportu objeví více záznamů než očekáváno, nejprve ověřit, zda se neodeslal duplicitní `eventId`.

## 9. Co je záměrně zjednodušeno

- neexistuje databáze, pouze in-memory store,
- neprobíhá skutečné volání externí gateway,
- bezpečnostní a UX požadavky (např. paste/autofill, dvojí potvrzení) nejsou součástí backendové logiky,
- testovací data jsou náhodná a zaměřená na business scénáře, ne na produkční provoz.

## 10. Shrnutí

Tento projekt je vhodný pro QA validaci odpovědnosti backendu v oblasti plateb, fakturace a webhook idempotence. Pokud tester dodrží výše popsané scénáře a očekávání, dokáže rychle odhalit nejkritičtější chyby v obchodní logice.
