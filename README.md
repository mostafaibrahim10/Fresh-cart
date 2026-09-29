🛒 FreshCart — React E-Commerce Web Application

FreshCart is a responsive single-page e-commerce application built with React.js and a RESTful backend API.

The application covers the main shopping journey: product discovery, search and filtering, product details, authentication, cart management, wishlist management, checkout, and payment flows.

The project also focuses on practical frontend architecture: server-state vs client-state management, asynchronous data fetching, caching, query invalidation, protected routes, API abstraction, reusable components, form validation, and responsive UI.

✨ What Can Users Do?

🛍️ Product Discovery

Browse the available product catalog.

Search products by title, category, brand, and subcategory.

Filter products by category and subcategory.

Open a dynamic product details page for each product.

View product information such as price, rating, stock, brand, category, and images.

🏷️ Categories & Brands

Browse product categories through a responsive slider.

Open category details.

Browse products through subcategories.

Browse available brands.

🛒 Shopping Cart

Add products to the cart.

Increase or decrease product quantities.

Remove individual products.

Clear the cart.

Display the current cart item count in the navigation bar.

Keep cart data synchronized with the backend.

❤️ Wishlist

Add products to the wishlist.

Remove products from the wishlist.

View wishlist items in a dedicated page.

Open the wishlist from the navigation bar through a drawer.

Refresh wishlist data after mutations using TanStack Query.

🔐 Authentication

Create a new account.

Sign in and sign out.

Persist authentication data using local storage.

Access protected application routes only when authenticated.

Recover a forgotten password through a verification-code flow.

Verify the reset code.

Create a new password.

💳 Checkout & Payments

Review cart information before checkout.

Enter shipping information.

Select a payment method.

Complete an order using Cash on Delivery.

Start an online Stripe checkout session.

Return to the application after the Stripe flow.

Display a payment-success state.

📱 Responsive Experience

Responsive layouts for mobile, tablet, and desktop.

Mobile navigation drawer with access to the main sections.

Responsive product grids and sliders.

Mobile-friendly cart, wishlist, authentication, and checkout interfaces.

🧰 Tech Stack

Core

React 19 — component-based UI development.

JavaScript (ES6+) — application logic and data manipulation.

Vite 8 — development server and build tooling.

Routing & State Management

React Router 7 — client-side routing, dynamic routes, layouts, and protected routes.

Redux Toolkit — lightweight client-side application state.

React Redux — connecting React components to the Redux store.

TanStack Query 5 — server-state management, asynchronous fetching, caching, mutations, and query invalidation.

API & Data

Axios — HTTP communication with the REST API.

Routemisr E-Commerce REST API — backend data source for products, categories, cart, wishlist, authentication, and checkout operations.

Styling & UI

Tailwind CSS 4 — responsive utility-first styling.

Lucide React — interface icons.

Swiper — product/category and hero sliders.

Vaul — drawer-based wishlist UI.

Forms & Validation

React Hook Form — form state and submission handling.

Zod — schema-based validation.

@hookform/resolvers — connecting Zod with React Hook Form.

UX & Interaction

Motion — UI transitions and micro-interactions.

React Hot Toast — success and error notifications.

React Loader Spinner — loading indicators.

React Helmet Async — page-level metadata management.

flowbite-react and gsap are present in the project's dependency list but are not part of the active implementation. They are intentionally not presented above as core technologies used by FreshCart.

🏗️ Project Structure

src/
├── api/
│   └── api.js
│
├── assets/
│   ├── freshcart-logo.svg
│   ├── grocery-banner*.jpg
│   ├── slider-image-*.jpeg
│   └── error.svg
│
├── Components/
│   ├── AnnouncementBar/
│   │   ├── AnnouncementBar.jsx
│   │   └── TextLoop.jsx
│   │
│   ├── Footer/
│   │   └── Footer.jsx
│   │
│   ├── Layout/
│   │   └── Layout.jsx
│   │
│   ├── Navbar/
│   │   └── Navbar.jsx
│   │
│   ├── NotFound/
│   │   └── NotFound.jsx
│   │
│   └── ProtectedRoute/
│       └── ProtectedRoute.jsx
│
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── VerifyResetCode.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── Brands/
│   │   ├── Brands.jsx
│   │   └── BrandDetails.jsx
│   │
│   ├── Cart/
│   │   ├── Cart.jsx
│   │   └── CartPage.jsx
│   │
│   ├── Categories/
│   │   ├── Categories.jsx
│   │   ├── CategoryDetails.jsx
│   │   └── SubCategory.jsx
│   │
│   ├── Checkout/
│   │   ├── Checkout.jsx
│   │   └── PaymentSuccess.jsx
│   │
│   ├── Home/
│   │   └── Home.jsx
│   │
│   ├── Products/
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   └── CategoryTree.jsx
│   │
│   ├── Slider/
│   │   └── Slider.jsx
│   │
│   └── Wishlist/
│       ├── Wishlist.jsx
│       ├── WishlistHeartButton.jsx
│       └── WishlistSlide.jsx
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

🧠 Architecture Overview

The application is organized around three main concerns:

React Components / Pages
        │
        ├── React Router
        │
        ├── Redux Toolkit
        │      └── Client-side state
        │
        └── TanStack Query
               └── Server-side state
                       │
                       ▼
                Axios API Client
                       │
                       ▼
             Routemisr REST API

Client State

Redux Toolkit is intentionally kept small and is used for application-level state such as:

Authenticated user information.

Authentication token.

Cart item count displayed in the navbar.

Server State

TanStack Query handles backend-owned data such as:

Products.

Categories.

Cart data.

Wishlist data.

Product details.

Checkout-related requests.

This separation keeps API data out of Redux when React Query can manage it directly.

🌐 API Architecture

