<script>
    import Router, { location, params, querystring } from 'svelte-spa-router';
    import { appStore } from '../store/store';
    import routes from './Routes'

    const { subscribe, update, updateUrlLocation } = appStore;

    // let params = {}
    let errorDiv = `<div>An error occurred</div>`;

    function routeLoading(event) {
      // console.log('routeLoading event')
      // console.log('Route', event.detail.route)
      // console.log('Location', event.detail.location)
      // console.log('Querystring', event.detail.querystring)
      // console.log('Params', event.detail.params)
      // console.log('User data', event.detail.userData)
      // console.log('Name', event.detail.name)
      // console.log('End routeLoading event          /////////////////////////')

      function updateUrl(newPath) {
        const stateObject = { path: newPath }; // You can add any data you want here
        const newUrl = `${window.location.origin}${newPath}`;
        // window.history.pushState(stateObject, '', newUrl);
        window.history.replaceState(stateObject, '', newUrl);
      }
      
      // updateUrl(event.detail.location)
    }

    function routeLoaded(event) {
      // console.log('routeLoaded event')
      // // The first 5 properties are the same as for the routeLoading event
      // console.log('Route', event.detail.route)
      // console.log('Location', event.detail.location)
      // console.log('Querystring', event.detail.querystring)
      // console.log('Params', event.detail.params)
      // console.log('User data', event.detail.userData)
      // // The last two properties are unique to routeLoaded
      // console.log('Component', event.detail.component) // This is a Svelte component, so a function
      // console.log('Name', event.detail.name.replace('Proxy', ''))

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
  {params}
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