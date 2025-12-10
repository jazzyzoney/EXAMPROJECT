<script>
    import { onMount } from 'svelte';
    import { user } from '../stores/userStore.js';
    import { currentPostId, currentPage } from '../stores/pageStore.js';

    let blog = null;
    let comments = [];
    let newComment = "";

    onMount(async () => {
        if (!$currentPostId) {
            $currentPage = 'home'; // Safety: Go back if no ID set
            return;
        }
        await loadBlog();
        await loadComments();
    });

    async function loadBlog() {
        const res = await fetch(`http://localhost:8080/api/blogs/${$currentPostId}`);
        const data = await res.json();
        blog = data.data;
    }

    async function loadComments() {
        const res = await fetch(`http://localhost:8080/api/comments/${$currentPostId}`);
        const data = await res.json();
        comments = data.data;
    }

    async function postComment() {
        if (!newComment.trim()) return;

        await fetch('http://localhost:8080/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blogId: $currentPostId, content: newComment }),
            credentials: 'include'
        });

        newComment = "";
        loadComments(); // Refresh list
    }
</script>

<div class="single-post-container">
    <button class="back-btn" on:click={() => $currentPage = 'home'}>← Back to Feed</button>

    {#if blog}
        <article>
            <h1>{blog.title}</h1>
            <p class="meta">By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}</p>
            <div class="blog-body">
                {@html blog.content} </div>
        </article>

        <section class="comments-section">
            <h3>Comments ({comments.length})</h3>

            <div class="comments-list">
                {#each comments as c}
                    <div class="comment {c.role === 'admin' ? 'bratz-reply' : ''}">
                        <strong>{c.username} {c.role === 'admin' ? '👑' : ''}:</strong>
                        <p>{c.content}</p>
                    </div>
                {/each}
            </div>

            {#if $user}
                <div class="comment-box">
                    <textarea bind:value={newComment} placeholder={$user.role === 'admin' ? "Reply as a Bratz..." : "Leave a comment..."}></textarea>
                    <button on:click={postComment}>Post</button>
                </div>
            {:else}
                <p><i>Login to join the conversation!</i></p>
            {/if}
        </section>
    {:else}
        <p>Loading...</p>
    {/if}
</div>

<style>
    .single-post-container { max-width: 800px; margin: 0 auto; padding: 20px; background: white; border-radius: 10px; }
    .back-btn { background: none; border: none; color: #d63384; cursor: pointer; margin-bottom: 20px; }
    
    article { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
    h1 { color: #d63384; margin-bottom: 5px; }
    .meta { color: #888; font-size: 0.9rem; margin-bottom: 20px; }
    .blog-body { line-height: 1.6; white-space: pre-wrap; }

    .comment { padding: 10px; border-bottom: 1px solid #f0f0f0; }
    .comment strong { color: #555; }
    
    /* Highlight Bratz Replies */
    .bratz-reply { background-color: #fff0f5; border-left: 4px solid #ff69b4; border-radius: 4px; }
    .bratz-reply strong { color: #d63384; }

    .comment-box { display: flex; gap: 10px; margin-top: 20px; }
    textarea { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
    button { background: #d63384; color: white; border: none; padding: 0 20px; border-radius: 5px; cursor: pointer; }
</style>