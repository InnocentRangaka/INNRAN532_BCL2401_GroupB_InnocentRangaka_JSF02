import { wrap } from 'svelte-spa-router/wrap';

import Home from '../pages/Home.svelte';
import NotFound from '../pages/NotFound.svelte';

/**
 * Defines the routes for the Svelte SPA.
 * @type {Object}
 * @property {Object} routes - An object representing the routes and their components.
 * @property {SvelteComponent} routes./ - The Home component for the root path.
 * @property {Object} routes./product/:id - The ProductDetailView component for product detail pages.
 * @property {Object} routes./products/category/:category - The Products component for category pages.
 * @property {Object} routes./cart - The Cart component for the cart page.
 * @property {Object} routes./wishlist - The Wishlist component for the wishlist page.
 * @property {Object} routes./auth/login - The Login component for the login page.
 * @property {SvelteComponent} routes.* - The NotFound component for unmatched routes.
 */
export default {
    '/': Home,
    '/product/:id': wrap({
        /**
         * Asynchronously loads the ProductDetailView component.
         * @returns {Promise<SvelteComponent>} The imported component.
         */
        asyncComponent: () => import('../pages/ProductDetailView.svelte'),
        // props: (params) => ({ id: params.id }),
    }),
    '/products/category/:category': wrap({
        /**
         * Asynchronously loads the Products component.
         * @returns {Promise<SvelteComponent>} The imported component.
         */
        asyncComponent: () => import('../pages/Products.svelte'),
        // props: (params) => ({ category: params.category }),
    }),
    '/cart': wrap({
        /**
         * Asynchronously loads the Cart component.
         * @returns {Promise<SvelteComponent>} The imported component.
         */
        asyncComponent: () => import('../pages/Cart.svelte'),
    }),
    '/wishlist': wrap({
        /**
         * Asynchronously loads the Wishlist component.
         * @returns {Promise<SvelteComponent>} The imported component.
         */
        asyncComponent: () => import('../pages/Wishlist.svelte'),
    }),
    '/auth/login': wrap({
        /**
         * Asynchronously loads the Login component.
         * @returns {Promise<SvelteComponent>} The imported component.
         */
        asyncComponent: () => import('../pages/auth/Login.svelte'),
    }),
    '*': NotFound,
};
