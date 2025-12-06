<script>
    import Login from './pages/Login.svelte';
    import Home from './pages/Home.svelte'; 
    import Admin from './pages/Admin.svelte';
    import { user } from './stores/userStore.js'; // [NEW] Import the store
    
    let currentPage = 'home';

    // [NEW] Reactive Logic
    // Whenever the $user store changes, run this logic automatically
    $: if ($user) {
        // If user is admin, go to admin page, else home
        if ($user.role === 'admin') {
            currentPage = 'admin';
        } else {
            currentPage = 'home';
        }
    }

    function navigate(page) {
        currentPage = page;
    }
</script>

<main>
    <nav>
        <button on:click={() => navigate('home')}>🏠 Home</button>
        
        {#if $user && $user.role === 'admin'}
            <button on:click={() => navigate('admin')}>👑 Admin</button>
        {/if}

        {#if !$user}
            <button on:click={() => navigate('login')}>🔑 Login</button>
        {:else}
            <button on:click={() => navigate('login')}>👤 {$user.email}</button>
        {/if}
    </nav>

    <div class="content">
        {#if currentPage === 'home'}
            <Home />
        {:else if currentPage === 'admin'}
            {#if $user && $user.role === 'admin'}
                <Admin />
            {:else}
                <p>Access Denied 💅</p>
            {/if}
        {:else if currentPage === 'login'}
            <Login /> 
        {/if}
    </div>
</main>

<style>
    nav { 
        display: flex; 
        gap: 10px; 
        padding: 20px; 
        background: #eee; 
        justify-content: center;
    }
    button {
        padding: 10px 15px;
        cursor: pointer;
        border: none;
        background: white;
        border-radius: 5px;
    }
    button:hover { background: #ddd; }
</style>