<script>
    import { onMount, afterUpdate } from 'svelte';
    import { params, location } from 'svelte-spa-router';
    // import { page } from "../store/store";
    import { appStore, initializeProducts } from "../store/store";
    import { fetchSingleProduct } from '../api/api';
    import ProductCards from '../components/ProductCards.svelte';
	import ProductDetailSkeleton from '../components/ProductDetailSkeleton.svelte';
    import { splitUrlPathname } from '../utils/utils'

    const { subscribe, update } = appStore;

    update((state) => ({ ...state, loading: { ...state.loading, products: true }, }))

    let urlPath = $location;

    let id  = $params?.id || null;

    if(!id){
        const isProductPath = urlPath.startsWith('/product/')
        const reducedPath = isProductPath ? splitUrlPathname(urlPath).pop() : urlPath;
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
    $: loadingProducts = $appStore.loading.products;
    subscribe((state) => {
        loadingProducts = state.loading.products;
    });

    onMount(async () => {
        // initializeProducts()
        await fetchSingleProduct(id, appStore)
        setTimeout(() => {
            update((state) => ({ ...state, loading: { ...state.loading, products: false }, }))
        }, 2000);
    })
    
</script>

    {#if loadingProducts}
            <div class="w-full lg:max-h-[130rem] max-w-xl mx-auto grid gap-4 grid-cols-1 items-center lg:max-w-none my-4">
                <ProductDetailSkeleton />
            </div>
    {/if}
    {#if !loadingProducts && !app.error}
        <h1>Product Detail View { id }</h1>

        <div>

            <div class="container mx-auto bg-white p-8 rounded-lg shadow-md mb-4">
            {#if product}
                <!-- Modal Content -->
                <div class="mt-6 sm:mt-8 lg:flex lg:items-start lg:max-w-7xl xl:max-w-8xl mx-auto ">
                    <div class="mx-auto w-2/5 flex-none -mt-2">
                        <img src="{product.image}" alt="" class="w-[90%] h-[90%]" />
                    </div>
                    <div class="mx-auto w-[90%] space-y-2 -mt-2">
                        <h1 class="text-2xl md:text-4xl lg:text-4xl font-bold">{product.title}</h1>
                        {#if product.rating}
                        <div class="flex gap-2 place-items-baseline items-center">
                            <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                            </svg>
                            <div>{product.rating.rate}</div>
                            <div>Reviews: {product.rating.count}</div>
                        </div>
                        {/if}
                        <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        {product.category}
                        </span>
                        <h3 class="text-xl md:text-2xl lg:text-2xl font-bold">{currency} {product.price}</h3>
                        <button on:click="{(event) => addToCart(product, event.target)}" class="inline-flex justify-center bg-cyan-700 hover:bg-cyan-900 w-[90%] md:w-[14rem] lg:w-[14rem] font-bold text-white py-2 px-4 rounded" disabled="{cart.addToCartText !== 'Add to Cart'}">
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
