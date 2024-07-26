<script> // Adjust the path as necessary
    import { get } from 'svelte/store';
    import { appStore } from '../store/store';
  
    const { subscribe, update, fetchProducts, setSorting } = appStore;
  
    let searchTerm = get(appStore).searchTerm
    let filterItem;

    subscribe((state) => {
        filterItem = state.filterItem;
    });

    let dropdownOpen;
    subscribe((state) => {
        dropdownOpen = state.dropdownOpen;
    });

    // $: dropdownOpen = get(appStore).dropdownOpen;
    let sorting;
    subscribe((state) => {
        sorting = state.sorting;
    });

    let categories;
    subscribe((state) => {
        categories = state.categories;
    });
  
    const toggleFilterDropdown = () => {
      update((state) => ({ ...state, dropdownOpen: !dropdownOpen }));
    };
  
    const setFilterItem = (item) => {
      update((state) => ({ ...state, dropdownOpen: false }))
      update((state) => ({ ...state, filterItem: item }));

      fetchProducts(appStore);

      console.log(filterItem)
    };
  
    const setSearchTerm = (term) => {
      update((state) => ({ ...state, searchTerm: term }));
    };
  
    const sortProducts = (sort) => {
      update((state) => ({ ...state, sorting: sort }));
      let stateProducts,
      sortedProducts;

      if (sorting !== 'default') {
        stateProducts = get(appStore).products
        sortedProducts = stateProducts.sort((a, b) => sorting === 'low' ? a.price - b.price : b.price - a.price);
      } else {
        stateProducts = get(appStore).originalProducts
        sortedProducts = JSON.parse(JSON.stringify(stateProducts));
      }

      update((state) => ({ ...state, products: sortedProducts }));
    };
    
    const filterSvg = (filterItem) => {
      // Implement the filterSvg function logic here
    };
  
    const capitalizeFirstLetters = (str) => {
      return str ? str.replace(/(?:^|\s)\S/g, match => match.toUpperCase()) : null;;
    };
    
  </script>

  <div class="w-full grid lg:flex gap-y-4 gap-x-48 lg:items-start mt-3 mx-auto px-2 md:px-0 justify-center">
    <!-- Filter -->
    <form on:submit|preventDefault={() => setSearchTerm(searchTerm)}>
      <div class="flex lg:w-[31.25rem] sm:w-[95%] md:w-full relative">
        <button
          on:click={toggleFilterDropdown}
          id="dropdown-button"
          class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center justify-center place-content-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200"
          type="button"
          title="filter button"
        >
            {capitalizeFirstLetters(filterItem)}
            <svg
            class={
                "w-2.5 h-2.5 ms-2.5 "
                + (dropdownOpen ? 'rotate-180' : 'rotate-0')
              }
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
            >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
            />
            </svg>
        </button>
        {#if dropdownOpen}
        <div id="dropdown" class="z-10 block absolute top-[100%] bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
          <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
            <li>
              <button
                on:click={() => setFilterItem('All categories')}
                type="button"
                class="inline-flex w-full px-4 py-2 hover:bg-gray-100"
              >
                All categories
              </button>
            </li>
            {#each categories as category}
            <li>
              <button
                on:click={() => setFilterItem(category)}
                type="button"
                class="inline-flex w-full px-4 py-2 hover:bg-gray-100"
              >
                {capitalizeFirstLetters(category)}
              </button>
            </li>
            {/each}
          </ul>
        </div>
        {/if}
        <div class="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            name="searchInput"
            class="p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search products..."
            bind:value={searchTerm}
            on:input={() => setSearchTerm(searchTerm)}
          />
          <button
            type="submit"
            class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  
    <!-- Sort -->
    <div class="flex sm:w-[95%] max-w-[21rem] md:w-full">
      <label for="sort" class="w-20 my-auto font-semibold">Sort by:</label>
      <select
        on:change={(e) => sortProducts(e.target.value)}
        bind:value={sorting}
        id="sort"
        class="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="default">Default</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>
    </div>
  </div>
  