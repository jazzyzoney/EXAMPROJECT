<script>
    import { onMount } from 'svelte';
    
    let blogs = [];
    let activeChar = 'cloe'; // Default

    const themes = {
        cloe: { color: '#ff9a9e', emoji: '👼' },
        jade: { color: '#39ff14', emoji: '🐱' },
        sasha: { color: '#f09819', emoji: '🐰' },
        yasmin: { color: '#a18cd1', emoji: '🌸' }
    };

    async function loadCorner(character) {
        activeChar = character;
        try {
            // Fetch blogs filtered by author
            const res = await fetch(`http://localhost:8080/api/blogs?author=${character}`);
            const result = await res.json();
            blogs = result.data;
        } catch (error) {
            console.error(error);
        }
    }

    onMount(() => loadCorner('cloe'));
</script>

<div class="corners-layout" style="--theme-color: {themes[activeChar].color}">
    <h1>The 4 Corners</h1>
    
    <div class="menu">
        <button on:click={() => loadCorner('cloe')} class:active={activeChar === 'cloe'}>Cloe</button>
        <button on:click={() => loadCorner('jade')} class:active={activeChar === 'jade'}>Jade</button>
        <button on:click={() => loadCorner('sasha')} class:active={activeChar === 'sasha'}>Sasha</button>
        <button on:click={() => loadCorner('yasmin')} class:active={activeChar === 'yasmin'}>Yasmin</button>
    </div>

    <div class="content">
        <h2>{activeChar.toUpperCase()}'s World {themes[activeChar].emoji}</h2>
        
        {#if blogs.length === 0}
            <p>No posts here yet!</p>
        {:else}
            {#each blogs as blog}
                <article>
                    <h3>{blog.title}</h3>
                    <p>{blog.content}</p>
                    <small>{new Date(blog.created_at).toLocaleDateString()}</small>
                </article>
            {/each}
        {/if}
    </div>
</div>

<style>
    .corners-layout { padding: 20px; border-top: 5px solid var(--theme-color); transition: border-color 0.3s; }
    .menu { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; }
    button { padding: 10px 20px; border: 1px solid #ccc; background: white; cursor: pointer; text-transform: capitalize; }
    button.active { background-color: var(--theme-color); color: black; font-weight: bold; border-color: black; }
    
    article { border: 1px solid #eee; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    h3 { margin-top: 0; color: var(--theme-color); }
</style>