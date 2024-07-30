<script>
    import { onMount, tick } from 'svelte';
    import { appStore } from "../store/store";
    import { calculateSubTotalAmount, calculateCartTotal, calculateTaxAmount, renderPage, fetchPage, getUrlMainPage } from '../utils/utils'
    import CartItem from '../elements/CartItem.svelte'

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
        addToCartText,
        shippingRate,
        shippingMethod,
        cartItems,
        totalItems, 
        subTotalAmount, 
        taxAmount,
        totalAmount
    } = cart;

    $: addToCartText = $appStore.cart.addToCartText
    $: shippingRate = $appStore.cart.shippingRate;
    $: shippingMethod = $appStore.cart.shippingMethod;
    $: cartItems = $appStore.cart.cartItems;
    $: totalItems = $appStore.cart.totalItems; 
    $: subTotalAmount = $appStore.cart.subTotalAmount; 
    $: taxAmount = $appStore.cart.taxAmount;
    $: totalAmount = $appStore.cart.totalAmount;

    const initiateCart = (thisStore = app) => {
        // cart = thisStore.cart
        // console.log(cart)
        // addToCartText = thisStore.cart.addToCartText
        // shippingRate = thisStore.cart.shippingRate;
        // shippingMethod = thisStore.cart.shippingMethod;
        // cartItems = thisStore.cart.cartItems;
        // totalItems = thisStore.cart.totalItems; 
        // subTotalAmount = thisStore.cart.subTotalAmount; 
        // taxAmount = thisStore.cart.taxAmount;
        // totalAmount = thisStore.cart.totalAmount;
        addToCartText = cart.addToCartText
        shippingRate = cart.shippingRate;
        shippingMethod = cart.shippingMethod;
        cartItems = cart.cartItems;
        totalItems = cart.totalItems; 
        subTotalAmount = cart.subTotalAmount; 
        taxAmount = cart.taxAmount;
        totalAmount = cart.totalAmount;
    }
    
    subscribe((state) => {
        initiateCart(state)
    });

    $:  cartItems = $appStore.cart.cartItems

    onMount(async () => {
        initiateCart(appStore)
        // console.log(cart)
    })
  
    function goBack() {
      window.history.back();
    }

    let selectEl;

    function updateQuantity(thisElement, item, selectedEl){
        const quantity = thisElement.value
        // console.log(quantity, isInCartItems(item.id, cartItems), thisElement)
        // if(thisElement.hasAttribute('disabled')){return;}
        // appStore.cart.disableElement(thisElement);

        const findItemInCart = isInCartItems(item.id, cartItems);
        const itemsObject = Object.values(cartItems);

        if(findItemInCart){
            const index = itemsObject.indexOf(findItemInCart);
            // console.log(Object.values(cartItems)[index], index)
            Object.values(app.cart.cartItems)[index].quantityUpdating = true;
            setTimeout(() => {
                appStore.update((state) => {
                    const newCartItems = Object.values(state.cart.cartItems);

                    // console.log('index', newCartItems)

                    if(newCartItems[index]){
                        newCartItems[index].quantity = quantity;    
                        newCartItems[index].totalPrice = (quantity * newCartItems[index].price).toFixed(2);
                    }

                    const cartTotalItems = newCartItems ? Object.values(newCartItems).length : 0;
                    const cartSubTotalAmount = calculateSubTotalAmount(newCartItems);
                    const cartTaxAmount = calculateTaxAmount(newCartItems);
                    const cartTotalAmount = calculateCartTotal(newCartItems);

                    // state.cart.disableElement(thisElement, false)
                    Object.values(state.cart.cartItems)[index].quantityUpdating = false;
                    Object.values(state.cart.cartItems)[index].quantity = quantity;
                    selectedEl.value = thisElement.value
                    console.log(thisElement.value, selectedEl.value) 
                    // thisElement.value = quantity; 

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

                // appStore.toast.show('Quantity updated!');
            }, 2000);
          
          return;
        }
    }

    function handleOptions(event){
        console.log(event)
    }
  
    // function removeItem(product) {
    //   product.removeItem = true;
    //   // Remove the product here
    //   setTimeout(() => {
    //     cartItems = cartItems.filter(item => item.id !== product.id);
    //     totalItems -= 1;
    //   }, 500);
    // }

    $: {
      tick().then(async () => {
        // initiateCart()
        cart;
        // console.log('cartTick', cart.totalAmount)
      });
    }
    
  </script>
  
  <!-- Container for the Shopping Cart Page Header -->
  <div class="bg-gray-100 mb-10">
    <div class="container grid grid-cols-1 sm:grid-cols-2 items-center mx-auto px-4 py-4 min-h-[44px]">
      <h1 class="text-gray-800 text-xl font-bold my-2">Shopping Cart ({totalItems})</h1>
      <div class="mb-2 text-xs text-right flex items-end ml-auto">
        <a href="/#/" class="cursor-pointer hover:text-cyan-900 hover:underline">
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
        {#each Object.values(cartItems) as cartItem (cartItem.id)}
            <div class="border-b pb-4 mb-4" >
                <div class="flex justify-between items-center">
                <div class="flex items-center w-full relative gap-4 sm:gap-10">
                    <img src={cartItem.image} alt={cartItem.title} class="w-20 h-20 object-cover mt-[0.35rem] self-start">
                    <div class="flex flex-col">
                    <div class="grid w-full grid-cols-1 relative">
                        <h2 class="text-lg font-semibold">{cartItem.title}</h2>
                        <p class="text-gray-700 text-ellipsis overflow-hidden break-words max-w-full max-h-12 line-clamp-2">{cartItem.description}</p>
                        <div class="flex flex-col sm:flex-row items-center sm:justify-between mt-3">
                        <div class="w-full h-full flex items-center">
                            <p class="text-lg font-semibold">$ {cartItem.totalPrice}</p>
                            {#if cartItem.id !== 1 && cartItem.id !== 5}
                            <p class="text-green-500 flex items-center ml-5 text-xs">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                In stock
                            </p>
                            {/if}
                            {#if cartItem.id === 1 || cartItem.id === 5}
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
                                <div class="border rounded-lg pl-2 pr-1 py-1 relative">
                                    <input
                                        class="w-[20px] absolute left-3 z-0 bg-white {cartItem.quantityUpdating ? 'hidden' : ''}"
                                        type="text"
                                        bind:value={cartItem.quantity}
                                        readonly
                                    />
                                    <select class=" w-[40px] z-1 "
                                        bind:this={selectEl}
                                        on:change={(event) => {updateQuantity(event.target, cartItem, selectEl); console.log(cartItems[Object.values(cartItems).indexOf(cartItem)].quantity)}}
                                        bind:value={cartItem.quantity}
                                        disabled={cartItem.quantityUpdating}
                                    >
                                        {#each Array(10).fill(0).map((_, i) => i + 0) as i}
                                            <option class="" value="{i + 1}" selected="{i + 1 === cartItem.quantity}">{i + 1}</option>
                                        {/each}
                                    </select>
                                </div>
                                {#if cartItem.quantityUpdating}
                                    <div class="ml-2">Updating...</div>
                                {/if}
                            </div>
                            <div class="inline-flex items-end place-content-center text-xs">
                            {#if cartItem.removeItem}
                                <div>Removing item...</div>
                            {/if}
                            {#if !cartItem.removeItem}
                                <button class="text-red-500 hover:text-red-700">
                                    Remove
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
        {/each}
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
                
                <a href="/#/" class="cursor-pointer rounded-md hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
                    <span class="mb-[0.12rem] font-semibold">
                        Continue shopping
                    </span>
                </a>
            </div>
        </div>
    </div>
{/if}

<style>
    .input-select {
    position: relative;
  }

 .input-select input[type="text"] {
    padding-right: 20px;
  }

 .input-select select {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    width: 20px;
    height: 100%;
    padding: 0;
    border: none;
  }

 .input-select select:focus {
    opacity: 1;
  }
  </style>