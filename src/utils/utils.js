
const TAX_RATE = Number(15); // Number
const SHIPPING_COST_STANDARD = Number(5.00); // Number
const SHIPPING_COST_EXPRESS = Number(16.00); // Number

/**
 * Calculate the total number of items in the cart.
 * @param {Object} cartItems - The items in the cart.
 * @returns {number} The total number of items.
 */
function calculateCartTotalItems(cartItems) {
    return Object.values(cartItems).length;
}

/**
 * Calculate the subtotal amount for the given items.
 * @param {Object} items - The items in the cart.
 * @returns {string} The subtotal amount formatted to two decimal places.
 */
export const calculateSubTotalAmount = (items) => {
    let total = 0;
    if (items) {
        total = Object.values(items).reduce((amount, item) => amount + (item.price * item.quantity), 0);
    }
    return parseFloat(total).toFixed(2);
};

/**
 * Calculate the total amount for the cart including tax and shipping.
 * @param {Object} items - The items in the cart.
 * @returns {string} The total amount formatted to two decimal places.
 */
export const calculateCartTotal = (items) => {
    const subTotal = parseFloat(calculateSubTotalAmount(items));
    const tax = (subTotal * TAX_RATE) / 100;
    const shipping = SHIPPING_COST_STANDARD;
    return (subTotal + tax + shipping).toFixed(2);
};

/**
 * Calculate the amount for a single item.
 * @param {Object} item - The item to calculate the amount for.
 * @returns {string} The amount for the item formatted to two decimal places.
 */
function calculateAmount(item) {
    return (item.price * item.quantity).toFixed(2);
}

/**
 * Calculate the total amount for the cart including tax and shipping.
 * @param {Object} cart - The cart object containing items and shipping rate.
 * @returns {string} The total cart amount formatted to two decimal places.
 */
function calculateTotalCartAmount(cart) {
    const subTotal = calculateSubTotalAmount(cart.cartItems);
    const shipping = parseFloat(cart.shippingRate);
    const tax = parseFloat(calculateTaxAmount(cart));
    return (subTotal + shipping + tax).toFixed(2);
}

/**
 * Calculate the tax amount for the given items.
 * @param {Object} items - The items in the cart.
 * @returns {string} The tax amount formatted to two decimal places.
 */
export function calculateTaxAmount(items) {
    const subTotal = calculateSubTotalAmount(items);
    const tax = (subTotal * TAX_RATE) / 100;
    return tax.toFixed(2);
}

// Create a copy before modifying the cart to avoid side effects
function getNewCartItems(cartItems, productId, quantity) {
    const newCartItems = { ...cartItems }; // Spread operator for a copy

    if (newCartItems[productId]) {
        newCartItems[productId].quantity += quantity;
    } else {
        newCartItems[productId] = { quantity };
    }

    return newCartItems;
}

let fetchedHTML;

export async function renderPage(name) {
    const componentElement = document.querySelector(
        '.pageContent'
    );

    let pageName = name === "category" ? "category" : name;

    if (componentElement) {
        fetchedHTML = await fetchPage(pageName);

        if (!fetchedHTML) {
            const checkCategoryPage = (await pageName) === name;
            // pageName = checkCategoryPage ? "category" : name;

            fetchedHTML = await fetchPage(pageName);

            if (!fetchedHTML) {
                fetchedHTML = await fetchPage("notfound");
            }
        }

        componentElement.innerHTML = fetchedHTML.innerHTML;
    }
}

export async function fetchPage(name) {
    const path = `${window.location.origin}/src/pages/${name.toLowerCase()}.svelte`;

    const template = await fetch(path)
        .then((response) => response.text())
        .then((text) =>
        new DOMParser()
            .parseFromString(text, "text/html")
            .body
        );

    return template;
}

export function splitUrlPathname(urlpath) {
    return urlpath.replace(/^\/+|\/+$/g, '').split('/').filter(part => part !== '' && part !== ' ');
}

export function getCurrentUrlPath(){
    const url = new URL(window.location.href);
    const replaceOrigin = url.href.replace(url.origin, '').replace(url.search, '')
    const cleanUrl = replaceOrigin.startsWith('/#/') ? replaceOrigin.replace('/#/', '/') : replaceOrigin;
    return url.pathname && url.pathname === cleanUrl ? url.pathname : cleanUrl;
}

export function getUrlMainPage () {
    let newName;
    const currentPath = getCurrentUrlPath().replace(/^\/+|\/+$/g, '');
    const splitedPath = splitUrlPathname(currentPath);
    const first = splitedPath.shift(),
    last = splitedPath.pop();

    const isProductDetailPage = first ? first.includes('product') : '';

    if(isProductDetailPage){
        newName = first;
    }
    
    if(!isProductDetailPage) {
        newName = currentPath && currentPath.length == 1 
        ? first 
        : currentPath && currentPath.length >= 2
        ? last 
        : 'home';
    }

    return newName ? newName : currentPath;
}

export const createUniqueArray = (array) => {
    // Filter out empty values
    return Object.values(array).filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
}

export function uniqueObjects(array, key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
}

export function parseObjectToArray(object){
  let parsedObject = {};
  try {
    parsedObject = {...JSON.parse(object)};
  } catch (error) {
    parsedObject = {...object};
  }
  return parsedObject;
}
  