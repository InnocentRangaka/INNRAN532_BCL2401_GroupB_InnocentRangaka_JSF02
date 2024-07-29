<script>
  import { onMount, tick } from "svelte";
  import { appStore } from "../store/store";
  import SearchFilterSort from "./SearchFilterSort.svelte"
  // import { navigate } from './router.js';
  // import { pageLoading, loading, pageName } from '../store/store.js';

  import Header from "./Header.svelte";

  const { subscribe, update, fetchProducts } = appStore;

  let app, productPages, currentLocation, currentPage, showTopPart;
  $: app = $appStore;
  let { loading } = $appStore;

  $: productPages = $appStore.pages.productPages
  $: currentLocation = $appStore.currentLocation;
  subscribe((state) => { currentLocation = state.currentLocation });

  $: currentPage = $appStore.pageName;
  subscribe((state) => {
    currentPage = state.pageName
    });

  const isTopPartShown = () =>{
    showTopPart = $appStore.pages.productPages.find(name => name == $appStore.pageName)
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

{#if showTopPart}
    <Header />
{/if}

<main>
    <!-- <div class="min-h-screen flex justify-center items-center">
        <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
        ></div>
    </div> -->

    <div class="page-content">
        {#if showTopPart}
            <SearchFilterSort />
        {/if}

        <h1>{app.pageName}</h1>
        <slot></slot>
    </div>

    <!-- <div class="min-h-screen flex justify-center items-center">
        <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
        ></div>
    </div> -->
</main>
