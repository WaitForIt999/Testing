import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AddressInfo } from 'node:net';
import { app } from '../types/helloApp';

let server: ReturnType<typeof app.listen>;
let baseUrl: string;

beforeAll(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

describe('helloApp express server', () => {
  it('responds to /hello with expected text', async () => {
    const response = await fetch(`${baseUrl}/hello`);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toBe('Hello, World!');
  });
});
