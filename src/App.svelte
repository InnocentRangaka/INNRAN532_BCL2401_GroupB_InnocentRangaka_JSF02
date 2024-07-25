<script>
  import { onMount, afterUpdate } from 'svelte';
  import { appStore, start } from './store/store';
  import Layout from './components/Layout.svelte';

  let app;
  $: app = $appStore;
  let { loading } = $appStore

  start();

  onMount(async () => {
    // console.log(app.pageName)

    setTimeout(() => {
      app.loading.page = false;
    }, 2000);

    // await fetchInitialData();
    // await fetchProductsData();
    // console.log('hello1')
    
  });

  afterUpdate(() => {
    // console.log('hello', loading.page)
	});

</script>

<Layout />

