import { writable, derived, get } from 'svelte/store';
import { location, params, querystring } from 'svelte-spa-router'
import { fetchProducts, fetchSingleProduct, initializeCategories } from '../api/api';
import { calculateSubTotalAmount, calculateCartTotal, calculateTaxAmount, renderPage, fetchPage, getUrlMainPage, parseObjectToArray } from '../utils/utils'

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
    fetchFavourites: async () => {
      const response = await fetch('/api/favourites');
      const favourites = await response.json();
      update((state) => ({ ...state, wishList: favourites }));
    },
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
    isInCartItems(id, object) {
      const parsedObject = parseObjectToArray(object);
      return Object.values(parsedObject).find(item => item.id === id) || false;
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
    isInWishList: (id) => {
      let stateWishList = get(appStore).wishList;

      return stateWishList.hasOwnProperty(id);
    },
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
    getLocation: () => {
      // let locationPath;
      // let windowLocationPath;
      
      // let urlpath;
      // $: urlpath = get(appStore).currentLocation 
      
      // subscribe((state) => {
      //   windowLocationPath = window.location.href.replace(window.location.origin, '');
      //   locationPath = get(location);

      //   state.currentLocationPath = windowLocationPath

      //   console.log('p', locationPath, windowLocationPath)
      //   return { ...state, currentLocationPath: locationPath }
      // });

      // update((state) => ({ ...state, currentLocationPath: get(location) }))
      // subscribe((state) => {
      //   urlpath = state.currentLocation ;
      // });

      // if(locationPath !== urlpath){
      //   urlpath = locationPath
      //   console.log('p1',urlpath)
      //   update((state) => ({ ...state, currentLocation: locationPath }))
      // }
      
      // console.log('p2',urlpath, locationPath)
    },

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

export const appStore = createAppStore();

// appStore.subscribe((state) => {
//   console.log('Store updated:', state);
// });

// export const appState = get(appStore);

export const initializeProducts = async (type = 'products', app = appStore) => {
  if(type.toLowerCase() === 'products'){
    await initializeCategories(app)
    await fetchProducts(app)
    // console.log("hello")
  }
}

let mainPage;

export const start = (app = appStore) => {
  // app.getLocation(app)
  app.subscribe((app) => {
    mainPage = getUrlMainPage();
    app.pageName = mainPage;
  });

  renderPage(app.pageName);
}

// export const startProductPage = (type = 'products', app = appStore) => {
//   start(app);
//   initializeProducts(type, app);
// }

document.addEventListener('DOMContentLoaded', () => {
  appStore.update((state) => ({...state, loading: {...state.loading, page: false } }));
});
