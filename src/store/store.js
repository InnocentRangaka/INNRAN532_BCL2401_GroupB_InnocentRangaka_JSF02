import { writable, derived } from 'svelte/store';
import { fetchProducts, fetchSingleProduct, initializeCategories } from '../api/api';
import { calculateSubTotalAmount, calculateCartTotal, calculateTaxAmount, renderPage, fetchPage, getUrlMainPage } from '../utils/utils'

function createAppStore() {
  const { subscribe, set, update } = writable({
    // Grouped currency and formatting
    currency: '$',
    formatPrice: (price) => price.toFixed(2),

    // Products and loading state
    products: [],
    originalProducts: [],
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
    },

    // Wishlist management
    wishList: {},

    // Page navigation
    pageName: null,
    pages: {
      productPages: ['home', 'wishlist'],
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
    fetchFavourites: async () => {
      const response = await fetch('/api/favourites');
      const favourites = await response.json();
      update((state) => ({ ...state, wishList: favourites }));
    },
    addToCart: (product) => {
      update((state) => {
        const newCartItems = { ...state.cart.cartItems };
        if (newCartItems[product.id]) {
          newCartItems[product.id].quantity += 1;
          newCartItems[product.id].totalPrice = newCartItems[product.id].quantity * product.price;
        } else {
          newCartItems[product.id] = { ...product, quantity: 1, totalPrice: product.price };
        }
        const cartTotalItems = calculateCartTotal(newCartItems);
        const cartTaxAmount = calculateTaxAmount(cartTotalItems);
        return {
          ...state,
          cart: { ...state.cart, cartItems: newCartItems, cartTotalItems, cartTaxAmount },
        };
      });
    },
    removeFromCart: (id) => {
      update((state) => {
        const newCartItems = { ...state.cart.cartItems };
        if (newCartItems[id]) {
          delete newCartItems[id];
        }
        const cartTotalItems = calculateCartTotal(newCartItems);
        const cartTaxAmount = calculateTaxAmount(cartTotalItems);
        return {
          ...state,
          cart: { ...state.cart, cartItems: newCartItems, cartTotalItems, cartTaxAmount },
        };
      });
    },
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
    setSearchTerm: (searchTerm) => {
      update((state) => ({ ...state, searchTerm }));
    },
    setSorting: (sorting) => {
      update((state) => ({ ...state, sorting }));
    },
    setFilterItem: (filterItem) => {
      update((state) => ({ ...state, filterItem }));
    },
  };
}

export const appStore = createAppStore();

export const initializeProducts = async (type = 'products', app = appStore) => {
  if(type.toLowerCase() === 'products'){
    initializeCategories(app)
    await fetchProducts(app)
  }
}

export const start = (app = appStore) => {
  app.subscribe((app) => {
    const mainPage = getUrlMainPage();
    app.pageName = mainPage
    renderPage(app.pageName);
  });
}

// export const startProductPage = (type = 'products', app = appStore) => {
//   start(app);
//   initializeProducts(type, app);
// }

document.addEventListener('DOMContentLoaded', () => {
  appStore.update((state) => ({...state, loading: {...state.loading, page: false } }));
});
