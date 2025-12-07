<script>
    import { onMount } from 'svelte';
    import { user } from '../stores/userStore.js';

    let questions = [];
    let newQuestion = "";
    let message = "";

    async function loadQuestions() {
        const res = await fetch('http://localhost:8080/api/sos');
        const data = await res.json();
        questions = data.data;
    }

    async function submitQuestion() {
        await fetch('http://localhost:8080/api/sos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: newQuestion }),
            credentials: 'include'
        });
        newQuestion = "";
        alert("Question sent to the Bratz pack!");
    }

    async function triggerAIAnswer() {
        message = "Consulting the girls...";
        const res = await fetch('http://localhost:8080/api/sos/answer', { 
            method: 'POST', 
            credentials: 'include' 
        });
        const data = await res.json();
        if(data.success) {
            message = `✨ ${data.character} just answered a fan!`;
            loadQuestions(); // Refresh list
        } else {
            message = data.error;
        }
    }

    onMount(loadQuestions);
</script>

<div class="sos-container">
    <h1>Style SOS 💋</h1>

    {#if $user && $user.role === 'admin'}
        <div class="admin-panel">
            <button on:click={triggerAIAnswer}>🔮 Answer Next Pending Question (AI)</button>
            <p>{message}</p>
        </div>
    {/if}

    {#if $user}
        <div class="ask-box">
            <input type="text" bind:value={newQuestion} placeholder="Ask for advice..." />
            <button on:click={submitQuestion}>Send</button>
        </div>
    {:else}
        <p>Login to ask for advice!</p>
    {/if}

    <div class="feed">
        {#each questions as q}
            <div class="qa-card">
                <p class="q"><strong>Fan:</strong> {q.question}</p>
                <p class="a"><strong>{q.answered_by}:</strong> {q.answer}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .sos-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .qa-card { background: #fff0f5; padding: 15px; margin-bottom: 10px; border-radius: 10px; border-left: 5px solid #ff69b4; }
    .admin-panel { background: #eee; padding: 10px; margin-bottom: 20px; text-align: center; border-radius: 8px; }
    .ask-box { display: flex; gap: 5px; margin-bottom: 20px; }
    input { flex: 1; padding: 10px; }
</style>