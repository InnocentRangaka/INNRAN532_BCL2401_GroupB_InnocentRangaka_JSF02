<script>
    import { get } from 'svelte/store';
    import { onMount, afterUpdate, tick } from "svelte";
    import { link } from 'svelte-spa-router';
    import { appStore } from "../store/store";
    import RatingStars from './RatingStars.svelte'

    const { subscribe, addToCart, isInWishList } = appStore;

    /**
     * @typedef {Object} AppState
     * @property {Array} products - List of products.
     * @property {string} currency - Currency symbol.
     * @property {Array} cart - Shopping cart items.
     * @property {Object} modal - Modal state.
     */

    /** @type {Object} The app state. */
    let app;
    $: app = appStore;

    /** @type {Array} List of products. */
    let products;
    /**
     * Reactively updates the `products` variable whenever the app store changes.
     */
    $: products = $appStore.products;
    /**
     * Subscribes to app store and sets local state variables.
     */
    appStore.subscribe((state) => {
      products = $appStore.products;
    });

    /** @type {string} Currency symbol. */
    let currency = '$';
    /**
     * Reactively updates the `currency` variable whenever the app store changes.
     */
    $: currency = $appStore.currency;
    
    /** @type {Object} Cart details from the app store. */
    let cart = get(appStore).cart;
    
    /** @type {Object} Modal state from the app store. */
    let modal = get(appStore).modal;

    /**
     * Reactive statement to update the products list
     * whenever the state of the app store changes.
     */
    $: {
      tick().then(() => {
        products;
      });
    }

</script>
  
{#if products}
<div class="container lg:max-h-[130rem] mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none my-4 px-2 md:px-0">
  {#each products as product }
    <div class="flex flex-col max-h-[130rem] max-w-80 hover:-translate-y-1 hover:scale-105 duration-300 bg-white border border-slate-200 shadow shadow-slate-950/5 rounded-2xl overflow-hidden">
      <a 
        href="/product/{product.id}"
        use:link
        class="flex-1 flex flex-col"
      >
        <img
          class="object-contain h-48 mt-3 cursor-pointer"
          src={product.image}
          alt={product.title}
        />
      </a>
      <div class="flex-1 flex flex-col p-6">
        <div class="flex-1">
          <header class="mb-2 flex-2">
            <div class="text-slate-600 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 min-h-[49.5px]">
              <a
                href="/product/{product.id}"
                use:link
              >
                <h2
                  class="cursor-pointer text-lg line-clamp-2 font-extrabold leading-snug"
                >
                  {product.title}
                </h2>
              </a>
            </div>
          </header>
          {#if product.rating}
            <div class="flex items-left -ml-2 mb-2">
               <RatingStars ratingNumber={product.rating.rate} />
            </div>
          {/if}
          <div class="text-base line-clamp-2 font-extrabold text-slate-500 leading-snug">
            <h2>{currency} {product.price}</h2>
          </div>
        </div>
        <div class="flex mt-1 space-x-2 place-items-center">
          <div class="justify-start flex-1">
            <span
              class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
            >
              {product.category}
            </span>
          </div>
          <div class="flex justify-end space-x-2 place-items-center items-center">
            <button
              class={isInWishList(product.id) ? 'cursor-pointer text-red-500' : 'cursor-pointer'}
              on:click={() => app.addToFavourites(product.id)}
            >
              <svg
                class="me-1.5 h-5 w-5 hover:fill-red-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                transform="scale(1.6)"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                />
              </svg>
            </button>
            <button
              id={`add-to-cart-${product.id}`}
              on:click={() => addToCart(product, event.target)}
              class="cursor-pointer inline-flex justify-center whitespace-nowrap rounded-lg bg-cyan-700 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors"
            >
              {cart.addToCartText}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
{/if}