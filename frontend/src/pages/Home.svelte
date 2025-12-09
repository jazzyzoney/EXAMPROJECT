<script>
    import { onMount } from 'svelte';
    
    let blogs = [];
    let isLoading = true;
    let errorMsg = "";

    onMount(async () => {
        try {
            // [FIX] Add ?status=published to the URL
            const response = await fetch('http://localhost:8080/api/blogs?status=published');
            const result = await response.json();

            //if (!response.ok) throw new Error("Backend connection failed");
            // [DEBUG] Check what you are actually getting

            console.log("Blogs received:", result);
            
            blogs = result.data;

        } catch (error) {
            console.error("Error:", error);
            errorMsg = "Could not fetch blogs.";
        } finally {
            isLoading = false;
        }
    });
</script>

<main>
    <h1>✨ Bratz Blog Feed ✨</h1>
    </main>