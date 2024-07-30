<script>
    import { onMount, afterUpdate, tick } from 'svelte';
    import { appStore, initializeProducts } from "../store/store";
    import ProductCards from '../components/ProductCards.svelte';
    import ProductCardSkeleton from '../components/ProductCardSkeleton.svelte';
    import { fetchFavourites } from '../api/api';
    import { createUniqueArray, uniqueObjects } from '../utils/utils'

    const { subscribe, update, addToCart } = appStore;

    update((state) => ({ ...state, 
        products: [], 
        originalProducts: []
    }));

    let app;
    $: app = $appStore;
    $: products = $appStore.products

    let wishListItems = 0;
    $: wishListItems = Object.values(app.wishList).length;
    subscribe((state) => {
      wishListItems = Object.values(state.wishList).length;
    });

    let wishListIds;
    $: wishListIds = Object.keys(app.wishList);
    subscribe((state) => {
        wishListIds = Object.keys(state.wishList);
    });

    let { loading } = $appStore

    
    let fetchedData,
        list = [];
    

    export const fetchWishItems = async (objectArray, thisStore = appStore, thisApp = app) => {
        if(!objectArray){ return; }

        thisStore.update((state) => ({
            ...state,
            loading: { ...state.loading, products: true },
        }));

        const getIds = [...new Set(Object.values(objectArray))];

        list = [];
        let cleanList = []

        for (const id of getIds) {
            const response = await fetch(`https://fakestoreapi.com/products/${id}`);
            fetchedData = await response.json();

            if (fetchedData.id) {
                list.push(fetchedData);
            }
        }

        if (list.length > 0) {
            cleanList = uniqueObjects(list, 'id')
            thisStore.update((state) => ({ ...state, 
                products: cleanList, 
                originalProducts: JSON.parse(JSON.stringify(cleanList))
            }));
        }

        
        thisStore.update((state) => ({
            ...state,
            loading: { ...state.loading, products: false },
        }));

        setTimeout(() => {
            thisStore.update((state) => ({
                ...state,
                loading: { ...state.loading, page: false },
            }));
        }, 1000);
        
        return {response: cleanList};
    };


    async function loadWishItems(thisIds = wishListIds, thisStore = appStore, thisApp = app ){
        await fetchWishItems(thisIds, thisStore, thisApp)
        if(app.products?.length !== wishListItems){
            let fetchedProducts = await fetchWishItems(thisIds, thisStore, thisApp),
            cleanList = uniqueObjects(fetchedProducts.response, "id");

            thisStore.update((state) => ({ ...state, products: cleanList })); 
        }
    }

    onMount(async () => {
        await loadWishItems(wishListIds, appStore, app)
    })

    $: {
      tick().then(async () => {
        loadWishItems();
        wishListItems;
      });
    }

</script>

{#if wishListIds > 0}
    <div class="grid justify-center">
        {#if app.loading.products}
            <div
                class={
                    "container mx-auto grid gap-4 grid-cols-1 lg:grid-cols-4 md:grid-cols-2 items-center lg:max-w-none "
                    + (app.loading.page ? " my-4" : " my-0")
                }
            >
                {#each Array(wishListItems) as i}
                    <ProductCardSkeleton />
                {/each}
            </div>
        {/if}
        {#if !app.loading.products && !app.error}
            <ProductCards />
        {/if}
    </div>
{:else}
    <div class="container min-h-full text-center mx-auto pt-20">
        <div class="w-full min-h-full text-center">
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">No item found</h1>
            <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find any item in your wishlist.</p>
            <div class="mt-10 flex items-center justify-center gap-4">
                
                <a href="/#/" class="cursor-pointer rounded-md hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
                    <span class="mb-[0.12rem] font-semibold">
                        Continue shopping
                    </span>
                </a>
            </div>
        </div>
    </div>
{/if}