const baseurl = 'https://pokeapi.co/api/v2/';

export const setup = async () => {
    const response = await fetch(baseurl);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${baseurl}: ${response.statusText}`);
    };
    const data = await response.json();
    return data;
};    