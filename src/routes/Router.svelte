<script>
  import Router, { location, params, querystring } from 'svelte-spa-router';
  import { appStore } from '../store/store';
  import routes from './Routes';

  const { subscribe, update, updateUrlLocation } = appStore;

  let errorDiv = `<div>An error occurred</div>`;

  /**
   * Handles the route loading event.
   * @param {CustomEvent} event - The route loading event.
   */
  function routeLoading(event) {
      /**
       * Updates the URL to the new path.
       * @param {string} newPath - The new path to set in the URL.
       */
      function updateUrl(newPath) {
          const stateObject = { path: newPath }; // You can add any data you want here
          const newUrl = `${window.location.origin}${newPath}`;
          // window.history.pushState(stateObject, '', newUrl);
          window.history.replaceState(stateObject, '', newUrl);
      }

      // updateUrl(event.detail.location)
  }

  /**
   * Handles the route loaded event.
   * @param {CustomEvent} event - The route loaded event.
   */
  function routeLoaded(event) {
      updateUrlLocation({
          path: event.detail.location,
          params: event.detail.params,
          query: event.detail.querystring,
          route: event.detail.route,
          userData: event.detail.userData,
          componentName: event.detail.name.replace('Proxy<', '').replace('>', ''),
      });
  }
</script>

<!-- Svelte SPA Router component -->
<Router 
{routes} 
params={params}
on:routeLoading={routeLoading}
on:routeLoaded={routeLoaded}
/>

<!-- The following code is commented out as it is not working -->
<!-- <Router>
{#each Routes as route}
  <route path={route.path} let:params>
    <svelte:component this={route.component} params={params} />
  </route>
{/each}
</Router> -->
