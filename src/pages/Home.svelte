<script>
    import { onMount, afterUpdate } from 'svelte';
    import { appStore, initializeProducts } from "../store/store";

    onMount(async () => {
        initializeProducts()
        setTimeout(() => {
            app.loading.page = false;
        }, 2000);
    })
    
</script>


<div class="grid justify-center">
    <div
      class="lg:max-h-[130rem] max-w-xl mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none"
      class={loading ? 'my-4' : 'my-0'}
    >
      {#if loading}
        {#each Array(20) as i}
          <div>{@html productSkeleton()}</div>
        {/each}
      {/if}
      {#if !loading && !error}
        <div>{@html productListCard()}</div>
      {/if}
    </div>
</div>