<script>
    import Login from './lib/Login.svelte';
    import Feed from './lib/Feed.svelte'; // Create this (it was your main page before)
    import Admin from './lib/Admin.svelte';
    import Corners from './lib/Corners.svelte';
    import Navbar from './lib/Navbar.svelte'; // Optional helper
    
    // State to track which page is open
    let currentPage = 'home';
    let user = null; // To track if logged in

    // Function to change pages (passed down to components)
    function navigate(page) {
        currentPage = page;
    }

    function handleLogin(loggedInUser) {
        user = loggedInUser;
        currentPage = user.role === 'admin' ? 'admin' : 'home';
    }
</script>

<main>
    <nav>
        <button on:click={() => navigate('home')}>🏠 Home</button>
        <button on:click={() => navigate('corners')}>✨ Corners</button>
        {#if user && user.role === 'admin'}
            <button on:click={() => navigate('admin')}>👑 Admin</button>
        {/if}
        {#if !user}
            <button on:click={() => navigate('login')}>🔑 Login</button>
        {/if}
    </nav>

    {#if currentPage === 'home'}
        <Feed />
    {:else if currentPage === 'corners'}
        <Corners />
    {:else if currentPage === 'admin'}
        <Admin />
    {:else if currentPage === 'login'}
        <Login on:loginSuccess={(e) => handleLogin(e.detail)} /> 
    {/if}
</main>