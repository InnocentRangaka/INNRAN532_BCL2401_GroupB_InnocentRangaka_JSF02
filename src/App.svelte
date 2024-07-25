<script>
  import { onMount, afterUpdate } from 'svelte';
  import { appStore } from './store/store';

  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

  let app;
  $: app = $appStore;
  let { loading } = $appStore

  onMount(async () => {
    // await fetchInitialData();
    // await fetchProductsData();
    console.log('hello1')
    
  });

  afterUpdate(() => {
    console.log('hello', loading.page)
		appStore.update((state) => ({...state, loading: {...state.loading, page: false } }));
	});

</script>

<main>

  {#if app.loading.page}
    <div>
      <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} class="logo" alt="Vite Logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer">
        <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
      </a>
    </div>
  {:else}
    <h1>Vite + Svelte</h1>

    <div class="card">
      <Counter />
    </div>

    <p>
      Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
    </p>

    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
  {/if}

  
  
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
