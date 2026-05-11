import { expect, describe, vi, beforeEach, afterEach } from "vitest";
import { setup } from '../../types/postman/rickandmort';

const mockedCharacter = {
    id: 209,
    name: 'Long Sleeved Morty',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: { name: 'Earth (Replacement Dimension)' },
    location: {
        name: 'Citadel of Ricks',
        url: 'https://rickandmortyapi.com/api/location/3',
    },
};

describe('Rick and Morty API', () => {
    it('should return a successful response from the character endpoint', async () => {
        const data = await setup();
        expect(data).toEqual(mockedCharacter);
    });
});

beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockedCharacter,
    } as Response);
});

afterEach(() => {
    vi.restoreAllMocks();
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
