import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  Wallet,
  ShoppingBag,
} from "lucide-react";

import { toast } from "react-hot-toast";

import api from "../../api/api";


async function GetLoggedUserCart() {
  const { data } = await api.get("/cart");

  return data;
}


async function CreateCashOrder({
  cartId,
  shippingAddress,
}) {
  const { data } = await api.post(
    `/orders/${cartId}`,
    {
      shippingAddress,
    }
  );

  return data;
}


async function CreateCheckoutSession({
  cartId,
  shippingAddress,
}) {
  const { data } = await api.post(
    `/orders/checkout-session/${cartId}`,
    {
      shippingAddress,
    },
    {
      params: {
        url: `${window.location.origin}/PaymentSuccess`,
      },
    }
  );

  return data;
}


export default function Checkout() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();


  const [formData, setFormData] = useState({
    details: "",
    phone: "",
    city: "",
  });



  const [paymentMethod, setPaymentMethod] =
    useState("cash");



  const {
    data: CartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],

    queryFn: GetLoggedUserCart,

    enabled: !!localStorage.getItem("token"),

    staleTime: Infinity,

    refetchOnWindowFocus: false,
  });


  const cart = CartData?.data;

  const cartProducts = cart?.products || [];

  const cartId = cart?._id;



  const CartSummary = useMemo(() => {
    const totalItems = cartProducts.reduce(
      (total, item) => total + item.count,
      0
    );

    const totalPrice = cartProducts.reduce(
      (total, item) =>
        total + item.price * item.count,
      0
    );

    return {
      totalItems,
      totalPrice,
    };
  }, [cartProducts]);



  const CashOrderMutation = useMutation({
    mutationFn: CreateCashOrder,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });


      toast.success("Order placed successfully");


      navigate("/PaymentSuccess");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to create order"
      );
    },
  });


  const OnlinePaymentMutation = useMutation({
    mutationFn: CreateCheckoutSession,

    onSuccess: (data) => {

      const checkoutUrl =
        data?.session?.url ||
        data?.data?.session?.url ||
        data?.url ||
        data?.data?.url;


      if (!checkoutUrl) {
        toast.error(
          "Payment URL was not returned"
        );

        return;
      }


      window.location.href = checkoutUrl;
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
        "Failed to start payment"
      );
    },
  });


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    if (!cartId || cartProducts.length === 0) {
      toast.error("Your cart is empty");

      return;
    }


    if (
      !formData.details.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim()
    ) {
      toast.error(
        "Please complete your shipping information"
      );

      return;
    }

    const shippingAddress = {
      details: formData.details.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
    };


    if (paymentMethod === "cash") {
      CashOrderMutation.mutate({
        cartId,
        shippingAddress,
      });

      return;
    }


    OnlinePaymentMutation.mutate({
      cartId,
      shippingAddress,
    });
  };


  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-red-500">
            Failed to load cart
          </h2>

          <button
            onClick={() => navigate("/Cart")}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Back To Cart
          </button>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
          <ShoppingBag
            size={55}
            className="mx-auto mb-5 text-gray-300"
          />

          <h2 className="text-2xl font-bold text-slate-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-slate-500">
            Add some products before checking out.
          </p>

          <button
            onClick={() => navigate("/Products")}
            className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-400"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isSubmitting =
    CashOrderMutation.isPending ||
    OnlinePaymentMutation.isPending;


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <button
            onClick={() => navigate("/Cart")}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
          >
            <ArrowLeft size={18} />
            Back To Cart
          </button>

          <p className="text-sm font-bold uppercase tracking-widest text-emerald-500">
            Checkout
          </p>

          <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 text-slate-500">
            Enter your shipping information and choose your payment method.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">


          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >

            {/* SHIPPING INFORMATION */}

            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Shipping Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="space-y-5">

                {/* ADDRESS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Address Details
                  </label>

                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Street, building, apartment..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Phone size={16} />
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* CITY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Cairo"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

              </div>
            </div>

            {/*PAYMENT METHOD */}

            <div>
              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-slate-500">
                    Choose how you want to pay.
                  </p>
                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* CASH */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cash")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${paymentMethod === "cash"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="mb-3 flex items-center justify-between">

                    <Wallet size={24} />

                    <div
                      className={`h-4 w-4 rounded-full border-2 ${paymentMethod === "cash"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300"
                        }`}
                    />

                  </div>

                  <h3 className="font-bold text-slate-900">
                    Cash On Delivery
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Pay when your order arrives.
                  </p>
                </button>

                {/* ONLINE */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("online")
                  }
                  className={`rounded-2xl border p-5 text-left transition ${paymentMethod === "online"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="mb-3 flex items-center justify-between">

                    <CreditCard size={24} />

                    <div
                      className={`h-4 w-4 rounded-full border-2 ${paymentMethod === "online"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                        }`}
                    />

                  </div>

                  <h3 className="font-bold text-slate-900">
                    Online Payment
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Continue to secure payment.
                  </p>
                </button>

              </div>
            </div>

            {/*SUBMIT BUTTON*/}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {CashOrderMutation.isPending
                ? "Creating Order..."
                : OnlinePaymentMutation.isPending
                  ? "Redirecting To Payment..."
                  : paymentMethod === "cash"
                    ? "Place Cash Order"
                    : "Continue To Payment"}
            </button>

          </form>

          {/*ORDER SUMMARY*/}

          <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-xl lg:sticky lg:top-6">

            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Order Summary
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {CartSummary.totalItems} Items
            </h2>

            {/* CART ITEMS */}

            <div className="my-6 max-h-80 space-y-4 overflow-y-auto border-y border-white/10 py-6">

              {cartProducts.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-3"
                >

                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <p className="line-clamp-2 text-sm font-semibold text-white">
                      {item.product.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.count} × {item.price} EGP
                    </p>

                  </div>

                  <p className="text-sm font-bold text-emerald-400">
                    {(item.price * item.count).toLocaleString()} EGP
                  </p>

                </div>
              ))}

            </div>

            {/* TOTAL */}

            <div className="flex items-center justify-between">

              <span className="font-bold">
                Total
              </span>

              <span className="text-2xl font-black text-emerald-400">
                {CartSummary.totalPrice.toLocaleString()} EGP
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}