<script>
    import { onMount, afterUpdate } from 'svelte';
    import { appStore, initializeProducts } from "../store/store";
    import ProductCards from '../components/productCards.svelte';

    let app;
    $: app = $appStore;
    $: products = $appStore.products
    let { loading } = $appStore

    onMount(async () => {
        initializeProducts()
        setTimeout(() => {
            app.loading.page = false;
        }, 2000);
    })

    
    console.log(products)
    
</script>


<div class="grid justify-center">
      {#if app.loading.products}
        <div
          class={
            "lg:max-h-[130rem] max-w-xl mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none "
            + (app.loading.page ? " my-4" : " my-0")
          }
        >
          {#each Array(20) as i}
            <!-- <div>{@html productSkeleton()}</div> -->
            <h1>Loading...</h1>
          {/each}
        </div>
      {/if}
      {#if !app.loading.products && !app.error}
        <ProductCards />
      {/if}
</div>