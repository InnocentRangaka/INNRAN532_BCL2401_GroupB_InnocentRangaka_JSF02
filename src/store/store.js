import { writable, derived } from 'svelte/store';
import { fetchProducts, fetchSingleProduct } from '../api/api';

const TAX_RATE = Number(0.15); // Number
const SHIPPING_COST_STANDARD = Number(5.00); // Number
const SHIPPING_COST_EXPRESS = Number(16.00); // Number

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
    initializeCategories: async () => {
      const response = await fetch(`${API_URL}/categories`);
      const categories = await response.json();
      update((state) => ({ ...state, categories }));
    },
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

// Helper functions
function calculateCartTotalItems(cartItems) {
  return Object.values(cartItems).length;
}

export const calculateSubTotalAmount = (items) => {
  const total = items.reduce((amount, item) => amount + (item.price * item.quantity), 0);
  return parseFloat(total).toFixed(2);
};

export const calculateCartTotal = (items) => {
  const subTotal = parseFloat(calculateSubTotalAmount(items));
  const tax = subTotal * TAX_RATE;
  const shipping = SHIPPING_COST_STANDARD;
  return (subTotal + tax + shipping).toFixed(2);
};

function calculateAmount(item) {
  return (item.price * item.quantity).toFixed(2);
}

function calculateTotalCartAmount(cart) {
  const subTotal = parseFloat(calculateSubTotalAmount(cart.cartItems));
  const shipping = parseFloat(cart.shippingRate);
  const tax = parseFloat(calculateTaxAmount(cart));
  return (subTotal + shipping + tax).toFixed(2);
}

export function calculateTaxAmount(cart) {
  return (parseFloat(calculateSubTotalAmount(cart.cartItems)) * TAX_RATE).toFixed(2);
}

// Create a copy before modifying the cart to avoid side effects
function getNewCartItems(cartItems, productId, quantity) {
  const newCartItems = { ...cartItems }; // Spread operator for a copy

  if (newCartItems[productId]) {
    newCartItems[productId].quantity += quantity;
  } else {
    newCartItems[productId] = { quantity };
  }

  return newCartItems;
}

export const appStore = createAppStore();

document.addEventListener('DOMContentLoaded', () => {
  appStore.update((state) => ({...state, loading: {...state.loading, page: false } }));
});
