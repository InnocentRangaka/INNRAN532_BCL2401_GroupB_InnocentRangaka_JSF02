<script>
  import { onMount, afterUpdate } from "svelte";
  import { appStore } from "./store/store";
  // import { navigate } from './router.js';
  // import { pageLoading, loading, pageName } from '../store/store.js';

  let app;
  $: app = $appStore;
  let { loading } = $appStore;

  let fetchedHTML;

  async function renderPage(name) {
    const componentElement = document.querySelector(
      '[x-component="pageContent"]'
    );

    let pageName = name === "category" ? "category" : name;

    if (componentElement) {
      fetchedHTML = await fetchPage(pageName);

      if (!fetchedHTML) {
        const checkCategoryPage = (await $pageName) === name;
        pageName = checkCategoryPage ? "category" : name;

        fetchedHTML = await fetchPage(pageName);

        if (!fetchedHTML) {
          fetchedHTML = await fetchPage("notfound");
        }
      }

      componentElement.innerHTML = fetchedHTML.innerHTML;
    }
  }

  async function fetchPage(name) {
    const path = `${window.location.origin}/src/pages/${name.toLowerCase()}.html`;

    const template = await fetch(path)
      .then((response) => response.text())
      .then((text) =>
        new DOMParser()
          .parseFromString(text, "text/html")
          .querySelector(`[x-component="${name}"]`)
      );

    return template;
  }

  onMount(() => {
    //   renderPage($pageName);

    setTimeout(() => {
      // $pageLoading = false;
      // $loading = false;
    }, 2000);
  });
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
      <slot></slot>
    </div>

    <div class="min-h-screen flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>
  </main>
</div>
