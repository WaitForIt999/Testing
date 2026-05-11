import { expect, describe } from "vitest";
import { setup } from '../../types/postman/rickandmort';

describe('Rick and Morty API', () => {
    it('should return a successful response from the character endpoint', async () => {
        const data = await setup();
        expect(data).toBeDefined();
    });
});

describe('Character Data Validation', () => {
    it('should have the correct character name', async () => {
        const data = await setup();
        expect(data.name).toBe("Long Sleeved Morty");
        expect(data.id).toBe(209);
        expect(data.status).not.toBeUndefined();
        expect(data.species).toBe("Human");
        expect(data.gender).toBe("Male");
        expect(data.origin.name).not.toBeUndefined();
    });
});
describe('character location validation', () => {
    it('should have the correct location name', async () => {
        const data = await setup();
        expect(data.location.name).not.toBeUndefined();
        expect(data.location.url).not.toBeUndefined();
    });
});