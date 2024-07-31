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
    subscribe((state) => { currentLocation = state.currentLocation });
  
    /** @type {string} The name of the current page. */
    $: currentPage = $appStore.pageName;
    subscribe((state) => { currentPage = state.pageName });
  
    /** @type {string} Current error message from the app store. */
    $: currentError = $appStore.error;
    subscribe((state) => { currentError = state.error });
  
    /**
     * Determines if the top part of the page should be shown.
     * Updates the `showTopPart` variable based on the current page.
     */
    const isTopPartShown = () => {
      const isAuthPage = $appStore.pages.authPages.find(name => name == $appStore.pageName);
      const cartPages = $appStore.pages.cartPages.find(name => name == $appStore.pageName);
  
      showTopPart = (isAuthPage || cartPages) ? false : true;
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