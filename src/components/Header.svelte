<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import { link } from 'svelte-spa-router';
  import { appStore } from "../store/store";

  const { subscribe, update, initializeCategories } = appStore;

  /** @type {Object} The app state. */
  let app;
  $: app = $appStore;

  let pageName;
  $: pageName = get(appStore).pageName
    
  /** 
   * Initialize categories on app store. 
   * @param {Object} store - The app store.
   */
  initializeCategories(appStore)
  
  /** @type {boolean} State of mobile menu (open or closed). */
  let mobileMenuOpen = false;

  /** @type {Array} List of categories. */
  let categories = [];
  $: categories = app.categories;
  subscribe((state) => {
    categories = state.categories;
  });

  /** @type {number} Number of items in the wish list. */
  let wishListItems = 0;
  $: wishListItems = Object.values(app.wishList).length;
  subscribe((state) => {
    wishListItems = Object.values(state.wishList).length;
  });

  /** @type {number} Total number of items in the cart. */
  let cartTotalItems = 0;
  $: cartTotalItems = app.cart.totalItems;
  subscribe((state) => {
    cartTotalItems = state.cart.totalItems;
  });
  
  /**
   * Lifecycle method to run on component mount.
   */
  onMount(() => {
    // console.log(categories)
    // console.log($appStore.categories)
  });
  
  /**
   * Check if the page is an authentication page.
   * @param {string} name - The name of the page.
   * @returns {boolean} - True if the page is an authentication page, otherwise false.
   */
  const isAuthPages = (name) => {
    const authPages = ['login', 'register'];
    return authPages.includes(name);
  };
  
  /**
   * Get the menu name from the category name.
   * @param {string} category - The name of the category.
   * @returns {string} - The cleaned category name.
   */
  const menuName = (category) => {
    const cleanCategory = category ? category.toLowerCase() : category;
    return `${cleanCategory.replace("'s clothing", "")}`;
  };

  /**
   * Capitalize the first letter of the menu name.
   * @param {string} name - The name to be capitalized.
   * @returns {string} - The name with the first letter capitalized.
   */
  const capitalizeMenuName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

</script>


<header class="sticky z-50 top-0">
    <nav class="bg-white border-gray-200">
      <div class="container flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- SwiftCart Logo -->
        <a href="/#/">
          <button class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/src/assets/online-shop.png" class="h-8" alt="SwiftCart Logo" />
            <span class="self-center text-2xl font-semibold whitespace-nowrap text-gray-700 md:hover:text-blue-700">
              SwiftCart
            </span>
          </button>
        </a>
  
        <div class="hidden lg:flex items-center space-x-8">
          {#if categories.length > 0}
          <a href={'#/'} class="font-medium {pageName == 'home' || pageName == '#/' ? 'text-cyan-700': 'text-gray-700'} md:hover:text-blue-700">All</a>
          {/if}
          {#each categories as category}
            <a href={'#/products/category/' + menuName(category)} class="font-medium {pageName == menuName(category) ? 'text-cyan-700': 'text-gray-700'} md:hover:text-blue-700">{capitalizeMenuName(menuName(category))}</a>
          {/each}
        </div>
  
        <div>
          <!-- Hambuger Button -->
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
          
          <!-- Desktop Menu -->
          <div class="flex flex-wrap items-center justify-end">
            <div class="hidden md:block md:w-auto" id="navbar-dropdown">
              <ul class="flex flex-col top-10 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:space-x-6 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                <li>
                  <a href="#/wishlist" use:link class="group hover:bg-gray-100 md:hover:bg-transparent">
                    <div class="hidden lg:block md:block relative">
                      {#if wishListItems}
                        <div class="t-0 absolute left-3 -top-4">
                          <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">{wishListItems}</p>
                        </div>
                      {/if}
                      <svg
                        class="h-6 w-6 {pageName == 'wishlist' ? 'stroke-cyan-700': 'stroke-gray-700'} group-hover:bg-gray-100 md:group-hover:stroke-blue-700 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                        />
                      </svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#/cart" use:link class="group hover:bg-gray-100 md:hover:bg-transparent">
                    <div class="hidden lg:block md:block relative">
                      {#if cartTotalItems}
                        <div class="t-0 absolute left-3 -top-4">
                          <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">{cartTotalItems}</p>
                        </div>
                      {/if}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                        class="h-6 w-6 {pageName == 'cart' ? 'stroke-cyan-700': 'stroke-gray-700'} group-hover:bg-gray-100 md:group-hover:stroke-blue-700 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="/auth/login" use:link class="block py-2 px-3 {pageName == 'login' ? 'text-cyan-700': 'text-gray-700'} rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                    Login
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="w-full md:block md:w-auto">
        {#if mobileMenuOpen}
          <ul class="flex flex-col top-10 font-medium p-4 md:p-0 border border-gray-100 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {#each categories as category}
              <li>
                <a href={menuName(category)} class="block py-2 px-3 {pageName == menuName(category) ? 'text-cyan-700': 'text-gray-700'} rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                  {capitalizeMenuName(category)}
                </a>
              </li>
            {/each}
            <li>
              <a href="/wishlist" use:link class="block py-2 px-3 relative text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                Wishlist
                {#if wishListItems}
                  <div class="t-0 absolute left-[75px] top-2">
                    <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-gray-700">{wishListItems}</p>
                  </div>
                {/if}
              </a>
            </li>
            <li>
              <a href="/cart" use:link class="relative lg:hidden md:hidden py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                Cart
                {#if cartTotalItems}
                  <div class="t-0 absolute -right-5 top-2">
                    <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-gray-700">{cartTotalItems}</p>
                  </div>
                {/if}
              </a>
            </li>
            <li>
              <a href="/auth/login" use:link class="block py-2 px-3 {pageName == 'login' ? 'text-cyan-700': 'text-gray-700'} rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                Login
              </a>
            </li>
          </ul>
        {/if}
      </div>
    </nav>
</header>
  