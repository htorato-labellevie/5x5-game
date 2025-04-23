const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export const getBoard = async () => {
  const res = await fetch(`${BASE_URL}/game`);
  return res.json();
};

export const resetGame = async () => {
  const res = await fetch(`${BASE_URL}/game/reset`, { method: 'POST' });
  return res.json();
};

export const makeMove = async (X: number, Y: number, player: string) => {
  const res = await fetch(`${BASE_URL}/game/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ X, Y, player })
  });
  return res.json();
};
