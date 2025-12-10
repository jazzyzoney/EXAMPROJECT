<script>
    import { onMount } from 'svelte';
    
    let issues = [];
    let selectedIssue = null; // If null, show list. If object, show issue.

    async function loadIssues() {
        const res = await fetch('http://localhost:8080/api/issues');
        const data = await res.json();
        issues = data.data;
    }

    async function openIssue(id) {
        const res = await fetch(`http://localhost:8080/api/issues/${id}`);
        const data = await res.json();
        selectedIssue = data; // Contains { issue, columns: [...] }
    }

    onMount(loadIssues);
</script>

<div class="magazine-rack">
    {#if !selectedIssue}
        <h1>📚 Magazine Archive</h1>
        <div class="grid">
            {#each issues as iss}
                <button class="issue-cover" on:click={() => openIssue(iss.id)}>
                    <div class="logo">BRATZ</div>
                    <h2>{iss.title}</h2>
                    <p>Released: {new Date(iss.publication_date).toLocaleDateString()}</p>
                    <span class="fake-btn">Read Issue</span>
                </button>
            {/each}
        </div>

    {:else}
        <div class="reader">
            <button class="close-btn" on:click={() => selectedIssue = null}>Close Magazine ✖</button>
            
            <header class="mag-header">
                <h1>{selectedIssue.issue.title}</h1>
            </header>

            <div class="columns-layout">
                {#each selectedIssue.columns as col}
                    <div class="column-page {col.author.toLowerCase()}">
                        <h3>{col.topic}</h3>
                        <p class="author">By {col.author}</p>
                        <hr>
                        <p class="text">{col.content}</p>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    /* Styling to look like a magazine */
    .issue-cover { 
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        padding: 40px; 
        text-align: center; 
        border-radius: 5px; 
        cursor: pointer; 
        color: white;
        box-shadow: 5px 5px 15px rgba(0,0,0,0.2); 
        transition: transform 0.2s;
        
        /* Reset default button styles */
        border: none;
        width: 100%;
        display: block; /* Ensure it takes up grid space */
        font-family: inherit;
    }
    .issue-cover:hover { transform: scale(1.05); }

    /* Style the fake inner button */
    .fake-btn {
        background: white;
        color: #d63384;
        padding: 5px 15px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.9rem;
        display: inline-block;
        margin-top: 10px;
    }
    
    .logo { font-size: 2rem; font-weight: bold; letter-spacing: 5px; margin-bottom: 20px; }

    .reader { background: #fdfdfd; min-height: 100vh; padding: 20px; }
    .columns-layout { 
        display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; 
        max-width: 1200px; margin: 0 auto;
    }
    .column-page { 
        background: white; padding: 20px; border: 1px solid #ddd; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        font-family: 'Times New Roman', serif;
    }
    .column-page h3 { text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid black; padding-bottom: 10px; }
    
    /* Specific styles for authors */
    .jade h3 { border-color: #39ff14; color: #333; }
    .cloe h3 { border-color: #ff69b4; color: #d63384; }
</style>