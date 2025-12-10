<script>
    import { onMount } from 'svelte';
    import { user } from '../stores/userStore.js'; // Needed for comments

    // State
    let viewMode = 'list'; // 'list' or 'single'
    let activeFilter = 'all'; // 'all', 'cloe', etc.
    let blogs = [];
    let selectedBlog = null; // The full blog object when reading
    let comments = []; // Comments for the selected blog
    let newComment = "";

    // 1. Fetch Blogs (Filtered)
    async function loadBlogs(filter) {
        activeFilter = filter;
        viewMode = 'list'; // Switch back to list view
        
        let url = 'http://localhost:8080/api/blogs?status=published';
        if (filter !== 'all') {
            url += `&author=${filter}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        blogs = data.data || [];
    }

    // 2. Open Single Post
    async function openPost(blog) {
        selectedBlog = blog;
        viewMode = 'single';
        await loadComments(blog.id);
    }

    // 3. Load Comments
    async function loadComments(blogId) {
        const res = await fetch(`http://localhost:8080/api/comments/${blogId}`);
        const data = await res.json();
        comments = data.data || [];
    }

    // 4. Post Comment
    async function postComment() {
        if (!newComment.trim()) return;
        await fetch('http://localhost:8080/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blogId: selectedBlog.id, content: newComment }),
            credentials: 'include'
        });
        newComment = "";
        await loadComments(selectedBlog.id); // Refresh comments
    }

    onMount(() => loadBlogs('all'));
</script>

<div class="corners-container">
    
    {#if viewMode === 'list'}
        <div class="menu">
            <button on:click={() => loadBlogs('all')} class:active={activeFilter === 'all'}>All Updates</button>
            <button on:click={() => loadBlogs('cloe')} class:active={activeFilter === 'cloe'}>Cloe</button>
            <button on:click={() => loadBlogs('jade')} class:active={activeFilter === 'jade'}>Jade</button>
            <button on:click={() => loadBlogs('sasha')} class:active={activeFilter === 'sasha'}>Sasha</button>
            <button on:click={() => loadBlogs('yasmin')} class:active={activeFilter === 'yasmin'}>Yasmin</button>
        </div>

        <div class="grid">
            {#each blogs as blog}
                <button class="card" on:click={() => openPost(blog)}> 
                    <h3>{blog.title}</h3>
                    <p class="author">By {blog.author}</p>
                    <p>{blog.content.substring(0, 100)}...</p>
                    <span class="read-more">Read More →</span>
                </button>
            {/each}
        </div>

    {:else if viewMode === 'single' && selectedBlog}
        <div class="single-view">
            <button class="back-btn" on:click={() => viewMode = 'list'}>← Back to Feed</button>
            
            <article>
                <h1>{selectedBlog.title}</h1>
                <p class="meta">By {selectedBlog.author}</p>
                <div class="body">{@html selectedBlog.content}</div>
            </article>

            <div class="comments">
                <h3>Comments</h3>
                {#each comments as c}
                    <div class="comment {c.role === 'admin' ? 'bratz-reply' : ''}">
                        <strong>{c.username}:</strong> {c.content}
                    </div>
                {/each}

                {#if $user}
                    <div class="comment-box">
                        <input bind:value={newComment} placeholder="Write a comment..." />
                        <button on:click={postComment}>Post</button>
                    </div>
                {:else}
                    <p><i>Login to comment!</i></p>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Add your styles here */
    .menu { display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;}
    .menu button.active { background-color: #d63384; color: white; }
    
    .card { 
        background: white; 
        padding: 20px; 
        border-radius: 10px; 
        cursor: pointer; 
        transition: transform 0.2s; 
        box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
        margin-bottom: 15px;

        /* Reset default button styles */
        border: none;
        text-align: left; /* Buttons align center by default, we want left for text */
        width: 100%;
        font-family: inherit;
        color: inherit;
    }
    .card:hover { transform: translateY(-5px); }

    .read-more { color: #d63384; font-weight: bold; }

    .single-view { background: white; padding: 30px; border-radius: 15px; max-width: 800px; margin: 0 auto; }
    .bratz-reply { background: #fff0f5; border-left: 4px solid #ff69b4; padding: 5px 10px; margin: 5px 0; }
    .comment-box { display: flex; gap: 10px; margin-top: 15px; }
    input { flex: 1; padding: 10px; }
</style>