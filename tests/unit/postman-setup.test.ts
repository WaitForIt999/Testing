import { afterEach, describe, expect, it, vi } from 'vitest';
import { setup } from '../types/postman/setup';
import { setup as setupRickAndMorty } from '../types/postman/rickandmort';

describe('postman setup helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns json payload for pokeapi setup on success', async () => {
    const payload = { ok: true };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await setup();

    expect(fetchSpy).toHaveBeenCalledWith('https://pokeapi.co/api/v2/');
    expect(result).toEqual(payload);
  });

  it('throws a descriptive error for pokeapi setup on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Bad Request',
    } as Response);

    await expect(setup()).rejects.toThrow(
      'Failed to fetch https://pokeapi.co/api/v2/: Bad Request'
    );
  });

  it('returns json payload for rick and morty setup on success', async () => {
    const payload = { id: 209, name: 'Long Sleeved Morty' };
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    const result = await setupRickAndMorty();

    expect(fetchSpy).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/209');
    expect(result).toEqual(payload);
  });

  it('throws a descriptive error for rick and morty setup on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(setupRickAndMorty()).rejects.toThrow(
      'Failed to fetch https://rickandmortyapi.com/api/character/209: Internal Server Error'
    );
  });
});
