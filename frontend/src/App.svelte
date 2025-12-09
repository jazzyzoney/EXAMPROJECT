<script>
    import Login from './pages/Login.svelte';
    import Home from './pages/Home.svelte'; 
    import Admin from './pages/Admin.svelte';
    import Corners from './pages/Corners.svelte';
    import StyleSOS from './pages/StyleSOS.svelte';
    import { user } from './stores/userStore.js';
    import { currentPage } from './stores/pageStore.js';
    
    // Reactive Logic
    $: if ($user) {
        if ($user.role === 'admin') {
            $currentPage = 'admin';
        } else {
            $currentPage = 'home';
        }
    }

    function navigate(page) {
        $currentPage = page;
    }
</script>

<header>
    <div class="branding">
        <img src="./images/sasha_logo.png" alt="Sasha Logo" class="site-logo" />
        <img src="./images/cloe_logo.png" alt="Cloe Logo" class="site-logo" /> 

        <h1 class="site-title">Bratz Magazine</h1>

        <img src="./images/jade_logo.png" alt="Jade Logo" class="site-logo" />
        <img src="./images/yasmin_logo1.png" alt="Yasmin Logo" class="site-logo" />
    </div>

    <nav>
        <button on:click={() => navigate('home')} class:active={$currentPage === 'home'}>
            🏠 Home
        </button>
        
        <button on:click={() => navigate('corners')} class:active={$currentPage === 'corners'}>
            ✨ Corners
        </button>
        
        <button on:click={() => navigate('sos')} class:active={$currentPage === 'sos'}>
            💋 Style SOS
        </button>
        
        {#if $user && $user.role === 'admin'}
            <button on:click={() => navigate('admin')} class:active={$currentPage === 'admin'}>
                👑 Admin
            </button>
        {/if}

        {#if !$user}
            <button on:click={() => navigate('login')} class:active={$currentPage === 'login'}>
                🔑 Login
            </button>
        {:else}
            <button class="user-btn" on:click={() => navigate('login')}>
                👤 {$user.username || $user.email}
            </button>
        {/if}
    </nav>
</header>

<main>
    <div class="content-card">
        {#key $currentPage} 
            {#if $currentPage === 'home'}
                <Home />
            {:else if $currentPage === 'corners'}
                <Corners />
            {:else if $currentPage === 'sos'}
                <StyleSOS />
            {:else if $currentPage === 'admin'}
                {#if $user && $user.role === 'admin'}
                    <Admin />
                {:else}
                    <p>Access Denied 💅</p>
                {/if}
            {:else if $currentPage === 'login'}
                <Login /> 
            {/if}
        {/key}
    </div>
</main>

<style>
    /* GLOBAL BACKGROUND STYLE */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        /* Soft Pink/Purple Gradient */
        background: linear-gradient(135deg, #fff0f5 0%, #e6e6fa 100%);
        min-height: 100vh;
        color: #333;
    }

    /* HEADER STYLES */
    header {
        background-color: white;
        padding-top: 20px;
        padding-bottom: 0;
        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
    }

    .branding {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-bottom: 15px;
    }

    .site-logo {
        height: 60px; /* Adjust based on your image size */
        width: auto;
    }

    .site-title {
        margin: 0;
        font-size: 2.5rem;
        color: #d63384; /* Deep Bratz Pink */
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 2px 2px 0px #ffc0cb;
    }

    /* NAVIGATION STYLES */
    nav { 
        display: flex; 
        gap: 15px; 
        padding: 15px; 
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5); /* Slight transparency */
        border-top: 1px solid #ffe4e1;
    }

    button {
        padding: 10px 20px;
        cursor: pointer;
        border: 2px solid transparent;
        background: white;
        border-radius: 25px; /* Pill shape */
        font-size: 1rem;
        font-weight: bold;
        color: #555;
        transition: all 0.2s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    button:hover { 
        background-color: #fff0f5; 
        color: #d63384;
        transform: translateY(-2px);
    }

    button.active {
        background-color: #d63384;
        color: white;
        box-shadow: 0 4px 10px rgba(214, 51, 132, 0.4);
    }

    .user-btn {
        border-color: #d63384;
        color: #d63384;
    }

    /* MAIN CONTAINER */
    main {
        padding: 20px;
        max-width: 1200px; /* Prevents content from getting too wide */
        margin: 0 auto;
    }

    .content-card {
        /* Optional: Gives content a white background card effect */
        background: rgba(255, 255, 255, 0.8);
        padding: 20px;
        border-radius: 20px;
    }
</style>