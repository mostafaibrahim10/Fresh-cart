import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-hot-toast";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { setCart } from "../../Redux/CartSlice";

import api from "../../api/api";



async function AddProductToCart(productId) {
  // FIX: كان هنا: localStorage.getItem("token") + axios.post بعنوان كامل
  // و headers: { token } يدوي — كل ده بيتكرر في كل ملف.
  // دلوقتي: call واحد على الـ instance الموحد.
  const { data } = await api.post(`/cart`, {
    productId,
  });

  return data;
}



export default function Cart({ productId }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  const AddMutation = useMutation({
    mutationFn: AddProductToCart,

    onSuccess: async (data) => {

      dispatch(setCart(data.numOfCartItems || 0));

      queryClient.invalidateQueries({ queryKey: ["cart"] });

      setIsAdded(true);
      setIsAnimating(true);

      toast.success("Product added successfully to your cart");

      setTimeout(() => {
        setIsAnimating(false);
      }, 700);

      setTimeout(() => {
        setIsAdded(false);
      }, 2500);
    },

    onError: () => {
      toast.error(
        "You are not logged in. Please login to get access"
      );
    },
  });


  const handleAddToCart = () => {
    if (!productId) return;

    AddMutation.mutate(productId);
  };


  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={AddMutation.isPending}
      className="
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[#0AAD0A]
        px-4
        py-2.5
        text-sm
        font-bold
        text-white
        shadow-sm
        transition-all
        duration-300
        hover:bg-[#089208]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-70
      "
    >
      <AnimatePresence mode="wait">

        {/* ADD STATE */}

        {!isAdded ? (
          <motion.div
            key="add"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            className="
              flex
              items-center
              gap-2
            "
          >
            <motion.div
              animate={
                isAnimating
                  ? {
                    x: [0, 8, -4, 0],
                    rotate: [
                      0,
                      -8,
                      8,
                      0,
                    ],
                  }
                  : {}
              }
              transition={{
                duration: 0.7,
              }}
            >
              <ShoppingCart
                size={18}
                strokeWidth={2}
              />
            </motion.div>

            <span>
              {AddMutation.isPending
                ? "Adding..."
                : "Add To Cart"}
            </span>
          </motion.div>
        ) : (

          <motion.div
            key="success"
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            className="
              flex
              items-center
              gap-2
            "
          >
            <Check size={18} />

            <span>
              Added Successfully
            </span>
          </motion.div>
        )}

      </AnimatePresence>
    </button>
  );
}