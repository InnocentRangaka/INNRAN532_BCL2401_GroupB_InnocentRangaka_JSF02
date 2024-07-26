import { wrap } from 'svelte-spa-router/wrap';

import Home from '../pages/Home.svelte';
import NotFound from '../pages/NotFound.svelte';

// Define your routes
const routes = [
    {
      name: 'home',
      path: '/',
      component: Home,
    },
    {
        name: 'product',
        path: '/product/:id',
        component: wrap({
            asyncComponent: () => import('../pages/ProductDetailView.svelte'),
            props: (params) => ({ id: params.id }),
        }),
    },
    {
        name: 'cart',
        path: '/cart',
        component: wrap({
            asyncComponent: () => import('../pages/Cart.svelte'),
        }),
    },
    {
        name: 'wishlist',
        path: '/wishlist',
        component: wrap({
            asyncComponent: () => import('../pages/Wishlist.svelte'),
        }),
    },
    {
        name: 'not-found',
        path: '*',
        component: NotFound,
    },
];
  
export default routes;
