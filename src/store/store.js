import { writable, derived, get } from 'svelte/store';
import { location, params, querystring } from 'svelte-spa-router'
import { fetchProducts, fetchSingleProduct, initializeCategories } from '../api/api';
import { calculateSubTotalAmount, calculateCartTotal, calculateTaxAmount, renderPage, fetchPage, getUrlMainPage, parseObjectToArray } from '../utils/utils'

/**
 * Creates the main application store with state management and utility functions.
 * @returns {object} - The Svelte store containing the application state and utility functions.
 */
function createAppStore() {
  const { subscribe, set, update } = writable({
    currentLocation: {
      path: '',
      params: '',
      query: '',
      route: '',
      userData: '',
      componentName: '',
    },
    // Grouped currency and formatting
    currency: '$',
    formatPrice: (price) => price.toFixed(2),

    // Products and loading state
    viewProduct: [],
    products: [],
    originalProducts: [],
    selectedProduct: {},
    loading: {
      products: true, // Specific loading states
      cart: false,
      page: true,
    },
    error: false,

    // Sorting and filtering
    sorting: 'default',
    searchTerm: '',
    filterItem: 'All categories',
    categories: [],

    // UI state
    dropdownOpen: false,
    disabledClass: 'disabled:opacity-75',
    cursorPointerClass: 'cursor-pointer',
    cursorNotAllowed: 'cursor-not-allowed',

    // Cart management
    cart: {
      isAddingToCart: false,
      addToCartText: 'Add To Cart',
      shippingRate: 0,
      shippingMethod: 'standard',
      cartItems: {},
      totalItems: 0, 
      subTotalAmount: 0, 
      taxAmount: 0,
      totalAmount: 0,
    },

    // Wishlist management
    wishList: {},

    // Page navigation
    pageName: null,
    pages: {
      productPages: ['home', 'wishlist', 'products', 'product'],
      authPages: ['login', 'signup'],
      cartPages: ['cart', 'checkout'],
    },
  });

  return {
    subscribe,
    set,
    update,
    getUrlMainPage,
    renderPage: () => renderPage(),
    fetchPage,
    initializeCategories,
    fetchProducts,
    fetchSingleProduct,
    /**
     * Fetches favourite products from the server and updates the state.
     * @async
     * @returns {Promise<void>}
     */
    fetchFavourites: async () => {
      // const response = await fetch('/api/favourites');
      // const favourites = await response.json();
      // update((state) => ({ ...state, wishList: favourites }));
    },
    /**
     * Adds an item to the cart and updates the state.
     * @param {object} item - The item to add to the cart.
     * @param {HTMLElement|null} eventTarget - The event target (optional).
     */
    addToCart: (item, eventTarget = null) => {
      update((state) => {
        const newCartItems = { ...state.cart.cartItems };
        if (newCartItems[item.id]) {
          newCartItems[item.id].quantity += 1;
          newCartItems[item.id].totalPrice = newCartItems[item.id].quantity * item.price;
        } else {
          const hasQuantity = item.quantity ? item.quantity : 1;
          newCartItems[item.id] = { 
            ...item, 
            quantity: hasQuantity, 
            totalPrice: item.price,
            quantityUpdating: false,
            removeItem: false,
          };
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
    },
    /**
     * Removes an item from the cart and updates the state.
     * @param {number} id - The ID of the item to remove from the cart.
     */
    removeFromCart: (id) => {
      update((state) => {
        const newCartItems = { ...state.cart.cartItems };
        if (newCartItems[id]) {
          delete newCartItems[id];
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
    },
    /**
     * Checks if an item is in the cart.
     * @param {number} id - The ID of the item to check.
     * @param {object} object - The cart items object.
     * @returns {boolean|object} - The item if found, otherwise false.
     */
    isInCartItems(id, object) {
      const parsedObject = parseObjectToArray(object);
      return Object.values(parsedObject).find(item => item.id === id) || false;
    },
    /**
     * Adds or removes an item from the wishlist.
     * @param {number} id - The ID of the item to add/remove.
     */
    addToFavourites: (id) => {
      update((state) => {
        const newWishList = { ...state.wishList };
        if (newWishList[id]) {
          delete newWishList[id];
        } else {
          newWishList[id] = true;
        }
        return { ...state, wishList: newWishList };
      });
    },
    /**
     * Checks if an item is in the wishlist.
     * @param {number} id - The ID of the item to check.
     * @returns {boolean} - True if the item is in the wishlist, otherwise false.
     */
    isInWishList: (id) => {
      let stateWishList = get(appStore).wishList;

      return stateWishList.hasOwnProperty(id);
    },
    /**
     * Updates the current URL location in the state.
     * @param {object} location - The location object.
     * @param {string} location.path - The path of the location.
     * @param {string} location.params - The params of the location.
     * @param {string} location.query - The query of the location.
     * @param {string} location.route - The route of the location.
     * @param {string} location.userData - The user data of the location.
     * @param {string} location.componentName - The component name of the location.
     */
    updateUrlLocation: ({path = '', params = '', query = '', route = '', userData = '', componentName = ''}) => {
      update((state) => ({ 
        ...state,
        currentLocation: {
          path: path,
          params: params,
          query: query,
          route: route,
          userData: userData,
          componentName: componentName,
        },
      }));
    },

    /**
     * Gets the current URL location from the state.
     * @returns {object} - The current location object.
     */
    getLocation: () => {
      return get(appStore).currentLocation;
    },
    /**
     * Sorts the products based on the current sorting criteria in the state.
     */
    sortProducts: () => {
      update((state) => {
        let stateProducts,
        sorting = {...state.sorting},
        sortedProducts;

        if (sorting !== 'default') {
          stateProducts = {...state.products}
          sortedProducts = Object.values(stateProducts).sort((a, b) => sorting === 'low' ? a.price - b.price : b.price - a.price);
        } else {
          stateProducts = {...state.originalProducts}
          sortedProducts = JSON.parse(JSON.stringify(stateProducts));
        }
        return { ...state, products: sortedProducts }
      });
    },

    /**
     * Searches the products based on the current search term in the state.
     */
    searchProducts: () => {
      update((state) => { 
        let searchedProducts,
        searchTerm = {...state.searchTerm},
        stateProducts = {...state.originalProducts};

        // console.log('stateProducts', stateProducts)

        if(searchTerm.toString().trim() !== '') {
          const filteredProducts = Object.values(stateProducts).filter((product) => product.title.includes(searchTerm.toString().toLowerCase()));
          searchedProducts = JSON.parse(JSON.stringify(filteredProducts));
        } else {
          searchedProducts = JSON.parse(JSON.stringify(stateProducts));
        }
        return {...state, products: searchedProducts }
      });
    }
  };
}

/**
 * Create the main application store containing the state and utility functions for the app.
 * @returns {object} - The Svelte store containing the application state and utility functions.
 */
export const appStore = createAppStore();


/**
 * Initializes products by fetching categories and products from the server.
 * @async
 * @param {string} type - The type of products to initialize (default is 'products').
 * @param {object} app - The application store.
 * @returns {Promise<void>}
 */
export const initializeProducts = async (type = 'products', app = appStore) => {
  if(type.toLowerCase() === 'products'){
    await initializeCategories(app);
    await fetchProducts(app);
  }
}

let mainPage;

/**
 * Starts the application by subscribing to the store and rendering the main page.
 * @param {object} app - The application store.
 */
export const start = (app = appStore) => {
  // app.getLocation(app)
  app.subscribe((app) => {
    mainPage = getUrlMainPage();
    app.pageName = mainPage;
  });

  renderPage(app.pageName);
}

/**
 * Event listener for the DOMContentLoaded event to update the loading state of the application store.
 */
document.addEventListener('DOMContentLoaded', () => {
  appStore.update((state) => ({...state, loading: {...state.loading, page: false } }));
});