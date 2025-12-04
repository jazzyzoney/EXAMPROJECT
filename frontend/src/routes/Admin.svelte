<script>
    let loading = false;
    let message = "";

    async function triggerAgent(characterName) {
        loading = true;
        message = `Asking ${characterName} to write a blog... 💅`;

        try {
            const response = await fetch('http://localhost:8080/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ character: characterName }),
                credentials: 'include' 
            });

            const data = await response.json();
            
            if (data.success) {
                message = `✨ Success! ${data.blog.title} has been drafted.`;
            } else {
                message = `❌ Error: ${data.error}`;
            }
        } catch (error) {
            message = "❌ Network error. Is the backend running?";
        } finally {
            loading = false;
        }
    }
</script>

<main>
    <h1>👑 Admin Dashboard</h1>
    <p>Only Bratz allowed!</p>

    <div class="controls">
        <button on:click={() => triggerAgent('cloe')} disabled={loading}>
            👼 Ask Cloe to Blog
        </button>
        <button on:click={() => triggerAgent('jade')} disabled={loading}>
            🐱 Ask Jade to Blog
        </button>
        </div>

    {#if message}
        <p class="status">{message}</p>
    {/if}
</main>

<style>
    button {
        background-color: #ff69b4;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 5px;
        cursor: pointer;
        font-size: 1.1rem;
        border-radius: 20px;
    }
    button:disabled { background-color: #ccc; }
    .status { margin-top: 20px; font-weight: bold; color: #d63384; }
</style>