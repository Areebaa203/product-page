import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ProductCard from "../components/ProductCard";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectWishlistItems);

  // For ProductCard's onDelete
  const handleDeleteProduct = (productId) => {
    try {
      const localProducts = JSON.parse(
        localStorage.getItem("userProducts") || "[]",
      );
      const updatedLocal = localProducts.filter((p) => p.id !== productId);
      localStorage.setItem("userProducts", JSON.stringify(updatedLocal));
      
      // Also remove from wishlist if it was there
      dispatch(removeFromWishlist(productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-10 md:px-12 py-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-sm text-slate-500">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </button>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearWishlist())}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Clear Wishlist
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-700">Your wishlist is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={true}
              onAddToCart={(prod) => dispatch(addToCart(prod))}
              onToggleWishlist={(prod) => dispatch(removeFromWishlist(prod.id))}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
