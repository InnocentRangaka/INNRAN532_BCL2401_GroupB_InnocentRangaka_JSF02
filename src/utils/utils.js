
import { initializeCategories } from "../api/api";

const TAX_RATE = Number(0.15); // Number
const SHIPPING_COST_STANDARD = Number(5.00); // Number
const SHIPPING_COST_EXPRESS = Number(16.00); // Number

// Helper functions
function calculateCartTotalItems(cartItems) {
    return Object.values(cartItems).length;
}

export const calculateSubTotalAmount = (items) => {
    const total = items.reduce((amount, item) => amount + (item.price * item.quantity), 0);
    return parseFloat(total).toFixed(2);
};

export const calculateCartTotal = (items) => {
    const subTotal = parseFloat(calculateSubTotalAmount(items));
    const tax = subTotal * TAX_RATE;
    const shipping = SHIPPING_COST_STANDARD;
    return (subTotal + tax + shipping).toFixed(2);
};

function calculateAmount(item) {
    return (item.price * item.quantity).toFixed(2);
}

function calculateTotalCartAmount(cart) {
    const subTotal = parseFloat(calculateSubTotalAmount(cart.cartItems));
    const shipping = parseFloat(cart.shippingRate);
    const tax = parseFloat(calculateTaxAmount(cart));
    return (subTotal + shipping + tax).toFixed(2);
}

export function calculateTaxAmount(cart) {
    return (parseFloat(calculateSubTotalAmount(cart.cartItems)) * TAX_RATE).toFixed(2);
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
    return url.pathname ? url.pathname : '';
}

export function getUrlMainPage () {
    const currentPath = getCurrentUrlPath().replace(/^\/+|\/+$/g, '')
    const splitedPath = currentPath && currentPath.length == 1 
      ? splitUrlPathname(currentPath).shift() 
      : currentPath && currentPath.length >= 2
      ? splitUrlPathname(currentPath).pop() 
      : 'home';
    return splitedPath;
}

export const init = (type = 'products', app) => {
    if(type.toLowerCase() === 'products'){
      initializeCategories(app)
    }
}