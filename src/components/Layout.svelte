<script>
  import { onMount, tick } from "svelte";
  import { appStore } from "../store/store";
  import SearchFilterSort from "./SearchFilterSort.svelte"
  import Footer from './Footer.svelte';
  import Header from "./Header.svelte";

  const { subscribe, update, fetchProducts } = appStore;

  /** @type {Object} The app state. */
  let app, productPages, currentLocation, currentPage, showTopPart, error;
  
  $: app = $appStore;

  /** @type {boolean} Loading state from the app store. */
  let { loading } = $appStore;

  /** @type {Array} List of product pages. */
  $: productPages = $appStore.pages.productPages;

  /** @type {string} The current location in the app. */
  $: currentLocation = $appStore.currentLocation;

  /** @type {string} The name of the current page. */
  $: currentPage = $appStore.pageName;

  /** @type {string} Current error message from the app store. */
  $: currentError = $appStore.error;

  /**
   * Determines if the top part of the page should be shown.
   * Updates the `showTopPart` variable based on the current page.
   */
  const isTopPartShown = () => {
    const pages = $appStore?.pages || {};
    const isAuthPage = pages.authPages?.find(name => name === $appStore.pageName);
    const cartPages = pages.cartPages?.find(name => name === $appStore.pageName);

    showTopPart = !(isAuthPage || cartPages);
  }

  /**
   * Lifecycle method to run on component mount.
   * Initializes the visibility of the top part of the page.
   */
  onMount(async () => {
    isTopPartShown();
  });

  /**
   * Reactive statement to re-evaluate the visibility of the top part of the page
   * whenever the `currentPage` or any other dependencies change.
   */
  $: {
    tick().then(() => {
      isTopPartShown();
      currentPage;
    });
  }

  // Subscribe to store updates
  $: {
    if ($appStore) {
      productPages = $appStore.pages?.productPages || [];
      currentLocation = $appStore.currentLocation || {};
      currentPage = $appStore.pageName || '';
      currentError = $appStore.error || null;
    }
  }
  </script>
  

<!-- {#if showTopPart} -->
    <Header />
<!-- {/if} -->

<main>

    <div class="page-content">
        <!-- {#if showTopPart} -->
            <SearchFilterSort />
        <!-- {/if} -->

        <!-- Error -->
        {#if currentError}
            <div class="w-full flex justify-center">
                <p class="mt-28 text-red-500 text-xl font-bold">
                    {currentError.message}
                </p>
            </div>
        {/if}

        <!-- Content -->
        <slot></slot>
    </div>

</main>

<!-- Footer -->
<Footer />