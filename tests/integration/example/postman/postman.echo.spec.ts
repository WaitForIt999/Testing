import { describe, it, expect } from "vitest";
import { setup } from "../../../types/postman/setup.ts";

describe('Postman Echo API', () => {
    it('should return a successful response from the base URL', async () => {
        const data = await setup();
        expect(data).toBeDefined();
    });
});