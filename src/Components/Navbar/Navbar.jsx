import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import ImgeIcon from "../../assets/freshcart-logo.svg";
import AnnouncementBar from "../AnnouncementBar/AnnouncementBar";
import WishlistSlide from "../../pages/Wishlist/WishlistSlide";

import {
  logout,
  clearAuthFromStorage,
} from "../../Redux/AuthenticationSlice";

import { setCart } from "../../Redux/CartSlice";
import api from "../../api/api";


const DESKTOP_LINKS = [
  { name: "Home", path: "/" },
  { name: "Brands", path: "/Brands" },
  { name: "Products", path: "/Products" },
  { name: "Cart", path: "/Cart" },
];

const MOBILE_LINKS = [
  { name: "Home", path: "/" },
  { name: "Categories", path: "/Categories" },
  { name: "Brands", path: "/Brands" },
  { name: "Products", path: "/Products" },
];



const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};



function CartIcon({ count, mobile = false }) {
  return (
    <div
      className={
        mobile
          ? "relative"
          : "relative"
      }
    >
      <motion.div
        animate={{
          scale: count > 0 ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        <ShoppingCart size={22} strokeWidth={2} />
      </motion.div>

      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 18,
          }}
          className="
            absolute
            -right-2.5
            -top-2
            flex
            h-[18px]
            min-w-[18px]
            items-center
            justify-center
            rounded-full
            bg-red-500
            px-1
            text-[10px]
            font-bold
            leading-none
            text-white
            shadow-sm
          "
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}


export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  const token = useSelector(
    (state) => state.authentication.token
  );

  const user = useSelector(
    (state) => state.authentication.user
  );


  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const cartCount = useSelector(
    (state) => state.cart.count
  );

  useEffect(() => {
    dispatch(
      setCart(cartData?.numOfCartItems ?? 0)
    );
  }, [cartData, dispatch]);

  const handleLogout = () => {
    clearAuthFromStorage();
    dispatch(logout());
    dispatch(setCart(0));

    queryClient.removeQueries({
      queryKey: ["cart"],
    });

    queryClient.removeQueries({
      queryKey: ["wishlist"],
    });

    setMenuOpen(false);

    toast.success("Logged out successfully");
    navigate("/Login");
  };


  const closeMenu = () => setMenuOpen(false);

  return (
    <>
  

      <nav className="fixed z-50 w-full border-b border-gray-200 bg-white shadow-sm">

        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">


          <div className="hidden h-20 items-center justify-between md:flex">

            {/* AUTH */}

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Hello{" "}
                    <span className="font-bold text-[#0aad0a]">
                      {user.name}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      rounded-lg
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/Login"
                  className={({ isActive }) =>
                    `rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Login
                </NavLink>
              )}
            </div>

            {/* LINKS */}

            <div className="flex items-center gap-1">
              {DESKTOP_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  {link.name === "Cart" ? (
                    <div className="flex min-w-[55px] flex-col items-center">
                      <CartIcon count={cartCount} />

                      <span className="mt-1 text-xs font-medium">
                        Cart
                      </span>
                    </div>
                  ) : (
                    link.name
                  )}
                </NavLink>
              ))}
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="
                  rounded-xl
                  p-2
                  text-gray-700
                  transition
                  hover:bg-red-50
                  hover:text-red-500
                "
                aria-label="Open wishlist"
              >
                <Heart size={22} />
              </button>

              <NavLink
                to="/"
                className="flex items-center"
              >
                <img
                  src={ImgeIcon}
                  alt="Freshcart"
                  className="h-auto w-[150px]"
                />
              </NavLink>

            </div>
          </div>

          {/* ========================================
              MOBILE
          ======================================== */}

          <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center md:hidden">

            {/* MENU */}

            <div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-700
                  transition
                  hover:bg-gray-100
                "
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* LOGO */}

            <NavLink
              to="/"
              onClick={closeMenu}
              className="flex justify-center"
            >
              <img
                src={ImgeIcon}
                alt="Freshcart"
                className="h-auto w-[120px] sm:w-[135px]"
              />
            </NavLink>

            {/* ACTIONS */}

            <div className="flex justify-end gap-1 sm:gap-2">

              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-700
                  transition
                  hover:bg-red-50
                  hover:text-red-500
                "
                aria-label="Open wishlist"
              >
                <Heart size={22} />
              </button>

              <NavLink
                to="/Cart"
                onClick={closeMenu}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-700
                  transition
                  hover:bg-gray-100
                "
                aria-label="Open cart"
              >
                <CartIcon
                  count={cartCount}
                  mobile
                />
              </NavLink>

            </div>
          </div>

        </div>

        {/* ANNOUNCEMENT */}

        <div className="w-full overflow-hidden">
          <AnnouncementBar />
        </div>

      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">

          {/* OVERLAY */}

          <button
            type="button"
            onClick={closeMenu}
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
          />

          {/* DRAWER */}

          <aside className="absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5">

              <img
                src={ImgeIcon}
                alt="Freshcart"
                className="h-auto w-[135px]"
              />

              <button
                type="button"
                onClick={closeMenu}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-700
                  transition
                  hover:bg-gray-100
                "
                aria-label="Close menu"
              >
                <X size={24} />
              </button>

            </div>

            {/* USER */}

            <div className="border-b border-gray-200 px-5 py-4">

              {user ? (
                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Welcome back
                    </p>

                    <p className="truncate text-sm font-bold text-[#0aad0a]">
                      {user.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      shrink-0
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <NavLink
                  to="/Login"
                  onClick={closeMenu}
                  className="
                    block
                    w-full
                    rounded-lg
                    bg-blue-700
                    px-4
                    py-3
                    text-center
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-800
                  "
                >
                  Login
                </NavLink>
              )}

            </div>

            {/* MENU CONTENT */}

            <div className="flex-1 overflow-y-auto px-4 py-5">

              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Navigation
              </p>

              <div className="space-y-1">

                {MOBILE_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3.5 text-base font-medium transition ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

              </div>

              {/* SHOPPING */}

              <div className="mt-7">

                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Shopping
                </p>

                <div className="space-y-1">

                  <NavLink
                    to="/Cart"
                    onClick={closeMenu}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      px-4
                      py-3.5
                      text-base
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-100
                    "
                  >
                    <span>Cart</span>

                    {cartCount > 0 && (
                      <span className="
                        flex
                        h-6
                        min-w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        px-2
                        text-xs
                        font-bold
                        text-white
                      ">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      setWishlistOpen(true);
                    }}
                    className="
                      w-full
                      rounded-xl
                      px-4
                      py-3.5
                      text-left
                      text-base
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-100
                    "
                  >
                    Wishlist
                  </button>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="border-t border-gray-200 px-5 py-4">

              <p className="text-center text-xs text-gray-400">
                FreshCart
              </p>

            </div>

          </aside>
        </div>
      )}

      {/* WISHLIST */}

      <WishlistSlide
        open={wishlistOpen}
        onOpenChange={setWishlistOpen}
      />
    </>
  );
}