import { Heart, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  onDelete,
  wished = false,
}) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Calculate Rating & Reviews
  const reviewsList = product.reviews || [];
  const reviewCount = reviewsList.length;
  
  const avgRating = reviewCount 
    ? reviewsList.reduce((acc, r) => acc + (r.rating || 0), 0) / reviewCount
    : (product.rating || 0);

  const displayRating = Number(avgRating).toFixed(1);
  const fullStars = Math.round(avgRating);

  const subtitle = product.brand
    ? `${product.brand} available`
    : "5 types of shoes available";

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="cursor-pointer rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/product/${product.id}`);
      }}
    >
      {/* Image */}
      <div className="relative bg-slate-50 p-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm border border-slate-100"
          aria-label="Wishlist"
          type="button"
        >
          <Heart
            className={`h-5 w-5 ${
              wished ? "fill-slate-800 text-slate-800" : "text-slate-500"
            }`}
          />
        </button>

        {product.isUserCreated && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
              className="cursor-pointer absolute right-4 top-16 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-slate-800"
              aria-label="More Options"
              type="button"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showOptions && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/create-product", { state: { product } });
                  }}
                  className="cursor-pointer absolute right-4 top-28 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-slate-800"
                  aria-label="Edit"
                  type="button"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm("Are you sure you want to delete this product?")
                    ) {
                      onDelete?.(product.id);
                    }
                  }}
                  className="cursor-pointer absolute right-4 top-40 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm border border-slate-100 text-red-500 hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </>
        )}

        <img
          src={product.thumbnail}
          alt={product.title}
          className="mx-auto h-40 w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-700 line-clamp-1">
              {product.title}
            </h3>
            <p className="mt-1 text-sm text-slate-400 line-clamp-1">
              {subtitle}
            </p>
          </div>

          <p className="text-base font-semibold text-slate-700 whitespace-nowrap">
            $ {Number(product.price).toFixed(2)}
          </p>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => {
              const idx = i + 1;
              const filled = idx <= fullStars;
              return (
                <span key={i} className="text-amber-500 text-sm">
                  {filled ? "★" : "☆"}
                </span>
              );
            })}
          </div>
          <span className="text-sm text-slate-400">({displayRating})</span>
        </div>

        {/* Button */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            disabled={added}
            onClick={(e) => {
              e.stopPropagation();
              if (added) return;

              onAddToCart?.(product);

              setAdded(true);
              setTimeout(() => setAdded(false), 1200); // 1.2s then back
            }}
            className={[
              "flex-1 h-10 rounded-full text-white text-sm font-medium transition cursor-pointer",
              added
                ? "bg-gray-700 opacity-90"
                : "bg-slate-800 hover:bg-slate-900",
            ].join(" ")}
          >
            {added ? "Added" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
