// import { appStore } from '../store/store';

const API_URL = 'https://fakestoreapi.com/';

export const fetchProducts = async (app) => {
    app.update((state) => ({ ...state, loading: { ...state.loading, products: true } }));
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    app.update((state) => ({
      ...state,
      products,
      originalProducts: products,
      loading: { ...state.loading, products: false },
    }));
}
export const fetchSingleProduct = async (id, app) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    const product = await response.json();
    app.update((state) => ({ ...state, selectedProduct: product }));
}
export const fetchFavourites = async (app) => {
    const response = await fetch('/api/favourites');
    const favourites = await response.json();
    app.update((state) => ({ ...state, wishList: favourites }));
};
