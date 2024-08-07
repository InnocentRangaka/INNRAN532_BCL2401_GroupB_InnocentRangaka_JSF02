<!-- Toast.svelte -->
<script>
  import { onDestroy, tick, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { appStore } from '../store/store';

  const { subscribe, update, showToast, closeToast } = appStore;

  /** @type {Object} The app state. */
  let app;
  $: app = $appStore;

  let toast;
  $: toast = $appStore.toast;
  subscribe((state) => {
    toast = state.toast;
  });

  let visible, percent, message, interval;
    $:visible =  $appStore.toast.visible;
    $:percent =  $appStore.toast.percent;
    $:message =  $appStore.toast.message;
    $:interval =  $appStore.toast.interval;
    
  subscribe((state) => {
    visible = state.toast.visible;
    percent = state.toast.percent;
    message = state.toast.message;
    interval = state.toast.interval;
  });

  onMount(() => {
    update((state) => {
      state.toast.timeout = setTimeout(() => {
        state.toast.visible = false;
        state.toast.timeout = null;
      }, 5000);
    });
  })


  onDestroy(() => {
    closeToast();
  });

</script>

<!-- Notification / Toast -->
{#if visible}
  <div transition:fade in={visible} out={!visible} >
    <div class="fixed w-[300px] overflow-hidden bottom-0 right-0 m-4 dark:bg-green-950/80 border-green-700 border-1 text-white rounded-lg shadow-md">
        <div class="flex items-center justify-between px-4 py-3">
          <span>{toast.message}</span>
          <button on:click={closeToast} class="text-xs font-bold">X</button>
        </div>
        <div class="w-full bg-green-700 rounded-full h-1 mb-[0.4px]">
          <div class="w-0 bg-green-500 h-1 rounded-full" style="width: {percent}%" > </div>
        </div>
      </div>
  </div>
{/if}
