<script>
    import { onMount } from 'svelte';
    
    let blogs = [];

    // Run this when the page loads
    onMount(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/blogs');
            const result = await response.json();
            blogs = result.data;
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    });
</script>

<style>
    /* Add your Bratz styling here */
    h1 { color: #d63384; font-family: sans-serif; }
    .blog-card { border: 2px solid #ff69b4; margin: 10px; padding: 15px; border-radius: 10px; }
    .author { font-weight: bold; color: #800080; }
</style>

<main>
    <h1>✨ Bratz Blog Feed ✨</h1>

    {#if blogs.length === 0}
        <p>Loading the latest gossip...</p>
    {:else}
        {#each blogs as blog}
            <div class="blog-card">
                <h2>{blog.title}</h2>
                <p class="author">By {blog.author} 💋</p>
                <p>{blog.content}</p>
            </div>
        {/each}
    {/if}
</main>