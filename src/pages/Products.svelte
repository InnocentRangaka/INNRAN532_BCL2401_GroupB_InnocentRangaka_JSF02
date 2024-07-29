<script>
    import { onMount, tick } from 'svelte';
    import { get } from 'svelte/store';
    import { appStore } from "../store/store";
    import ProductCards from '../components/ProductCards.svelte';
    import ProductCardSkeleton from '../components/ProductCardSkeleton.svelte';
    import { splitUrlPathname } from '../utils/utils'
    import { initializeCategories } from '../api/api';

    const { subscribe, update, fetchProducts } = appStore;

    export let params;
    export let categoryProducts;

    let app;
    $: app = $appStore;

    let getLocation,
      categoryParams,
      categoryPath;

    $: categoryParams = app.currentLocation?.params?.category; 
    $: categoryPath = app.currentLocation.path.replace('/products/category/', '');
    $: getLocation = window.location.href.replace(window.location.origin, '');

    let findCategory = "All categories";
    $: findCategory = params.category;

    let category = findCategory;
    $: category = findCategory;
    appStore.subscribe((state) => {
      category = findCategory;
    });

    const getStoreCategory = (thisApp, thisStore = appStore, thisCategory) => {
      let appCategories = thisStore.categories;
      if(!appCategories){
        () => initializeCategories(thisStore)
        appCategories = thisApp.categories;
      }

      return appCategories ? appCategories.find(categoryName => categoryName.startsWith(thisCategory)) : undefined;
    }

    const initializeProducts = async (thisApp = app, thisStore = appStore, thisCategory = category) => {

      const storeCategory = getStoreCategory(thisApp, thisStore, thisCategory);
      
      thisStore.update((state) => ({ ...state, filterItem: storeCategory }));
      fetchProducts(thisStore)
      categoryProducts = app.products;
    }

    onMount(async () => {
      await initializeProducts(app, appStore, category);
      if(!app.products){
        fetchProducts(appStore)
        categoryProducts = app.products
      }

      setTimeout(() => {
        if(app.products){
          app.loading.page = false;
          app.loading.products = false
        }
      }, 1000);
    });

    $: {
      tick().then(() => {
        initializeProducts();
        category;
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
    <ProductCards {categoryProducts} />
  {/if}
</div>