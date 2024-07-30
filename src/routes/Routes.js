import { wrap } from 'svelte-spa-router/wrap';

import Home from '../pages/Home.svelte';
import NotFound from '../pages/NotFound.svelte';

// Define your routes
export default {
    '/': Home,
    '/product/:id': wrap({
        asyncComponent: () => import('../pages/ProductDetailView.svelte'),
        // props: (params) => ({ id: params.id }),
    }),
    '/products/category/:category': wrap({
        asyncComponent: () => import('../pages/Products.svelte'),
        // props: (params) => ({ category: params.category }),
    }),
    '/cart': wrap({
        asyncComponent: () => import('../pages/Cart.svelte'),
    }),
    '/wishlist': wrap({
        asyncComponent: () => import('../pages/Wishlist.svelte'),
    }),
    '/auth/login': wrap({
        asyncComponent: () => import('../pages/auth/Login.svelte'),
    }),
    '*': NotFound,
};
