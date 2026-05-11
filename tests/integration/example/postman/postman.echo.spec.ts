import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setup } from '../../../types/postman/setup';

describe('Postman Echo API', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'ok' }),
        } as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return a successful response from the base URL', async () => {
        const data = await setup();
        expect(data).toEqual({ message: 'ok' });
    });
});
