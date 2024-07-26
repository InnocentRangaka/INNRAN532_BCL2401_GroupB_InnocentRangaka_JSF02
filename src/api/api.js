// import { appStore } from '../store/store';

const API_URL = 'https://fakestoreapi.com/';

export const fetchProducts = async (app) => {
    let foundProducts = []

    let stateFilterItem;
    app.subscribe((state) => {
        stateFilterItem = state.filterItem;
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
