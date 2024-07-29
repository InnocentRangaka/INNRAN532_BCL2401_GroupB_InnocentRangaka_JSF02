<script>
    import { onMount, tick } from 'svelte';
    import { appStore } from "../store/store";
    import { calculateSubTotalAmount, calculateCartTotal, calculateTaxAmount, renderPage, fetchPage, getUrlMainPage } from '../utils/utils'

    const { subscribe, update, addToCart, isInCartItems } = appStore;

    // update((state) => ({ ...state, 
    //     products: [], 
    //     originalProducts: []
    // }));

    let app;
    $: app = $appStore;
    $: products = $appStore.products
  
    let cart;
    $: cart = app.cart;
    subscribe((state) => {
        cart = state.cart;
    });

    let {
        isAddingToCart,
        addToCartText,
        shippingRate,
        shippingMethod,
        cartItems,
        totalItems, 
        subTotalAmount, 
        taxAmount,
        totalAmount
    } = cart;

    $: isAddingToCart = $appStore.cart.isAddingToCart
    $: addToCartText = $appStore.cart.addToCartText
    $: shippingRate = $appStore.cart.shippingRate
    $: shippingMethod = $appStore.cart.shippingMethod
    $: cartItems = $appStore.cart.cartItems
    $: totalItems = $appStore.cart.totalItems 
    $: subTotalAmount = $appStore.cart.subTotalAmount 
    $: taxAmount = $appStore.cart.taxAmount
    $: totalAmount = $appStore.cart.totalAmount

    const initiateCart = (thisStore = appStore) => {
        isAddingToCart = thisStore.cart.isAddingToCart
        addToCartText = thisStore.cart.addToCartText
        shippingRate = thisStore.cart.shippingRate
        shippingMethod = thisStore.cart.shippingMethod
        cartItems = thisStore.cart.cartItems
        totalItems = thisStore.cart.totalItems 
        subTotalAmount = thisStore.cart.subTotalAmount 
        taxAmount = thisStore.cart.taxAmount
        totalAmount = thisStore.cart.totalAmount
    }
    
    subscribe((state) => {
        initiateCart(state)
    });

    $:  cartItems = $appStore.cart.cartItems

    onMount(async () => {
        initiateCart(appStore)
        console.log(cart)
    })
  
    function goBack() {
      window.history.back();
    }

    let selectElement;

    function updateQuantity(thisElement, item, el){
        const quantity = thisElement.value
        console.log(quantity, isInCartItems(item.id, cartItems), el)
        // if(thisElement.hasAttribute('disabled')){return;}

        // Alpine.store('app').cart.disableElement(el);

        const findItemInCart = isInCartItems(item.id, cartItems);
        const itemsObject = Object.values(cartItems);

        if(findItemInCart){
            const index = itemsObject.indexOf(findItemInCart);
            setTimeout(() => {
                appStore.update((state) => {
                    const newCartItems = { ...state.cart.cartItems };
                    if(newCartItems[index]){
                        newCartItems[index].quantity = quantity;    
                        newCartItems[index].totalPrice = quantity * newCartItems[index].price;
                    }

                    const cartTotalItems = newCartItems ? Object.values(newCartItems).length : 0;
                    const cartSubTotalAmount = calculateSubTotalAmount(newCartItems);
                    const cartTaxAmount = calculateTaxAmount(newCartItems);
                    const cartTotalAmount = calculateCartTotal(newCartItems);

                    return {
                        ...state,
                        cart: { ...state.cart, 
                            cartItems: newCartItems, 
                            totalItems: cartTotalItems,
                            subTotalAmount: cartSubTotalAmount, 
                            taxAmount: cartTaxAmount, 
                            totalAmount: cartTotalAmount,
                        },
                    };
                });
            }, 2000);
          
          return;
        }
    }
  
    function removeItem(product) {
      product.removeItem = true;
      // Remove the product here
      setTimeout(() => {
        cartItems = cartItems.filter(item => item.id !== product.id);
        totalItems -= 1;
      }, 500);
    }

    $: {
      tick().then(async () => {
        initiateCart()
        cart
        console.log('cartTick', cart.totalAmount)
      });
    }
  </script>
  
  <!-- Container for the Shopping Cart Page Header -->
  <div class="bg-gray-100 mb-10">
    <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
      <h1 class="text-gray-800 text-xl font-bold my-2">Shopping Cart ({totalItems})</h1>
      <div class="mb-2 text-xs text-right flex items-end ml-auto">
        <a href="/" class="cursor-pointer hover:text-cyan-900 hover:underline">
          <span class="flex h-full items-center text-xs text-right">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
            </svg>
            <span class="mb-[0.1rem]">Continue shopping</span>
          </span>
        </a>
      </div>
    </div>
  </div>
  
  <!-- Container for the Shopping Cart Items and Order Summary -->
   {#if totalItems > 0}
  <div class="container mx-auto mb-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-x-10 sm:gap-y-6 relative">
      <!-- Items List -->
      <div class="col-span-2 relative bg-white p-8 rounded-lg shadow-md">
        {#each Object.values(cartItems) as product (product.id)}
        <!-- {#key p} -->
          <div class="border-b pb-4 mb-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center w-full relative gap-4 sm:gap-10">
                <img src={product.image} alt={product.title} class="w-20 h-20 object-cover mt-[0.35rem] self-start">
                <div class="flex flex-col">
                  <div class="grid w-full grid-cols-1 relative">
                    <h2 class="text-lg font-semibold">{product.title}</h2>
                    <p class="text-gray-700 text-ellipsis overflow-hidden break-words max-w-full max-h-12 line-clamp-2">{product.description}</p>
                    <div class="flex flex-col sm:flex-row items-center sm:justify-between mt-3">
                      <div class="w-full h-full flex items-center">
                        <p class="text-lg font-semibold">$ {product.totalPrice}</p>
                        {#if product.id !== 1 && product.id !== 5}
                          <p class="text-green-500 flex items-center ml-5 text-xs">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            In stock
                          </p>
                        {/if}
                        {#if product.id === 1 || product.id === 5}
                          <p class="text-yellow-500 flex items-center ml-5 text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-4 h-4 mr-1" fill="currentColor" stroke="currentColor">
                              <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                            </svg>
                            Ships in 3-4 weeks
                          </p>
                        {/if}
                      </div>
                      <div class="w-full flex mx-auto items-center justify-between pt-4 sm:pt-0">
                        <div class="flex min-h-full items-center">
                          {#if product.quantityUpdating}
                            <div>Updating...</div>
                          {/if}
                          {#if !product.quantityUpdating}
                            <div>
                                <select class="border rounded-lg p-2"
                                    on:change={(event) => updateQuantity(event.target, product)}
                                    bind:value={product.quantity}
                                >
                                    {#each Array(10).fill(0).map((_, i) => i + 0) as i}
                                        <option value="{i + 1}">{i + 1}</option>
                                    {/each}
                                </select>
                            </div>
                          {/if}
                        </div>
                        <div class="inline-flex items-end place-content-center text-xs">
                          {#if product.removeItem}
                            <div>Removing item...</div>
                          {/if}
                          {#if !product.removeItem}
                            <button class="text-red-500 hover:text-red-700" on:click={() => removeItem(product)}>
                                
                            </button>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- {/key} -->
        {/each}
  
        {#if cartItems.length === 0}
          <div class="container min-h-full text-center mx-auto pt-20">
            <div class="w-full min-h-full text-center">
              <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">No item found</h1>
              <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find any item in your </p>
              <div class="mt-10 flex items-center justify-center gap-4">
                <a href="/" class="cursor-pointer rounded-md hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
                  <span class="mb-[0.12rem] font-semibold">Continue shopping</span>
                </a>
              </div>
            </div>
          </div>
        {/if}
      </div>
  
      <!-- Order Summary -->
      <div class=" bg-white p-8 rounded-lg shadow-md relative sm:sitcky">
        <h2 class="text-lg font-semibold mb-4">Order summary</h2>
        <div class="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>$ {subTotalAmount}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span>Shipping estimate</span>
          <span>$ 0.00</span>
        </div>
        <div class="flex justify-between font-semibold text-lg mb-8">
          <span>Order total</span>
          <span>$ {totalAmount}</span>
        </div>
        <a href="/checkout" class="flex justify-center bg-cyan-700 hover:bg-cyan-900 w-full font-bold text-white py-2 px-4 rounded">
          <span>Checkout</span>
        </a>
      </div>
    </div>
  </div>
  {:else}
  <div class="container min-h-full text-center mx-auto pt-20">
    <div class="w-full min-h-full text-center">
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">No item found</h1>
        <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find any item in your cart.</p>
        <div class="mt-10 flex items-center justify-center gap-4">
            
            <a href="/" class="cursor-pointer rounded-md hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
                <span class="mb-[0.12rem] font-semibold">
                    Continue shopping
                </span>
            </a>
        </div>
    </div>
</div>
  {/if}