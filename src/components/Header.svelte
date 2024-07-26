<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
  
    let mobileMenuOpen = false;
    let categories = [];
    let wishListItems = 0;
    let cart = { totalItems: 0 };
  
    // Example data fetching
    onMount(() => {
      // Replace with actual data fetching logic
      categories = ['electronics', 'clothing', 'home', 'sports'];
      wishListItems = 3; // Example wishlist items count
      cart.totalItems = 5; // Example cart items count
    });
  
    const isAuthPages = (pageName) => {
      const authPages = ['login', 'register'];
      return authPages.includes(pageName);
    };
  
    const menuName = (category) => `/${category}`;
    const capitalizeMenuName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
</script>

<header class="sticky z-50 top-0">
    <nav class="bg-white border-gray-200">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- SwiftCart Logo -->
        <a href="/">
          <button class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/online-shop.png" class="h-8" alt="SwiftCart Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-gray-700 md:hover:text-blue-700">
              SwiftCart
            </span>
          </button>
        </a>
  
        <div class="hidden lg:flex items-center space-x-8">
          {#each categories as category}
            <a href={menuName(category)} class="font-medium text-gray-700 md:hover:text-blue-700">{capitalizeMenuName(category)}</a>
          {/each}
        </div>
  
        <button
          on:click={() => mobileMenuOpen = !mobileMenuOpen}
          class="inline-flex self-end items-center p-2 w-10 h-10 justify-center text-sm text-gray-700 md:hover:text-blue-700 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={mobileMenuOpen}
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
  
        <div class="flex flex-wrap items-center justify-end">
          <div class="hidden md:block md:w-auto" id="navbar-dropdown">
            <ul class="flex flex-col top-10 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a href="/wishlist" class="block py-2 px-3 relative text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                  Wishlist
                  {#if wishListItems}
                    <div class="t-0 absolute -right-4 -top-4">
                      <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">{wishListItems}</p>
                    </div>
                  {/if}
                </a>
              </li>
              <li>
                <a href="/cart" class="hover:bg-gray-100 md:hover:bg-transparent">
                  <div class="hidden lg:block md:block relative">
                    {#if cart.totalItems}
                      <div class="t-0 absolute left-3 -top-4">
                        <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">{cart.totalItems}</p>
                      </div>
                    {/if}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 stroke-gray-500 hover:bg-gray-100 md:hover:stroke-blue-700 cursor-pointer">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li>
                <a href="/auth/login" class="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
  
        <div class="w-full md:block md:w-auto">
          {#if mobileMenuOpen}
            <ul class="flex flex-col top-10 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              {#each categories as category}
                <li>
                  <a href={menuName(category)} class="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                    {capitalizeMenuName(category)}
                  </a>
                </li>
              {/each}
              <li>
                <a href="/wishlist" class="block py-2 px-3 relative text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                  Wishlist
                  {#if wishListItems}
                    <div class="t-0 absolute left-[75px] top-2">
                      <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-gray-700">{wishListItems}</p>
                    </div>
                  {/if}
                </a>
              </li>
              <li>
                <a href="/cart" class="relative lg:hidden md:hidden py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                  Cart
                  {#if cart.totalItems}
                    <div class="t-0 absolute -right-5 top-2">
                      <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-gray-700">{cart.totalItems}</p>
                    </div>
                  {/if}
                </a>
              </li>
              <li>
                <a href="/auth/login" class="block py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                  Login
                </a>
              </li>
            </ul>
          {/if}
        </div>
      </div>
    </nav>
</header>
  