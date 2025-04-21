<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import io from 'socket.io-client';

  let board: (string | null)[][] = [];
  let currentPlayer: string = '';
  let player: string = '';
  let winner: string | null = null;

  //const BACKEND_URL = 'https://a40c-126-15-23-48.ngrok-free.app';
  const BACKEND_URL = 'http://192.168.11.5:3000';
  const socket = io(BACKEND_URL); // Socket.IO 接続

  // ✅ 初回のみ取得
  onMount(() => {
    fetchBoard();

    interface BoardUpdatePayload {
      board: (string | null)[][];
      currentPlayer: string;
    }

    socket.on('boardUpdated', ({ board: newBoard, currentPlayer: newCurrentPlayer }: BoardUpdatePayload) => {
      board = [...newBoard];
      currentPlayer = newCurrentPlayer;
      winner = null;
    });
  });

  const fetchBoard = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/game`);
      const data = await res.json();
      board = [...data.board];
      currentPlayer = data.currentPlayer;
    } catch (e) {
      console.error('❌ fetchBoard エラー:', e);
    }
  };

  const makeMove = async (y: number, x: number) => {
    if (!player || player !== currentPlayer || winner) return;

    const res = await fetch(`${BACKEND_URL}/game/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ X: y, Y: x, player }),
    });

    const data = await res.json();
    board = [...data.board];
    currentPlayer = data.currentPlayer;
    winner = data.winner;
  };

  const choosePlayer = async (symbol: string) => {
    player = symbol;
    await resetGame();
  };

  const resetGame = async () => {
    await fetch(`${BACKEND_URL}/game/reset`, {
      method: 'POST',
    });
    winner = null;
    await fetchBoard();
  };
</script>

<style>
  .board {
  display: grid;
  grid-template-columns: repeat(5, 80px);
  gap: 8px;
  justify-content: center;
  margin-bottom: 1rem;
  }

  .cell {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    text-align: center;
    line-height: 80px;
    border: 2px solid #444;
    background-color: #f8f8f8;
    cursor: pointer;
  }

  .cell:disabled {
    cursor: not-allowed;
  }

  .cell-text {
    color: #000; /* 濃い黒文字 */
  }

  .hint-label {
    color: #aaa;
    font-size: 0.75rem;
  }

  .selected-a {
    background-color: #ffe5e5; /* 薄い赤 */
  }

  .selected-b {
    background-color: #e5f0ff; /* 薄い青 */
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

</style>

<div class="container">
  <h1 class="text-2xl font-bold mb-4">
    🟦 5x5 Game - <span class="text-blue-500">Five in a Row</span>
  </h1>

  {#if !player}
  <p class="mb-2">相手と対戦します。あなたの記号を選んでください:</p>
  <button class="bg-blue-500 text-white px-4 py-2 mr-2" on:click={() => choosePlayer('A')}>A でプレイ</button>
  <button class="bg-red-500 text-white px-4 py-2" on:click={() => choosePlayer('B')}>B でプレイ</button>
{:else}
  <div class="mb-4">
    <p>あなたの記号: <strong>{player}</strong></p>
    <p>現在のターン: <strong>{currentPlayer}</strong></p>
  </div>

  {#if winner}
    <p class="font-bold text-green-600 text-lg mb-2">
      🏁 勝者: {winner === 'Draw' ? '引き分け' : winner}
    </p>
  {/if}

  <div class="board">
    {#each board as row, y}
      {#each row as cell, x}
      <button
        class="cell"
        on:click={() => makeMove(y, x)}
        disabled={cell !== null || player !== currentPlayer || Boolean(winner)}
        class:selected-a={cell === 'A'}
        class:selected-b={cell === 'B'}
      >
        {#if cell}
          <span class="cell-text">{cell}</span>
        {:else}
          <span class="hint-label">
            {String.fromCharCode(65 + y)}{x + 1}
          </span>
        {/if}
      </button>
      {/each}
    {/each}
  </div>

  <button class="bg-gray-700 text-white px-4 py-2" on:click={resetGame}>🔄 ゲームリセット</button>
{/if}

</div>
