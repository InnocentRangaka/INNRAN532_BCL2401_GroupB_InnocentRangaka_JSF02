<script>
  import { onMount, afterUpdate } from "svelte";
  import { appStore } from "../store/store";
  // import { navigate } from './router.js';
  // import { pageLoading, loading, pageName } from '../store/store.js';

  let app;
  $: app = $appStore;
  let { loading } = $appStore;

</script>

<div>
  <header></header>

  <main>
    <div class="min-h-screen flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>

    <div class="page-content">
        <h1>{app.pageName}</h1>
      <slot></slot>
    </div>

    <div class="min-h-screen flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>
  </main>
</div>
