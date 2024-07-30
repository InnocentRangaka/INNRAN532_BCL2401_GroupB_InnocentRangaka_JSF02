<script>
    import { onMount } from 'svelte';
    import { appStore } from "../store/store";

    const { subscribe, update, initializeCategories } = appStore;

    let app, pageName;
    $: app = $appStore;
  
    let loading = false;

    let categories = [];
    $: categories = app.categories;
    subscribe((state) => {
      categories = state.categories;
    });

    $: pageName = $appStore.pageName;
    subscribe((state) => { pageName = state.pageName });
  
    onMount(() => {
    });
  
    function getThisYear() {
      return new Date().getFullYear();
    }
    
    const isAuthPages = (name) => {
      const authPages = ['login', 'register'];
      return authPages.includes(name);
    };
  
    const menuName = (category) => {
      const cleanCategory = category ? category.toLowerCase() : category
      return `${cleanCategory.replace("'s clothing", "")}`
    };

    const capitalizeMenuName = (name) => name.charAt(0).toUpperCase() + name.slice(1);

</script>

{#if !isAuthPages(pageName) && !loading}
<footer class="bg-white py-8 bottom-0 left-0 right-0 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:grid sm:grid-cols-2 lg:grid-cols-6 gap-4 justify-between">
            <div class="flex flex-col space-y-2">
                <h3 class="text-sm font-bold text-gray-900">Categories</h3>
                <a href="/#/" class="text-sm text-gray-700 md:hover:text-blue-700">All</a>
                {#each categories as category}
                    <a href={`/#/${menuName(category)}`} class="text-sm text-gray-700 md:hover:text-blue-700">{capitalizeMenuName(category)}</a>
                {/each}
            </div>
            <div class="flex flex-col space-y-2 mt-6 md:mt-0">
                <h3 class="text-sm font-bold text-gray-900">Support</h3>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Pricing</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Documentation</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Guides</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">API Status</a>
            </div>
            <div class="flex flex-col space-y-2 mt-6 md:mt-0">
                <h3 class="text-sm font-bold text-gray-900">Company</h3>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">About</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Blog</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Jobs</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Press</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Partners</a>
            </div>
            <div class="flex flex-col space-y-2 mt-6 md:mt-0">
                <h3 class="text-sm font-bold text-gray-900">Legal</h3>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Claim</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Privacy</a>
                <a href="#" class="text-sm text-gray-700 md:hover:text-blue-700">Terms</a>
            </div>
            <div class="flex flex-col space-y-2 mt-6 md:mt-0 md:col-span-2">
                <h3 class="text-sm font-bold text-gray-900">Subscribe to our newsletter</h3>
                <p class="text-sm text-gray-700">The latest news, articles, and resources, sent to your inbox weekly.</p>
            <div class="flex flex-col md:flex-row relative  sm:mb-4 ">
                <input type="email" placeholder="Enter your email" class="p-2 border border-gray-300 rounded-l-md sm:w-full">
                <button class="p-2.5 bg-cyan-700 text-white rounded-r-md hover:bg-cyan-900 sm:w-full">Subscribe</button>
            </div>
        </div>
    </div>

    <div class="mt-8 border-t pt-8 flex justify-between items-center">
        <p class="text-sm text-gray-700">&copy; {getThisYear()} SwiftCart, Inc. All rights reserved.</p>
        <div class="flex space-x-4">
            <div class="flex space-x-4">
                <a href="#" class="text-gray-400 hover:text-gray-700">
                    <span class="sr-only">Facebook</span>
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.404.595 24 1.325 24H12.82v-9.294H9.691v-3.622h3.129V8.411c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.462.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.762v2.313h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.324-.596 1.324-1.324V1.325C24 .595 23.404 0 22.675 0z"/></svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-gray-700">
                    <span class="sr-only">Instagram</span>
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.314 3.608 1.289.974.975 1.227 2.242 1.289 3.608.058 1.267.07 1.647.07 4.851s-.012 3.584-.07 4.85c-.062 1.366-.314 2.633-1.289 3.608-.975.975-2.242 1.227-3.608 1.289-1.267.058-1.647.07-4.85.07s-3.584-.012-4.851-.07c-1.366-.062-2.633-.314-3.608-1.289-.975-.975-1.227-2.242-1.289-3.608-.058-1.267-.07-1.647-.07-4.85s.012-3.584.07-4.851c.062-1.366.314-2.633 1.289-3.608.975-.975 2.242-1.227 3.608-1.289 1.267-.058 1.647-.07 4.851-.07zm0-2.163C8.756 0 8.332.012 7.052.07 5.773.127 4.52.371 3.41 1.48 2.301 2.59 2.057 3.843 2 5.123.942 6.403.931 6.824.931 12s.012 5.597.07 6.877c.057 1.279.301 2.532 1.41 3.641 1.109 1.109 2.362 1.353 3.641 1.41 1.279.057 1.7.07 6.876.07s5.597-.012 6.877-.07c1.279-.057 2.532-.301 3.641-1.41 1.109-1.109 1.353-2.362 1.41-3.641.057-1.279.07-1.7.07-6.877s-.012-5.597-.07-6.877c-.057-1.279-.301-2.532-1.41-3.641-1.109-1.109-2.362-1.353-3.641-1.41-1.279-.057-1.7-.07-6.877-.07zM12 5.838c-3.403 0-6.162 2.758-6.162 6.162s2.758 6.162 6.162 6.162 6.162-2.758 6.162-6.162-2.758-6.162-6.162-6.162zm0 10.126c-2.188 0-3.964-1.776-3.964-3.964s1.776-3.964 3.964-3.964 3.964 1.776 3.964 3.964-1.776 3.964-3.964 3.964zm6.406-11.845c-.796 0-1.441.645-1.441 1.441 0 .796.645 1.441 1.441 1.441.796 0 1.441-.645 1.441-1.441 0-.796-.645-1.441-1.441-1.441z"/></svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-gray-700">
                    <span class="sr-only">Twitter</span>
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.609 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.897-.959-2.178-1.555-3.594-1.555-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.087-.205-7.713-2.166-10.141-5.144-.422.722-.666 1.561-.666 2.457 0 1.697.869 3.197 2.188 4.077-.807-.026-1.566-.248-2.229-.616v.061c0 2.367 1.684 4.342 3.918 4.788-.41.111-.84.171-1.285.171-.315 0-.621-.03-.922-.086.623 1.943 2.433 3.355 4.576 3.394-1.68 1.318-3.809 2.104-6.115 2.104-.397 0-.79-.023-1.175-.068 2.179 1.397 4.768 2.213 7.557 2.213 9.054 0 14.002-7.496 14.002-13.986 0-.21 0-.423-.016-.634.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
                </a>
                <a href="#" class="text-gray-400 hover:text-gray-700">
                    <span class="sr-only">YouTube</span>
                    <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-1.116-.008-3.678-.008-3.678-.008s-2.562 0-3.678.008c-1.468.008-2.785.271-3.899 1.385-1.114 1.114-1.377 2.43-1.385 3.899-.008 1.116-.008 3.678-.008 3.678s0 2.562.008 3.678c.008 1.468.271 2.785 1.385 3.899 1.114 1.114 2.43 1.377 3.899 1.385 1.116.008 3.678.008 3.678.008s2.562 0 3.678-.008c1.468-.008 2.785-.271 3.899-1.385 1.114-1.114 1.377-2.43 1.385-3.899.008-1.116.008-3.678.008-3.678s0-2.562-.008-3.678c-.008-1.468-.271-2.785-1.385-3.899-1.114-1.114-2.431-1.377-3.899-1.385zm-7.615 11.731v-6.905l6.432 3.453-6.432 3.452z"/></svg>
                </a>
            </div>
        </div>
    </div>
</footer>
{/if}