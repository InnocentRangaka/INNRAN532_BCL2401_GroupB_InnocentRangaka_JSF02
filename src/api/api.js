import { get } from 'svelte/store';
// import { appStore } from '../store/store';

const API_URL = 'https://fakestoreapi.com/';

/**
 * Fetches products based on the current filter and sorting states.
 * @async
 * @param {object} app - The Svelte store containing the application state.
 * @returns {Promise<void>}
 */
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

    app.update((state) => ({ ...state, loading: { ...state.loading, products: true } }));

    try {
        const response = stateFilterItem !== 'All categories'
            ? await fetch(`${API_URL}products/category/${stateFilterItem}`)
            : await fetch(`${API_URL}products`);

        if (!response.ok) {
            throw new Error('Data fetching failed :( , please check your network connection and reload.');
        }

        foundProducts = await response.json();

        if (stateSorting && stateSorting !== 'default') {
            foundProducts = foundProducts.sort((a, b) => 
                stateSorting === 'low' ? a.price - b.price : b.price - a.price
            );
        }

        app.update((state) => ({
            ...state,
            products: foundProducts,
            originalProducts: JSON.parse(JSON.stringify(foundProducts)),
            loading: { ...state.loading, products: false },
        }));
    } catch (error) {
        app.update((state) => ({ 
            ...state, 
            error: { 
                status: response.status,
                message: error.message,
                type: 'network/fetch', 
            },
            loading: { ...state.loading, products: false }
        }));
    }
};

/**
 * Fetches a single product by its ID.
 * @async
 * @param {number} id - The ID of the product to fetch.
 * @param {object} app - The Svelte store containing the application state.
 * @returns {Promise<void>}
 */
export const fetchSingleProduct = async (id, app) => {
    const response = await fetch(`${API_URL}products/${id}`);
    const productData = await response.json();
    app.update((state) => ({ 
        ...state, 
        viewProduct: productData,
    }));
};

/**
 * Initializes the categories by fetching them from the API.
 * @async
 * @param {object} app - The Svelte store containing the application state.
 * @returns {Promise<void>}
 */
export const initializeCategories = async (app) => {
    const response = await fetch(`${API_URL}products/categories`);
    const categories = await response.json();
    app.update((state) => ({ ...state, categories }));
};

/**
 * Fetches favorite products based on the given array of object IDs.
 * @async
 * @param {Array} objectArray - An array of object IDs to fetch.
 * @param {object} app - The Svelte store containing the application state.
 * @returns {Promise<void>}
 */
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

            list.push(fetchedData.response);
        }

        if (list.length > 0) {
            app.update((state) => ({ 
                ...state, 
                products: list, 
                originalProducts: JSON.parse(JSON.stringify(list))
            }));
        }
    } catch (error) {
        app.update((state) => ({
            ...state,
            error: {
                status: error.status,
                message: 'Data fetching failed :( , please check your network connection and reload.',
                type: 'network/fetch',
            },
            loading: { ...state.loading, products: false },
        }));
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
