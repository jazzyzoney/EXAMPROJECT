<script>
  import { onMount } from "svelte"
  import { user } from "../stores/userStore.js"
  import { currentPage } from "../stores/pageStore.js"
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'

  let email = ""
  let password = ""

  onMount(async () => {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth-check", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()

        if (data.user) {
            $user = data.user;
            $currentPage = 'home'
        }
      }
    } catch (e) {
      console.log("Not logged in")
    }
  })

  //email
  // async function sendEmailTrigger(type) {
  //   await fetch("http://localhost:8080/api/send-email", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, type }),
  //       credentials: "include"
  //   })
  // }

  //signup
  async function handleSignup() {
    const res = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    })

    const data = await res.json()
    if (res.ok) {
      toastr.success("Account created. Check your email!", "Success")
    } else {
      toastr.error(data.message, "Signup failed")
    }
  }

  //login
  async function handleLogin() {
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    })

    const data = await res.json()

    if (res.ok) {
      $user = data.user

      toastr.success("Welcome back!", "Login Successful");
      $currentPage = 'home';
    } else {
      toastr.error(data.message, "Login Failed")
    }
  }

</script>

<main>
    <div class="card">
      <h1>Login</h1>
      <input type="email" bind:value={email} placeholder="Email" />
      <input type="password" bind:value={password} placeholder="Password" />
      
      <div class="buttons">
        <button on:click={handleLogin}>Login</button>
        </div>
    </div>
</main>

<!-- <main>
  {#if $user}
    <div class="card">
      <h2>Hello, {$user.email}</h2>
      <p>You are logged in as: <strong>{$user.role}</strong></p>
      <button class="logout-btn" on:click={handleLogout}>Logout</button>
    </div>
  {:else}
    <div class="card">
      <input type="email" bind:value={email} placeholder="Email" />
      <input type="password" bind:value={password} placeholder="Password" />
      
      <div class="buttons">
        <button on:click={handleLogin}>Login</button>
        <button on:click={handleSignup}>Sign Up</button>
      </div>
    </div>
  {/if}
</main> -->

<style>
  main { max-width: 400px; margin: 60px auto; text-align: center; }
  .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  input { width: 90%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; }
  button { padding: 10px 20px; background: #333; color: white; border: none; cursor: pointer; border-radius: 4px;}
</style>