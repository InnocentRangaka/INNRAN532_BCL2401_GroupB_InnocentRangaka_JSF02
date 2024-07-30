import { get } from 'svelte/store';
// import { appStore } from '../store/store';

const API_URL = 'https://fakestoreapi.com/';

export const fetchProducts = async (app) => {
    let foundProducts = []

    let stateFilterItem;
    app.subscribe((state) => {
        stateFilterItem = state.filterItem;
    });

    let stateSorting;
    app.subscribe((state) => {
        stateSorting = state.sorting;
    });
    
    if (stateFilterItem !== 'All categories') {
        app.update((state) => ({ ...state, loading: { ...state.loading, products: true } }));
        const response = await fetch(`${API_URL}products/category/${stateFilterItem}`);
        foundProducts = await response.json();
    }
    else{
        app.update((state) => ({ ...state, loading: { ...state.loading, products: true } }));
        const response = await fetch(`${API_URL}products`);
        foundProducts = await response.json();
    }

    if(stateSorting && stateSorting !== 'default'){

      const { getLocation } = app;
      
      let urlQuery = getLocation().query
      if(urlQuery.includes('sort')){
        foundProducts = Object.values(foundProducts).sort((a, b) => stateSorting === 'low' ? a.price - b.price : b.price - a.price);
      }
      else {
        app.update((state) => ({ ...state, sorting: 'default' }));
      }
    }

    app.update((state) => ({
        ...state,
        products: foundProducts,
        originalProducts: JSON.parse(JSON.stringify(foundProducts)),
        loading: { ...state.loading, products: false },
    }));
}
export const fetchSingleProduct = async (id, app) => {
    const response = await fetch(`${API_URL}products/${id}`);
    const productData = await response.json();
    app.update((state) => ({ 
        ...state, 
        viewProduct: productData,
        // loading: { ...state.loading, products: false },
    }));
}

export const initializeCategories = async (app) => {
    const response = await fetch(`${API_URL}products/categories`);
    const categories = await response.json();
    app.update((state) => ({ ...state, categories }));
};

export const fetchFavourites = async (objectArray, app) => {

    try {
      const getIds = [...new Set(Object.values(objectArray))];
      const list = [];
      for (const id of getIds) {
        const response = await fetch(`${API_URL}products/${id}`);
        const fetchedData = await response.json();
  
        if (fetchedData.error) {
          throw fetchedData.error;
        }
  
        if (!fetchedData.response) {
          return;
        }

        console.log('fetchedData', fetchedData.response)
  
        list.push(fetchedData.response);
      }
  
      if (list.length > 0) {
        app.update((state) => ({ ...state, 
            products: list, 
            originalProducts: JSON.parse(JSON.stringify(list))
         }));
        // app.loading.products = false;
        console.log(list)
      }
    } catch (error) {
      app.error = {
        status: error.status,
        message: 'Data fetching failed :( , please check your network connection and reload.',
        type: 'network/fetch',
      };
    } finally {
        app.sortProducts();
        app.searchProducts();
        app.update((state) => ({
            ...state,
            loading: { ...state.loading, products: false },
        }));

        setTimeout(() => {
            app.update((state) => ({
                ...state,
                loading: { ...state.loading, page: false },
            }));
        }, 1000);
    }
};
