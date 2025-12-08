<script>
    import { onMount } from 'svelte'
    import { user } from '../stores/userStore.js'
    import { currentPage } from '../stores/pageStore.js';
    
    let loading = false;
    let message = "";
    let drafts = []

    onMount(() => {
        loadDrafts()
    })

    async function triggerAgent() {
        if(!$user) return
        const characterName = $user.username.toLowerCase()

        loading = true;
        message = `${$user.username} is writing a blog... 💅`;

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

    async function loadDrafts() {
        if (!$user) return
        const res = await fetch(`http://localhost:8080/api/blogs?status=draft&author=${$user.username}`)
        const data = await res.json()
        drafts = data.data || []
    }

    async function publishDraft(id) {
        const res = await fetch(`http://localhost:8080/api/blogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'published'}),
            credentials: 'include'
        })
        if (res.ok) {
            message = "✨ Blog published to the homepage!"
            $currentPage = 'home'
        }
    }
    onMount(loadDrafts)
</script>

<main>
    <h1>Personal Dashboard</h1>
    
    {#if $user}
        <h2>Welcome back, <span class="highlight">{$user.username}</span>! ✨</h2>

        <div class="controls">
            <button on:click={triggerAgent} disabled={loading} class={$user.username.toLowerCase()}>
                {#if loading}
                    Thinking... 💭
                {:else}
                    ✨ Write a blog post
                {/if}
            </button>
        </div>

        {#if message}
            <p class="status">{message}</p>
        {/if}

        <div class="drafts-section">
            <h3>Your pending drafts 📝</h3>
            
            {#if drafts.length === 0}
                <p class="empty-msg">No drafts waiting. Generate one above!</p>
            {:else}
                <div class="draft-list">
                    {#each drafts as draft}
                        <div class="draft-card">
                            <div class="draft-info">
                                <h4>{draft.title}</h4>
                                <p class="preview">{draft.content ? draft.content.substring(0, 60) + '...' : 'No content'}</p>
                            </div>
                            <button class="publish-btn" on:click={() => publishDraft(draft.id)}>
                                ✅ Publish
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {:else}
        <p>Loading user data...</p>
    {/if}
</main>

<style>
    main { text-align: center; max-width: 600px; margin: 0 auto; padding: 20px; }
    
    h1 { color: #333; }
    .highlight { color: #d63384; font-weight: bold; }

    /* Generate Button Styles */
    .controls button {
        color: white;
        border: none;
        padding: 15px 30px;
        margin-top: 20px;
        cursor: pointer;
        font-size: 1.2rem;
        border-radius: 30px;
        transition: transform 0.2s;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .controls button:hover { transform: scale(1.05); }
    .controls button:disabled { background-color: #ccc; cursor: not-allowed; }

    /* Character Themes */
    .cloe { background: linear-gradient(45deg, #ff9a9e, #fad0c4); color: black; }
    .jade { background: black; border: 2px solid #39ff14; color: #39ff14; }
    .sasha { background: linear-gradient(45deg, #f09819, #edde5d); color: black; }
    .yasmin { background: linear-gradient(45deg, #a18cd1, #fbc2eb); color: black; }

    .status { margin-top: 20px; font-weight: bold; color: #d63384; }

    /* Draft List Styles */
    .drafts-section { margin-top: 40px; text-align: left; border-top: 1px solid #ccc; padding-top: 20px; }
    .draft-card { 
        background: white; 
        border: 1px solid #ddd; 
        padding: 15px; 
        margin-bottom: 10px; 
        border-radius: 8px; 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .draft-info h4 { margin: 0 0 5px 0; color: #333; }
    .preview { margin: 0; color: #666; font-size: 0.9rem; }
    
    .publish-btn { 
        background: #28a745; 
        color: white; 
        padding: 8px 15px; 
        font-size: 0.9rem; 
        border: none;
        border-radius: 5px;
        cursor: pointer;
        white-space: nowrap;
        margin-left: 10px;
    }
    .publish-btn:hover { background: #218838; }
    .empty-msg { color: #888; font-style: italic; text-align: center; }
</style>