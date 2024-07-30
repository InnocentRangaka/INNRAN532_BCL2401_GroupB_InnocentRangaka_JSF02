<script>
    import Router, { location, params, querystring } from 'svelte-spa-router';
    import { appStore } from '../store/store';
    import routes from './Routes'

    const { subscribe, update, updateUrlLocation } = appStore;

    // let params = {}
    let errorDiv = `<div>An error occurred</div>`;

    function routeLoading(event) {         /////////////////////////')

      function updateUrl(newPath) {
        const stateObject = { path: newPath }; // You can add any data you want here
        const newUrl = `${window.location.origin}${newPath}`;
        // window.history.pushState(stateObject, '', newUrl);
        window.history.replaceState(stateObject, '', newUrl);
      }
      
      // updateUrl(event.detail.location)
    }

    function routeLoaded(event) {
      updateUrlLocation({
        path: event.detail.location,
        params: event.detail.params,
        query: event.detail.querystring,
        route: event.detail.route,
        userData: event.detail.userData,
        componentName: event.detail.name.replace('Proxy<', '').replace('>', ''),
      })
    }
</script>

<Router 
  {routes} 
  params={params}
  on:routeLoading={routeLoading}
  on:routeLoaded={routeLoaded}
/>

<!-- Is not working -->
<!-- <Router>
  {#each Routes as route}
    <route path={route.path} let:params>
      <svelte:component this={route.component} params={params} />
    </route>
  {/each}
</Router> -->