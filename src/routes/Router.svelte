<script>
	import { wrap } from 'svelte-spa-router/wrap';
    import Router from 'svelte-spa-router';

    import Home from '../pages/Home.svelte';
    import NotFound from './pages/NotFound.svelte';

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
            asyncComponent: () => import('./routes/Product.svelte')
            }),
        },
        {
            name: 'cart',
            path: '/cart',
            component: wrap({
            asyncComponent: () => import('./routes/Cart.svelte')
            }),
        },
        {
            name: 'wishlist',
            path: '/wishlist',
            component: wrap({
            asyncComponent: () => import('./routes/Wishlist.svelte')
            }),
        },
        {
            name: 'notfound',
            path: '*',
            component: NotFound,
        },
    ];

    export let router = new Router({
    routes,
    });
</script>
  
<Router>
    {#each routes as route}
      <router path={route.path} let:params>
        <svelte:component this={route.component} params={params} />
      </router>
    {/each}
</Router>