<script>
  export let cartItem;
  export let updateQuantity;
  let selectEl;

  // Method to generate array of numbers
  function generateOptions(count) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
</script>

<div class="border-b pb-4 mb-4">
  <div class="flex justify-between items-center">
    <div class="flex items-center w-full relative gap-4 sm:gap-10">
      <img src={cartItem.image} alt={cartItem.title} class="w-20 h-20 object-cover mt-[0.35rem] self-start">
      <div class="flex flex-col">
        <div class="grid w-full grid-cols-1 relative">
          <h2 class="text-lg font-semibold">{cartItem.title}</h2>
          <p class="text-gray-700 text-ellipsis overflow-hidden break-words max-w-full max-h-12 line-clamp-2">{cartItem.description}</p>
          <div class="flex flex-col sm:flex-row items-center sm:justify-between mt-3">
            <div class="w-full h-full flex items-center">
              <p class="text-lg font-semibold">$ {cartItem.totalPrice}</p>
              {#if cartItem.id !== 1 && cartItem.id !== 5}
                <p class="text-green-500 flex items-center ml-5 text-xs">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  In stock
                </p>
              {/if}
              {#if cartItem.id === 1 || cartItem.id === 5}
                <p class="text-yellow-500 flex items-center ml-5 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-4 h-4 mr-1" fill="currentColor" stroke="currentColor">
                    <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                  </svg>
                  Ships in 3-4 weeks
                </p>
              {/if}
            </div>
            <div class="w-full flex mx-auto items-center justify-between pt-4 sm:pt-0">
              <div class="flex min-h-full items-center">
                <select class="border rounded-lg p-2"
                  bind:this={selectEl}
                  bind:value={cartItem.quantity}
                  on:change={(event) => updateQuantity(event.target, cartItem, selectEl)}
                >
                  {#each generateOptions(10) as option}
                    <option value={option}>{option}</option>
                  {/each}
                </select>
                {#if cartItem.quantityUpdating}
                  <div class="ml-2">Updating...</div>
                {/if}
              </div>
              <div class="inline-flex items-end place-content-center text-xs">
                {#if cartItem.removeItem}
                  <div>Removing item...</div>
                {/if}
                {#if !cartItem.removeItem}
                  <button class="text-red-500 hover:text-red-700">
                    Remove
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<!-- Usage -->
<!-- 
{#each Object.values(cartItems) as cartItem (cartItem.id)}
  {#key cartItem.id}
      <CartItem {cartItem} {updateQuantity} />
  {/key}
{/each} 
-->