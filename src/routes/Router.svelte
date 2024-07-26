<script>
    import Router from 'svelte-spa-router';
    import routes from './Routes'

    // let params = {}
    let errorDiv = `<div>An error occurred</div>`;
</script>

<Router {routes} />

<!-- Is not working -->
<!-- <Router>
  {#each Routes as route}
    <route path={route.path} let:params>
      <svelte:component this={route.component} params={params} />
    </route>
  {/each}
</Router> -->