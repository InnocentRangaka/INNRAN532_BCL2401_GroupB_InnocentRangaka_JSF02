<script>
  import { onMount, afterUpdate } from 'svelte';
  import { appStore, start } from './store/store';
  import { init } from './utils/utils';
  import Layout from './components/Layout.svelte';

  let app;
  $: app = $appStore;
  let { loading } = $appStore

  start();

  onMount(async () => {
    console.log(app.pageName)

    setTimeout(() => {
      app.loading.page = false;
    }, 2000);

    // await fetchInitialData();
    // await fetchProductsData();
    console.log('hello1')
    
  });

  afterUpdate(() => {
    console.log('hello', loading.page)
		appStore.update((state) => ({...state, loading: {...state.loading, page: false } }));
	});

</script>

<Layout />

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
