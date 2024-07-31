<script>
  import { onMount, tick } from 'svelte';
  import { appStore, initializeProducts } from "../store/store";
  import ProductCards from '../components/ProductCards.svelte';
  import ProductCardSkeleton from '../components/ProductCardSkeleton.svelte';
  import { initializeCategories } from '../api/api'
  import NotFound from './NotFound.svelte';

  const { subscribe, update, fetchProducts } = appStore;

  let app;
  $: app = $appStore;

  let getLocation,
    categoryParams,
    categoryPath,
    showHomePage;

  $: categoryParams = app.currentLocation?.params?.category; 
  $: categoryPath = app.currentLocation.path.replace('/products/category/', '');
  $: getLocation = window.location.href.replace(window.location.origin, '').replace(window.location.pathname, '');

  let products;
  $: products = $appStore.products
  subscribe((state) => {
    products = state.products
  });

  let { loading } = $appStore,
  productsLength = 20;

  /**
   * Fetches all products and updates the store.
   * @param {string} thisType - The type of products to fetch.
   * @param {object} thisApp - The application store.
   */
  const fetchAllProducts = (thisType = 'products', thisApp = appStore) => {
    initializeProducts(thisType, thisApp);

    if(app.products.length < productsLength){
      if(getLocation.startsWith('#/') && getLocation.endsWith('#/')){
        appStore.update((state) => ({ ...state, filterItem: "All categories" }));

        initializeCategories(appStore);
        fetchProducts(appStore);
      }
    }
  }

  /**
   * Determines if the home page is shown based on the current location.
   */
  const isHomePageShown = () =>{
    // console.log($appStore.currentLocation)
    // showHomePage = $appStore.pages.productPages.find(name => name == $appStore.pageName)
  }

  /**
   * Lifecycle hook to run on component mount.
   * Fetches all products and updates the loading state.
   */
  onMount(async () => {
    fetchAllProducts('products', appStore)
      setTimeout(() => {
          app.loading.page = false;
      }, 2000);
  })

  $: {
    tick().then(() => {
      products;
      // isHomePageShown();
    });
  }
  
</script>



<!-- {#if showHomePage} -->
  <div class="grid justify-center">
    {#if app.loading.products}
      <div
        class={
          "container mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none my-4"
        }
      >
        {#each Array(20) as i}
          <ProductCardSkeleton />
        {/each}
      </div>
    {/if}
    {#if !app.loading.products && !app.error}
      <ProductCards />
    {/if}
  </div>
<!-- {:else}
  <NotFound />
{/if} -->