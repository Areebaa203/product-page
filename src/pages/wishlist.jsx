import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "../redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectWishlistItems);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
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
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-50">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="mt-3">
                <p className="line-clamp-2 font-semibold text-slate-900">
                  {p.title}
                </p>
                <p className="mt-1 text-slate-700">${p.price}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => dispatch(removeFromWishlist(p.id))}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
