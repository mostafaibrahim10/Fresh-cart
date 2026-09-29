🛒 FreshCart

A responsive e-commerce Single Page Application built with React.js and a RESTful backend API.

FreshCart covers the main shopping journey: discovering products, searching and filtering, viewing product details, managing a cart and wishlist, authenticating users, and completing checkout with Cash on Delivery or Stripe.

🔗 Repository

GitHub: https://github.com/mostafaibrahim10/Fresh-cart

✨ Features

Product Discovery

Browse products from the backend API.

Search by product title, category, brand, and subcategory.

Filter products by category and subcategory.

View dynamic product detail pages.

Display price, discount, rating, stock, brand, category, and product images.

Categories & Brands

Browse product categories and subcategories.

Explore products through category-based navigation.

Browse available brands.

Shopping Cart

Add products to the cart.

Increase or decrease quantities.

Remove individual products.

Clear the cart.

Display the current cart item count in the navbar.

Keep cart data synchronized with the backend.

Wishlist

Add products to the wishlist.

Remove products from the wishlist.

View wishlist items on a dedicated page.

Open wishlist items from the navbar drawer.

Refresh server data after wishlist mutations with TanStack Query.

Authentication

Register a new account.

Login and logout.

Persist authentication data on the client.

Protect authenticated routes.

Forgot password flow.

Verification-code flow.

Reset password flow.

Checkout & Payments

Review cart items before checkout.

Enter shipping information.

Place Cash on Delivery orders.

Create Stripe checkout sessions.

Redirect to the payment URL returned by the API.

Display a payment-success state.

Responsive UI

Responsive layouts for desktop, tablet, and mobile.

Dedicated mobile navigation with a hamburger menu.

Responsive product grids and sliders.

Mobile-friendly cart, wishlist, authentication, and checkout screens.

🧰 Tech Stack

Category

Technologies

Frontend

React 19, JavaScript (ES6+), Vite 8

Routing

React Router 7

Client State

Redux Toolkit, React Redux

Server State

TanStack Query 5

API

Axios, REST API

Styling

Tailwind CSS 4

UI

Lucide React, Flowbite React

Forms

React Hook Form, Zod, @hookform/resolvers

Animation & Interaction

Motion, GSAP, Swiper

Feedback

React Hot Toast, React Loader Spinner

Metadata

React Helmet Async

Drawer

Vaul

The project includes flowbite-react and gsap in its dependencies. They are listed in the stack because they are project dependencies; however, the main application flow relies primarily on Tailwind CSS, Lucide React, Motion, Swiper, and Vaul for UI and interaction.

🏗️ Project Structure

src/
├── api/
│   └── api.js
│
├── assets/
│
├── Components/
│   ├── AnnouncementBar/
│   ├── Footer/
│   ├── Layout/
│   ├── Navbar/
│   ├── NotFound/
│   └── ProtectedRoute/
│
├── pages/
│   ├── Auth/
│   ├── Brands/
│   ├── Cart/
│   ├── Categories/
│   ├── Checkout/
│   ├── Home/
│   ├── Products/
│   ├── Slider/
│   └── Wishlist/
│
├── Redux/
│   ├── AuthenticationSlice.js
│   ├── CartSlice.js
│   └── store.js
│
├── App.jsx
├── App.css
├── index.css
├── jsconfig.json
└── main.jsx

The main separation is:

Components/ — reusable UI and shared application components.

pages/ — page-level features and user flows.

api/ — shared API client and API-related functions.

Redux/ — client-side application state.

🧠 Architecture & State Management

FreshCart separates backend-owned data from lightweight client-side application state.

TanStack Query — Server State

Used for backend data and asynchronous operations such as:

Products

Categories

Cart

Wishlist

Product details

Mutations and checkout requests

Query caching

Query invalidation

Loading and error states

Redux Toolkit — Client State

Used for small application-level state such as:

Authenticated user information

Authentication token

Cart item count

This avoids duplicating server-managed data inside Redux when TanStack Query can manage it directly.

🌐 Global API Client

The project uses a shared Axios instance in:

src/api/api.js

The instance centralizes the backend base URL and uses an Axios request interceptor to attach the authentication token automatically.

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.token = token;
  }

  return config;
});

Why this approach?

Instead of creating a new Axios configuration for every feature, the application imports the same configured API client wherever it is needed.

This demonstrates practical software-design concepts:

Abstraction — API setup is hidden behind one reusable client.

Encapsulation — token injection is handled inside the interceptor.

Reusability — multiple features consume the same API instance.

Separation of concerns — UI components do not need to repeat API configuration.

Technical note: this is more accurately described as API abstraction and reuse rather than classical OOP inheritance. The project does not use class / extends; it uses a shared Axios instance that is imported and reused across features.

🔐 Authentication Flow

Register
   ↓
Login
   ↓
Store authentication data
   ↓
Access protected routes

Password recovery:

Forgot Password
   ↓
Send verification code
   ↓
Verify code
   ↓
Reset password
   ↓
Login

Protected routes are handled through a dedicated ProtectedRoute component.

🛒 Shopping Flow

Home
  ↓
Products
  ↓
Search / Filtering
  ↓
Product Details
  ↓
Cart / Wishlist
  ↓
Checkout
  ↓
Cash or Stripe
  ↓
Payment Success

💳 Checkout Flow

Cash on Delivery

Cart
 ↓
Checkout
 ↓
Shipping Information
 ↓
Create Cash Order
 ↓
Payment Success

Stripe

Cart
 ↓
Checkout
 ↓
Shipping Information
 ↓
Create Stripe Checkout Session
 ↓
Redirect to Stripe
 ↓
Return to Application

⚡ Performance & Data Efficiency

The project uses targeted techniques to avoid unnecessary server requests and repeated calculations:

TanStack Query caching.

Configured staleTime values for reused server data.

Disabled unnecessary refetchOnWindowFocus behavior where appropriate.

useMemo for derived product data and filtering.

Shared query keys for synchronized cart and wishlist data.

These are practical caching and rendering optimizations rather than a claim of complete production-level performance engineering.

📱 Responsive Navigation

On desktop, the application uses the full navigation bar.

On smaller screens, the layout switches to a dedicated mobile navigation pattern:

☰   FreshCart   ♡   🛒

The hamburger menu contains the main navigation sections while high-frequency shopping actions such as Wishlist and Cart remain directly accessible from the header.

🎯 Key Technical Highlights

Built a React 19 Single Page Application with Vite.

Implemented dynamic routing with React Router.

Integrated REST APIs using Axios.

Created a reusable global Axios API client with request interceptors.

Managed server state with TanStack Query.

Managed client-side state with Redux Toolkit.

Implemented asynchronous data fetching, mutations, caching, and query invalidation.

Built authentication and password-recovery flows.

Implemented protected routes.

Built cart and wishlist management.

Implemented Cash on Delivery and Stripe checkout flows.

Added responsive layouts and mobile navigation.

Implemented form handling and schema validation.

Built reusable React components for shared UI patterns.



👨‍💻 Author

Mostafa Ibrahim
Frontend Developer focused on React.js, JavaScript, REST APIs, state management, and modern frontend development.
