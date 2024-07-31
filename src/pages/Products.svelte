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

  /** @type {Object} The app state. */
  let app;
  $: app = $appStore;

  /** @type {string} The current location of the window. */
  let getLocation,
      categoryParams,
      categoryPath;

  /** @type {string} The category from URL parameters. */
  $: categoryParams = app.currentLocation?.params?.category;

  /** @type {string} The path of the current category. */
  $: categoryPath = app.currentLocation.path.replace('/products/category/', '');

  /** @type {string} The current location URL path. */
  $: getLocation = window.location.href.replace(window.location.origin, '');

  /** @type {string} The name of the category to find, defaults to "All categories". */
  let findCategory = "All categories";
  $: findCategory = params.category;

  /** @type {string} The category being viewed. */
  let category = findCategory;
  $: category = findCategory;
  appStore.subscribe((state) => {
    category = findCategory;
  });

  /**
   * Get the category from the store.
   * @param {Object} thisApp - The current app state.
   * @param {Object} thisStore - The app store.
   * @param {string} thisCategory - The category to find.
   * @returns {string|undefined} - The found category or undefined if not found.
   */
  const getStoreCategory = (thisApp, thisStore = appStore, thisCategory) => {
    let appCategories = thisStore.categories;
    if(!appCategories){
      () => initializeCategories(thisStore)
      appCategories = thisApp.categories;
    }

    return appCategories ? appCategories.find(categoryName => categoryName.startsWith(thisCategory)) : undefined;
  }

  /**
   * Initialize products based on the current category.
   * @param {Object} [thisApp=app] - The current app state.
   * @param {Object} [thisStore=appStore] - The app store.
   * @param {string} [thisCategory=category] - The category to initialize products for.
   */
  const initializeProducts = async (thisApp = app, thisStore = appStore, thisCategory = category) => {
    const storeCategory = getStoreCategory(thisApp, thisStore, thisCategory);

    thisStore.update((state) => ({ ...state, filterItem: storeCategory }));
    fetchProducts(thisStore)
    categoryProducts = app.products;
  }

  /**
   * Lifecycle method to run on component mount.
   * Initializes products and sets loading states.
   */
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

  /**
   * Reactive statement to initialize products and update category.
   */
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
        "container mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none my-4"
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
