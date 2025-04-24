<script lang="ts">
    import { goto } from '$app/navigation';
    let playerName = '';
  
    const handleSubmit = () => {
      if (playerName.trim()) {
        localStorage.setItem('playerName', playerName);
        goto('/game');
      }
    };
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-2xl font-bold mb-4">🎮 プレイヤー名を入力してください</h1>
    <input
      bind:value={playerName}
      placeholder=""
      class="border p-2 rounded mb-4"
    />
    <button
      on:click={handleSubmit}
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      ゲーム開始
    </button>
  </div>
  
