import { get } from 'svelte/store';
// import { appStore } from '../store/store';

const API_URL = 'https://fakestoreapi.com/';

export const fetchProducts = async (app) => {
    let foundProducts = []

    const appState = get(app);
    if (appState.filterItem !== 'All categories') {
        app.update((state) => ({ ...state, loading: { ...state.loading, products: true } }));
        const response = await fetch(`${API_URL}products/category/${appState.filterItem}`);
        foundProducts = await response.json();
    }
    else{
        app.update((state) => ({ ...state, loading: { ...state.loading, products: true } }));
        const response = await fetch(`${API_URL}products`);
        foundProducts = await response.json();
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
    const product = await response.json();
    app.update((state) => ({ ...state, selectedProduct: product }));
}

export const initializeCategories = async (app) => {
    const response = await fetch(`${API_URL}products/categories`);
    const categories = await response.json();
    app.update((state) => ({ ...state, categories }));
};
