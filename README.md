### INNRAN532_BCL2401_GroupB_InnocentRangaka_JSF02

# E-Commerce Store in Svelte

## Project Description

This project is a refactor of an existing e-commerce store, converting it from React to Svelte. The application allows users to browse a grid of product cards, view product details, filter and sort products, and navigate between views. All product data is fetched from the Fake Store API, ensuring that no shop data is hardcoded into the application.

## Features

- **Product Grid View**
  - Displays a grid of product cards
  - Each card shows an image, title, price, and category of the product
  - Users can navigate to a detailed view of the product

- **Product Detailed View**
  - Shows the product title, description, image, price, category, rating, and number of reviews
  - Users can navigate back to the product grid view

- **Data Fetching**
  - All shop data is loaded via fetch calls from the Fake Store API
  - Product data is fetched from individual product endpoints when viewing a specific product
  - Loading states are displayed while data is being fetched

- **Filtering and Sorting**
  - Users can filter products by category (categories fetched from the API)
  - Users can sort products by lowest and highest price
  - Users can reset filters and sorting without refreshing the app
  - Applied filters and sorting are preserved after navigating to a detailed view and returning to the home page (without using local storage)

## Technologies Used

- **Svelte**: Front-end framework for building user interfaces
- **JavaScript**: Programming language for the web
- **Fetch API**: For making HTTP requests to fetch data from the Fake Store API
- **HTML**: Markup language for structuring web content
- **CSS**: Stylesheet language for designing web pages

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/InnocentRangaka/INNRAN532_BCL2401_GroupB_InnocentRangaka_JSF02.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```

4. **Open the Application**
   - Open your browser and navigate to `http://localhost:5000` to see the application in action.

## API Endpoints

- **Products**
  - `GET /products`: Fetch all products
  - `GET /products/:id`: Fetch a single product by its ID
  - `GET /products/categories`: Fetch all product categories

## Documentation

- **Code Documentation**
  - The code is documented using JSDoc. Comments are included to describe the functionality of different parts of the code.
