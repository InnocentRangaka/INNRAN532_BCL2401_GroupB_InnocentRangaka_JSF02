<script>
  import { onMount } from "svelte";

  // Function to navigate back to the previous page
  const goBack = () => {
    window.history.back();
  };
</script>

<div class="container min-h-full text-center mx-auto pt-20">
  <div class="w-full min-h-full text-center">
    <p class="text-base font-semibold text-cyan-700">404</p>
    <h1
      class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"
    >
      Page not found
    </h1>
    <p class="mt-6 text-base leading-7 text-gray-600">
      Sorry, we couldn't find the page you're looking for.
    </p>
    <div class="mt-10 flex items-center justify-center gap-4">
      <a
        href="#/"
        on:click={goBack}
        class="cursor-pointer rounded-md hover:text-cyan-900 hover:underline font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
      >
        <span class="flex h-full items-center text-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
          <span class="mb-[0.12rem] font-semibold">Go back</span>
        </span>
      </a>
      <span class="min-h-4 border-r border-gray-400 tracking-wider"></span>
      <a
        href="#/"
        class="cursor-pointer rounded-md hover:text-cyan-900 hover:underline py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
      >
        <span class="flex h-full items-center text-left">
          <span class="mb-[0.12rem] font-semibold">Continue shopping</span>
        </span>
      </a>
    </div>
  </div>
</div>

<style>
  .min-h-full {
    min-height: 100vh;
  }
</style>
