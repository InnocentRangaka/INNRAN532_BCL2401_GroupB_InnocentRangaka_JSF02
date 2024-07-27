<script>
  import { onMount, afterUpdate } from "svelte";
  import { params, location } from "svelte-spa-router";
  // import { page } from "../store/store";
  import { appStore, initializeProducts } from "../store/store";
  import { fetchSingleProduct } from "../api/api";
  import ProductCards from "../components/ProductCards.svelte";
  import ProductDetailSkeleton from "../components/ProductDetailSkeleton.svelte";
  import TopBackLink from "../components/TopBackLink.svelte";
  import RatingStars from '../components/RatingStars.svelte'
  import { splitUrlPathname } from "../utils/utils";

  const { subscribe, update, addToCart } = appStore;

  update((state) => ({
    ...state,
    loading: { ...state.loading, products: true },
  }));

  let urlPath = $location;

  let id = $params?.id || null;

  if (!id) {
    const isProductPath = urlPath.startsWith("/product/");
    const reducedPath = isProductPath
      ? splitUrlPathname(urlPath).pop()
      : urlPath;
    id = reducedPath;
  }

  let app;
  $: app = $appStore;

  let product;
  $: product = $appStore.viewProduct;
  subscribe((state) => {
    product = state.viewProduct;
  });

  let currency;
  $: currency = $appStore.currency;
  subscribe((state) => {
    currency = state.currency;
  });

  let cart;
  $: cart = $appStore.cart;
  subscribe((state) => {
    cart = state.cart;
  });

  let loadingProducts;
  $: loadingProducts = app.loading.products;
  subscribe((state) => {
    loadingProducts = state.loading.products;
  });

  onMount(async () => {
    await fetchSingleProduct(id, appStore);
    setTimeout(() => {
      update((state) => ({
        ...state,
        loading: { ...state.loading, products: false },
      }));
    }, 2000);
  });

//   console.log(cart)
// console.log(window.location)
</script>

{#if loadingProducts}
  <div
    class="container mx-auto grid gap-4 grid-cols-1 items-center lg:max-w-none my-4"
  >
    <ProductDetailSkeleton />
  </div>
{/if}
{#if !loadingProducts && !app.error}
  <h1>Product Detail View {id}</h1>
  <TopBackLink />

  <div>
    <div class="container mx-auto bg-white p-8 rounded-lg shadow-md mb-4">
      {#if product}
        <div
          class="mt-6 sm:mt-8 lg:flex lg:items-start lg:max-w-7xl xl:max-w-8xl mx-auto"
        >
          <div class="mx-auto w-2/5 flex-none -mt-2">
            <img src={product.image} alt="" class="w-[90%] h-[90%]" />
          </div>
          <div class="mx-auto w-[90%] space-y-2 -mt-2">
            <h1 class="text-2xl md:text-4xl lg:text-4xl font-bold">
              {product.title}
            </h1>
            {#if product.rating}
              <div class="flex gap-2 place-items-baseline items-center">
                <RatingStars ratingNumber={product.rating.rate} />
                <div>{product.rating.rate}</div>
                <span>|</span>
                <div>Reviews: {product.rating.count}</div>
              </div>
            {/if}
            <span
              class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >
              {product.category}
            </span>
            <h3 class="text-xl md:text-2xl lg:text-2xl font-bold">
              {currency}
              {product.price}
            </h3>
            <button
              on:click={(event) => addToCart(product, event.target)}
              class="inline-flex justify-center bg-cyan-700 hover:bg-cyan-900 w-[90%] md:w-[14rem] lg:w-[14rem] font-bold text-white py-2 px-4 rounded"
              disabled={cart.addToCartText !== "Add to Cart"}
            >
              {cart.addToCartText}
            </button>
            <h2 class="text-lg font-bold">Description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