One of the architectural improvements in the project is the introduction of a shared Axios API client in:

src/api/api.js

The shared instance centralizes the API base URL:

const api = axios.create({
  baseURL: BASE_URL,
});

It also uses an Axios request interceptor to attach the user's token automatically:

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.token = token;
  }

  return config;
});

This reduces repeated configuration and avoids manually attaching the token to every authenticated request.

API Abstraction & Reusability

The shared API client acts as a reusable abstraction layer between the React application and the backend. Feature modules can consume the same configured client instead of creating their own Axios instance.

This demonstrates practical concepts of:

Abstraction — API configuration is encapsulated in one place.

Encapsulation — authentication-header behavior is handled by the client interceptor.

Reusability — multiple features consume the same configured API client.

Separation of concerns — UI components do not need to know the API base configuration.

Technical note: this implementation is better described as API abstraction, encapsulation, and reuse rather than classical class inheritance. The code does not use class / extends; it uses a shared Axios instance. This distinction keeps the documentation accurate.

🔄 TanStack Query

TanStack Query is used as the server-state layer.

Examples of the responsibilities handled by React Query include:

Asynchronous API fetching.

Loading and error states.

Query caching.

Mutations.

Query invalidation.

Keeping UI data synchronized with backend responses.

Preventing unnecessary refetching through query configuration.

Example pattern:

useQuery({
  queryKey: ["cart"],
  queryFn: getCart,
  enabled: Boolean(token),
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
});

The project also uses mutations for operations such as adding or removing cart and wishlist items.

🗃️ Redux Toolkit

Redux Toolkit is used for small pieces of client-side state rather than duplicating the backend cache.

Authentication Slice

user
token

The authentication slice also provides storage helpers for persisting and clearing authentication data in local storage.

Cart Slice

count

The cart count is synchronized from the backend cart response and displayed in the navbar.

This keeps Redux lightweight while TanStack Query remains responsible for the actual server-owned cart and wishlist data.

🔐 Authentication & Protected Routes

Authentication includes:

Register
   ↓
Login
   ↓
Store User + Token
   ↓
Protected Routes

Password recovery:

Forgot Password
   ↓
Verification Code
   ↓
Verify Code
   ↓
Reset Password

Protected routes are handled with React Router and a dedicated ProtectedRoute component.

The guard redirects unauthenticated users to the login page.

🛒 Shopping Flow

The main shopping journey is:

Home
  ↓
Products
  ↓
Search / Filtering
  ↓
Product Details
  ↓
Wishlist / Cart
  ↓
Checkout
  ↓
Cash or Stripe
  ↓
Payment Success

This gives the application a complete user-facing shopping flow rather than a collection of disconnected UI pages.

💳 Checkout & Payment

The checkout page communicates with the backend to create orders.

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

The frontend is responsible for initiating the Stripe checkout session and redirecting the user to the payment URL returned by the API.

📱 Responsive Design

Responsive behavior was implemented using Tailwind CSS breakpoints.

The mobile experience uses a dedicated navigation pattern instead of trying to compress the desktop navbar into a small viewport:

☰  FreshCart  ♡  🛒

The mobile menu provides access to:

Home

Categories

Brands

Products

Cart

Wishlist

Login / Logout

This keeps high-frequency shopping actions visible while moving lower-priority navigation items into the menu.

⚡ Performance & Data Efficiency

The project applies several practical techniques for reducing unnecessary work:

TanStack Query caching.

Configured staleTime values for frequently reused server data.

Disabled unnecessary window-focus refetching where appropriate.

useMemo for derived product filtering and calculated product data.

A single QueryClient instance created outside the App component.

A single router instance created outside the App component.

These are targeted optimizations and caching strategies; the project does not claim to be a fully performance-optimized production application.

🧩 Reusable Components

Reusable UI pieces include:

Navbar

Footer

Layout

ProtectedRoute

AnnouncementBar

TextLoop

Cart

WishlistHeartButton

WishlistSlide

Slider

CategoryTree

The goal is to keep repeated UI behavior encapsulated instead of rebuilding the same interaction in every page.

📌 Key Technical Highlights

Built a React SPA using React 19 + Vite.

Implemented client-side routing with React Router.

Implemented protected routes for authenticated shopping features.

Integrated a REST API using Axios.

Created a reusable shared API client with automatic authentication-token injection.

Managed server state with TanStack Query.

Managed client-side application state with Redux Toolkit.

Implemented asynchronous fetching, mutations, caching, and query invalidation.

Built authentication and password-recovery flows.

Implemented cart and wishlist management.

Integrated Cash on Delivery and Stripe checkout flows.

Added responsive layouts for mobile, tablet, and desktop.

Added form validation using React Hook Form + Zod.

Added dynamic product routes and product-level metadata.

Built reusable UI components and interactive navigation.

📋 Route Overview

Public Routes

Route

Purpose

/

Home page

/Products

Product catalog

/ProductDetails/:id

Product details

/Brands

Brand listing

/BrandDetails/:id

Brand details route

/Categories

Category listing

/CategoryDetails/:id

Category details

/SubCategory/:id

Subcategory route

/Login

User login

/Register

User registration

/ForgotPassword

Password recovery

/VerifyResetCode

Verification code

/ResetPassword

Password reset

Protected Routes

Route

Purpose

/Cart

User cart

/Wishlist

User wishlist

/Checkout

Checkout

/PaymentSuccess

Successful payment state

/Addresses

Address page



👨‍💻 Author

Mostafa Ibrahim
Frontend Developer focused on React.js, JavaScript, REST APIs, state management, and modern frontend development.

⭐ Project Focus

FreshCart was built to practice and demonstrate how a modern React frontend can connect UI components, client state, server state, authentication, API communication, and e-commerce business flows into one application.