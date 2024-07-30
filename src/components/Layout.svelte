<script>
  import { onMount, tick } from "svelte";
  import { appStore } from "../store/store";
  import SearchFilterSort from "./SearchFilterSort.svelte"
  import Footer from './Footer.svelte';

  import Header from "./Header.svelte";

  const { subscribe, update, fetchProducts } = appStore;

  let app, productPages, currentLocation, currentPage, showTopPart, error;
  $: app = $appStore;
  let { loading } = $appStore;

  $: productPages = $appStore.pages.productPages
  $: currentLocation = $appStore.currentLocation;
  subscribe((state) => { currentLocation = state.currentLocation });

  $: currentPage = $appStore.pageName;
  subscribe((state) => { currentPage = state.pageName });

  $: currentError = $appStore.error;
  subscribe((state) => { currentError = state.error });

  const isTopPartShown = () =>{
    // showTopPart = $appStore.pages.productPages.find(name => name == $appStore.pageName)

    const isAuthPage = $appStore.pages.authPages.find(name => name == $appStore.pageName), 
    cartPages = $appStore.pages.cartPages.find(name => name == $appStore.pageName);

    showTopPart = (isAuthPage || cartPages) ? false : true;
  }
  
    onMount(async () => {
        isTopPartShown();
    })

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