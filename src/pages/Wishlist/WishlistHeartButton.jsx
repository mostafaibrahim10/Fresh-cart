

import { useMemo } from "react";

import { Heart } from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

import { toast } from "react-hot-toast";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../../api/api";

async function GetWishlist() {
  const { data } = await api.get(`/wishlist`);
  return data;
}

async function AddToWishlist(productId) {
  const { data } = await api.post(`/wishlist`, {
    productId,
  });

  return data;
}


async function RemoveFromWishlist(productId) {
  const { data } = await api.delete(
    `/wishlist/${productId}`
  );

  return data;
}


export default function WishlistHeartButton({ productId }) {
  const queryClient = useQueryClient();
  const {
    data: WishlistData,
    isLoading: isWishlistLoading,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: GetWishlist,
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });



  const WishlistProducts = useMemo(() => {
    return WishlistData?.data || [];
  }, [WishlistData]);

  const isWishlisted = useMemo(() => {
    return WishlistProducts.some(
      (product) => product.id === productId || product._id === productId
    );
  }, [WishlistProducts, productId]);


  const AddMutation = useMutation({
    mutationFn: AddToWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      toast.success(
        "Product added successfully to your wishlist"
      );
    },

    onError: () => {
      toast.error(
        "You are not logged in. Please login to get access"
      );
    },
  });


  const RemoveMutation = useMutation({
    mutationFn: RemoveFromWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      toast.success("Removed from Wishlist");
    },

    onError: () => {
      toast.error("Something went wrong");
    },
  });


  function toggleWishlist() {
    if (!productId) return;

    if (!localStorage.getItem("token")) {
      toast.error(
        "You are not logged in. Please login first"
      );

      return;
    }

    if (isWishlisted) {
      RemoveMutation.mutate(productId);
    } else {
      AddMutation.mutate(productId);
    }
  }


  const isLoading =
    AddMutation.isPending ||
    RemoveMutation.isPending ||
    isWishlistLoading;


  return (
    <div className="absolute right-4 top-4 z-30">
      <motion.button
        type="button"
        onClick={toggleWishlist}
        disabled={isLoading}
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 0.85,
        }}
        animate={
          isWishlisted
            ? {
              scale: [1, 1.25, 0.95, 1.1],
            }
            : {
              scale: 1,
            }
        }
        transition={{
          duration: 0.45,
        }}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full shadow-lg backdrop-blur-md transition-colors ${isWishlisted
          ? "bg-rose-50 text-rose-500"
          : "bg-white/90 text-gray-700 hover:bg-gray-900 hover:text-white"
          } ${isLoading
            ? "cursor-not-allowed opacity-60"
            : ""
          }`}
      >
        {/* Ripple */}

        <AnimatePresence>
          {isWishlisted && (
            <motion.span
              initial={{
                opacity: 0.7,
                scale: 0.8,
              }}
              animate={{
                opacity: 0,
                scale: 1.8,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="absolute inset-0 rounded-full bg-rose-400"
            />
          )}
        </AnimatePresence>

        {/* Heart */}

        <motion.div
          animate={
            isWishlisted
              ? {
                scale: [1, 1.4, 1],
                rotate: [0, -10, 10, 0],
              }
              : {
                scale: 1,
                rotate: 0,
              }
          }
          transition={{
            duration: 0.45,
          }}
          className="relative z-10"
        >
          <Heart
            size={20}
            strokeWidth={2.3}
            className={
              isWishlisted
                ? "fill-rose-500 stroke-rose-500"
                : ""
            }
          />
        </motion.div>

        {/* Particles */}

        <AnimatePresence>
          {isWishlisted && (
            <>
              <motion.span
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  x: -20,
                  y: -15,
                  scale: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-rose-500"
              />

              <motion.span
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  x: 20,
                  y: -15,
                  scale: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-pink-400"
              />

              <motion.span
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                }}
                animate={{
                  opacity: 0,
                  x: 0,
                  y: -22,
                  scale: 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-rose-400"
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
