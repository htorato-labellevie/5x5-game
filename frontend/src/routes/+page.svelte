<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import io from 'socket.io-client';

  let board: (string | null)[][] = [];
  let currentPlayer: string = '';
  let player: string = '';
  let winner: string | null = null;

  const BACKEND_URL = 'http://192.168.11.5:3000';
  const socket = io(BACKEND_URL);

  onMount(() => {
    fetchBoard();

    interface BoardUpdatePayload {
      board: (string | null)[][];
      currentPlayer: string;
      winner?: string | null;
    }

    socket.on('boardUpdated', ({ board: newBoard, currentPlayer: newCurrentPlayer, winner: updatedWinner }: BoardUpdatePayload) => {
      board = [...newBoard];
      currentPlayer = newCurrentPlayer;
      winner = updatedWinner ?? null;
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
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 280px;
    height: 100%;
    background-color: #fef3c7;
    padding: 1rem;
    overflow-y: auto;
    border-right: 2px solid #ccc;
  }

  .main-content {
    margin-left: 300px;
    padding: 2rem 1rem;
    text-align: center;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(15, 40px);
    gap: 4px;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .cell {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    text-align: center;
    line-height: 40px;
    border: 1px solid #444;
    background-color: #f8f8f8;
    cursor: pointer;
  }

  .cell:disabled {
    cursor: not-allowed;
  }

  .cell-text {
    color: #111;
    font-weight: bold;
  }

  .hint-label {
    color: #aaa;
    font-size: 0.6rem;
  }

  .selected-a {
    background-color: #ffe5e5;
  }

  .selected-b {
    background-color: #e5f0ff;
  }

  details summary {
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  details ul {
    margin-left: 1rem;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
</style>

<!-- 📘 Sidebar -->
<div class="sidebar">
  <h2 class="title">📘 ルール</h2>

  <details open>
    <summary>🎯 基本ルール</summary>
    <ul>
      <li>交互に石（A/B）を打つ</li>
      <li>縦・横・斜めに5個揃えたら勝ち</li>
    </ul>
  </details>

  <details>
    <summary>⚠ 禁じ手（先手のみ）</summary>
    <ul>
      <li>三三禁：3連を同時に2つ作る</li>
      <li>四四禁：4連を同時に2つ作る</li>
      <li>長連：6個以上並べる</li>
    </ul>
  </details>

  <details>
    <summary>🧠 勝つためのコツ</summary>
    <ul>
      <li>四三の形を目指す</li>
      <li>飛び三・飛び四に注意</li>
      <li>「鞍型」「空き三角」を活用</li>
      <li>後手は禁じ手を使える</li>
    </ul>
  </details>
</div>

<!-- 🎮 Game UI -->
<div class="main-content">
  <h1 class="text-2xl font-bold mb-4">
    🟦 五目並べ風 - <span class="text-blue-500">Five in a Row</span>
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
