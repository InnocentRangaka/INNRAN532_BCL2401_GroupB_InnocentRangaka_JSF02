<script>
    import { onMount, tick } from 'svelte';
    import { appStore, initializeProducts } from "../store/store";
    import ProductCards from '../components/ProductCards.svelte';
    import ProductCardSkeleton from '../components/ProductCardSkeleton.svelte';
    import { initializeCategories } from '../api/api'

    const { subscribe, update, fetchProducts } = appStore;

    let app;
    $: app = $appStore;

    let getLocation,
      categoryParams,
      categoryPath;

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

    const fetchAllProducts = (thisType = 'products', thisApp = appStore) => {
      initializeProducts(thisType, thisApp);

      if(app.products.length < productsLength){
        if(!getLocation || getLocation.startsWith('#/') && getLocation.endsWith('#/')){
          appStore.update((state) => ({ ...state, filterItem: "All categories" }));
        }

        initializeCategories(appStore);
        fetchProducts(appStore);
      }
    }

    onMount(async () => {
      fetchAllProducts('products', appStore)
        setTimeout(() => {
            app.loading.page = false;
        }, 2000);
    })

    $: {
      tick().then(() => {
        products;
      });
    }
    
</script>


<div class="grid justify-center">
      {#if app.loading.products}
        <div
          class={
            "container mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none "
            + (app.loading.page ? " my-4" : " my-0")
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