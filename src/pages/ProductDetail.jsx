// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { toggleWishlist } from "../redux/wishlistSlice";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Truck,
  ChevronRight,
  Check,
  Share2,
  Bookmark,
  Heart,
  ChevronLeft,
  MessageSquareMore,
  Pencil,
  Trash2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice"; // adjust path if needed
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetail() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((i) => i.id)),
    [wishlistItems],
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(5);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // gallery
  const [activeImg, setActiveImg] = useState("");
  const [thumbIndex, setThumbIndex] = useState(0);

  // UI selections (static like screenshot)
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Small");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // --- Review Form (exact like screenshot) ---
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");

  const StarRow = ({ value = 0, onChange, size = "text-sm" }) => {
    return (
      <div className={`flex items-center gap-0.5 ${size} text-[#E59819]`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          const filled = star <= Math.round(value);
          return (
            <button
              key={star}
              type="button"
              onClick={onChange ? () => onChange(star) : undefined}
              className={[
                "leading-none",
                onChange
                  ? "cursor-pointer hover:scale-[1.03] transition"
                  : "cursor-default",
              ].join(" ")}
              aria-label={`Rate ${star} stars`}
              disabled={!onChange}
            >
              {filled ? "★" : "☆"}
            </button>
          );
        })}
      </div>
    );
  };

  const handleSubmitReview = () => {
    // UI-only submit (DummyJSON reviews aren't writable from here)
    if (!newReviewRating) return alert("Please select a rating.");
    if (!newReviewTitle.trim()) return alert("Please enter a review title.");
    if (!newReviewComment.trim())
      return alert("Please enter your review content.");

    alert(
      `Review submitted!\n\nRating: ${newReviewRating}\nTitle: ${newReviewTitle}\nComment: ${newReviewComment}`,
    );

    setNewReviewRating(0);
    setNewReviewTitle("");
    setNewReviewComment("");
  };

  const handleEdit = () => {
    navigate("/create-product", { state: { product } });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // 1. Update Local Storage
      const localProducts = JSON.parse(
        localStorage.getItem("userProducts") || "[]",
      );
      const updatedLocal = localProducts.filter(
        (p) => String(p.id) !== String(product.id),
      );
      localStorage.setItem("userProducts", JSON.stringify(updatedLocal));

      // 2. Redirect back
      alert(`Product "${product.title}" deleted successfully.`);
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Something went wrong while deleting.");
    }
  };

  useEffect(() => {
    setQty(5);
    setSelectedColor(0);
    setSelectedSize("Small");
    setNewReviewRating(0);
    setNewReviewTitle("");
    setNewReviewComment("");
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) Check Local Storage first (for user-created products)
        const localProducts = JSON.parse(
          localStorage.getItem("userProducts") || "[]",
        );
        const localProduct = localProducts.find((p) => String(p.id) === id);

        if (localProduct) {
          setProduct(localProduct);
          const first =
            localProduct.thumbnail || localProduct.images?.[0] || "";
          setActiveImg(first);
          setThumbIndex(0);
          return;
        }

        // 2) If not local, fetch from API
        const res = await axios.get(`https://dummyjson.com/products/${id}`);
        setProduct(res.data);

        const first = res.data?.thumbnail || res.data?.images?.[0] || "";
        setActiveImg(first);
        setThumbIndex(0);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // -------------------- Similar Products --------------------
  useEffect(() => {
    if (!product?.category) return;

    (async () => {
      try {
        setLoadingSimilar(true);
        const res = await axios.get(
          `https://dummyjson.com/products/category/${product.category}`,
          { params: { limit: 12 } },
        );
        // exclude current product
        const filtered = (res.data.products || []).filter(
          (p) => String(p.id) !== id,
        );
        setSimilarProducts(filtered);
      } catch (err) {
        console.error("Similar products error:", err);
      } finally {
        setLoadingSimilar(false);
      }
    })();
  }, [product?.category, id]);

  // -------------------- Reviews (API) --------------------
  const reviews = useMemo(
    () => (Array.isArray(product?.reviews) ? product.reviews : []),
    [product],
  );
  const totalReviews = reviews.length;

  // counts for 1..5 stars
  const counts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const r of reviews) {
      const rating = Number(r?.rating);
      if (!Number.isFinite(rating)) continue;

      const bucket = Math.max(1, Math.min(5, Math.round(rating)));
      c[bucket] += 1;
    }

    return c;
  }, [reviews]);

  const percentFor = (star) =>
    totalReviews ? Math.round((counts[star] / totalReviews) * 100) : 0;

  // avg rating from reviews
  const avgRating = useMemo(() => {
    if (!totalReviews) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r?.rating || 0), 0);
    return sum / totalReviews;
  }, [reviews, totalReviews]);

  // one rating used everywhere
  const displayRating = useMemo(() => {
    // User requested "dynamically from the api"
    // Prefer the explicit rating field from API as it's the source of truth
    const apiRating = Number(product?.rating);
    if (Number.isFinite(apiRating)) return apiRating;

    if (totalReviews) return avgRating;
    return 0;
  }, [avgRating, totalReviews, product]);

  // -------------------- Skeleton --------------------
  if (loading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="mt-6 text-slate-600">Product not found.</p>
      </div>
    );
  }

  // -------------------- Gallery --------------------
  const images = Array.isArray(product.images) ? product.images : [];
  const thumbs = images.length ? images : [product.thumbnail].filter(Boolean);

  const visibleThumbs = thumbs.slice(thumbIndex, thumbIndex + 4);
  const canPrev = thumbIndex > 0;
  const canNext = thumbIndex + 4 < thumbs.length;

  // -------------------- Static UI (like screenshot) --------------------
  const colorOptions = ["#ECDECC", "#BBD278", "#BBC1F8", "#FFD3F8", "#E9B6A6"];

  const sizeOptions = ["Small", "Medium", "Large", "Extra Large", "XXL"];

  const likeCount = 109;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-12 py-10">
      {/* Top row */}
      <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-start">
        {/* LEFT: Image + thumbs */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
            <img
              src={activeImg || product.thumbnail}
              alt={product.title}
              className="h-[300px] sm:h-[450px] lg:h-[600px] w-full object-contain"
            />
          </div>

          {/* thumbs row + arrows */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setThumbIndex((v) => Math.max(0, v - 1))}
              disabled={!canPrev}
              className={[
                "grid h-8 w-8 place-items-center text-slate-400 hover:text-slate-600 transition disabled:opacity-30",
              ].join(" ")}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-4">
              {visibleThumbs.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImg(img)}
                  className={[
                    "h-20 w-20 rounded-xl overflow-hidden border-2 transition-all",
                    img === activeImg
                      ? "border-[#3A4980]"
                      : "border-[#E4E4E4] hover:border-slate-300 bg-white",
                  ].join(" ")}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setThumbIndex((v) => Math.min(thumbs.length - 4, v + 1))
              }
              disabled={!canNext}
              className={[
                "grid h-8 w-8 place-items-center text-slate-400 hover:text-slate-600 transition disabled:opacity-30",
              ].join(" ")}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-0">
          {/* Breadcrumbs */}
          <div className="mb-4 w-fit rounded-lg bg-[#EDF0F8] px-3 py-1.5">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="text-[11px] font-medium text-[#A3A9C2] transition-colors">
                  <BreadcrumbLink
                    asChild
                    className="text-[#A3A9C2] hover:text-[#3A4980]"
                  >
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="text-[#A3A9C2]/50" />

                <BreadcrumbItem className="text-[11px] font-medium text-[#A3A9C2] hover:text-[#3A4980] transition-colors">
                  <BreadcrumbLink
                    asChild
                    className="text-[#A3A9C2] hover:text-[#3A4980]"
                  >
                    <Link to={`/category/${product.category}`}>
                      {product.category}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="text-[#A3A9C2]" />

                <BreadcrumbItem className="text-[11px] font-bold text-[#3A4980]">
                  <BreadcrumbPage className="cursor-default text-[#3A4980] max-w-[120px] sm:max-w-none truncate">
                    {product.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Title + icons */}
          <div className="flex items-start justify-between gap-4 mt-1">
            <div>
              <h4 className="text-[28px] font-semibold text-[#000000]">
                {product.title}
              </h4>
              <p className="text-[16px] text-[#B9BBBF]">{product.brand}</p>
            </div>

            <div className="flex items-center gap-2">
              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <Heart className="h-4 w-4" />
              </button>

              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <Bookmark className="h-4 w-4" />
              </button>

              <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <Share2 className="h-4 w-4" />
              </button>

              <button
                onClick={handleEdit}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-blue-600"
                title="Edit Product"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={handleDelete}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-red-400 hover:bg-red-50 hover:text-red-600"
                title="Delete Product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="my-4 h-px bg-[#E4E4E4]"></div>
          {/* Price + badges row */}
          <div className="mt-3 flex w-full flex-wrap items-center gap-4 sm:gap-8">
            {/* Left: Price Stack */}
            <div className="flex flex-col leading-none">
              <div className="text-[34px] font-bold text-[#3A4980]">
                ${Number(product.price).toFixed(2)}
              </div>
              <div className="mt-2 text-[21px] text-black/50 line-through font-normal">
                ${Number(product.compare_at_price ?? product.price).toFixed(2)}
              </div>
            </div>

            {/* Right: Rating Stack */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F9FAFB] px-3 py-2 text-sm font-bold text-[#E59819] border border-slate-200 hover:bg-slate-50 transition"
                >
                  ★ {Number(displayRating || 0).toFixed(1)}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    document
                      .getElementById("reviews-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EDF0F8] px-3 py-2 text-sm font-semibold text-[#3A4980] border border-slate-200 hover:bg-blue-100 transition"
                >
                  <MessageSquareMore className="h-4 w-4" />
                  {totalReviews || 67} Reviews
                </button>
              </div>

              <div className="text-[14px]">
                <span className="text-[#3E9242]">93%</span>{" "}
                <span className="text-[#B9BBBF]">
                  of buyers have recommended this.
                </span>
              </div>
            </div>
          </div>

          <div className="my-4 h-px bg-[#E4E4E4]" />

          {/* Choose color */}
          <div>
            <div className="text-[16px] text-[#B9BBBF] mb-3 font-medium">
              Choose a Color
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {colorOptions.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(i)}
                  className={[
                    "grid h-12 w-12 place-items-center rounded-full border transition",
                    selectedColor === i
                      ? "border-slate-200 ring-2 ring-slate-200 ring-offset-2"
                      : "border-transparent hover:border-slate-200",
                  ].join(" ")}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${i + 1}`}
                >
                  {selectedColor === i && (
                    <Check className="h-4 w-4 text-[#3b4a74]" />
                  )}
                </button>
              ))}
            </div>
            <div className="my-4 h-px bg-[#E4E4E4]" />
          </div>

          {/* Choose size */}
          <div>
            <div className="text-[16px] text-[#B9BBBF] mb-3 font-medium">
              Choose a Size
            </div>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={[
                      "inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                      active
                        ? "bg-[#EDF0F8] text-[#7e7777] border-transparent"
                        : "bg-[#F3F3F3] text-[#726C6C] hover:bg-slate-200 border-transparent",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "grid h-3.5 w-3.5 place-items-center rounded-full border",
                        active ? "border-[#3A4980]" : "border-slate-400",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3A4980]" />
                      )}
                    </span>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5 h-px bg-[#E4E4E4]" />

          {/* Qty + Add to cart row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full bg-slate-100 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-white hover:text-slate-900"
              >
                -
              </button>

              <div className="w-10 text-center text-sm font-bold text-slate-900">
                {qty}
              </div>

              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-white hover:text-slate-900"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                for (let i = 0; i < qty; i++) dispatch(addToCart(product));

                alert(
                  `Added to cart:\n${product.title}\nQty: ${qty}\nTotal: $${(
                    Number(product.price) * qty
                  ).toFixed(2)}`,
                );
              }}
              className="h-11 w-full max-w-[320px] rounded-full bg-[#3A4980] text-[#ffffff] text-xs font-bold shadow-sm hover:bg-[#354570] inline-flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <FontAwesomeIcon icon={faBagShopping} className="text-sm" />
              Add To Cart
            </button>
          </div>

          {/* Delivery / Return */}
          <div className="mt-7 rounded-2xl border border-[#E4E4E4] overflow-hidden">
            <div className="flex items-start gap-4 p-3">
              <div className="mt-1">
                <Truck className="h-5 w-5 text-[#D75951]" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-[#1D364D]">
                  Free Delivery
                </div>
                <div className="mt-1 text-[13px] text-[#726C6C] hover:underline cursor-pointer">
                  Enter your Postal code for Delivery Availability
                </div>
              </div>
            </div>

            <div className="mx-5 h-px bg-[#E4E4E4]" />

            <div className="flex items-start gap-4 p-3">
              <div className="mt-1">
                <FontAwesomeIcon
                  icon={faBagShopping}
                  className="h-5 w-5 text-[#D75951]"
                />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold text-[#1D364D] cursor-pointer">
                  Return Delivery
                </div>
                <div className="mt-1 text-[13px] text-[#726C6C] cursor-pointer">
                  Free 30 days Delivery Return.{" "}
                  <button
                    type="button"
                    className="hover:underline"
                    onClick={() => alert("Return policy details")}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- TABS (FIX WIDTH + EXACT REVIEWS UI) -------------------- */}
      <div className="mt-20 w-full" id="reviews-section">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Gray line wrapper - ensures it spans the full horizontal space of the container */}
          <div className="relative w-full border-b-[2px] border-[#E4E4E4]">
            <TabsList className="justify-start rounded-none bg-transparent p-0 border-0 h-auto relative flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
              <TabsTrigger
                value="description"
                className="
                  relative rounded-none bg-transparent pb-4 pt-2 px-0 mr-12
                  text-[17px] font-medium text-[#B9BBBF]
                  hover:bg-transparent
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  transition-none
                  data-[state=active]:text-[#164C96]
                  data-[state=active]:font-bold
                  data-[state=active]:bg-transparent
                  data-[state=active]:shadow-none
                "
              >
                Description
              </TabsTrigger>

              <TabsTrigger
                value="reviews"
                className="
                  relative rounded-none bg-transparent pb-4 pt-2 px-0
                  text-[17px] font-medium text-[#B9BBBF]
                  hover:bg-transparent
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  transition-none
                  data-[state=active]:text-[#164C96]
                  data-[state=active]:font-bold
                  data-[state=active]:bg-transparent
                  data-[state=active]:shadow-none
                "
              >
                Reviews
              </TabsTrigger>

              {/* Precise sliding underline - widths and positions based on standard 17px font */}
              <div
                className="absolute bottom-[-2px] h-[3px] bg-[#164C96] transition-all duration-700 ease-in-out rounded-full"
                style={{
                  left:
                    activeTab === "description" ? "0px" : "calc(93px + 48px)",
                  width: activeTab === "description" ? "93px" : "65px",
                }}
              />
            </TabsList>
          </div>

          <div className="w-full">
            {/* Description */}
            <TabsContent value="description" className="pt-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Product Description
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {product.description}
                </p>

                <div className="mt-7">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Durable leather is easily cleanable so you can keep your look fresh.",
                      "Water-repellent finish and internal membrane help keep your feet dry.",
                      "Toe piece with star pattern adds durability.",
                      "Synthetic insulation helps keep you warm.",
                      "Originally designed for performance hoops, the Air unit delivers lightweight cushioning.",
                      "Plush tongue wraps over the ankle to help keep out the moisture and cold.",
                      "Rubber outsole with aggressive traction pattern adds durable grip.",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs text-slate-600"
                      >
                        <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#E7F4FC] text-[#164C96] shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Product Details
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Not intended for use as Personal Protective Equipment (PPE)",
                      "Water-repellent finish and internal membrane help keep your feet dry.",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs text-slate-600"
                      >
                        <span className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#E7F4FC] text-[#164C96] shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="pt-8">
              <div>
                <h3 className="text-[20px] font-bold text-[#1D364D] mb-6">
                  Customers Feedback
                </h3>

                <div className="mt-8 flex flex-col lg:flex-row gap-2 items-stretch">
                  {/* Left: Product Rating Score - Spanning till 'Feedback' title end on desktop (~240px) */}
                  <div className="w-full lg:w-[240px] flex flex-col items-center justify-center bg-[#F9FAFB] rounded-2xl p-8 border border-[#E4E4E4] min-h-[200px] lg:min-h-[224px]">
                    <div className="text-[60px] font-bold text-[#164C96] leading-none mb-3">
                      {Number(displayRating || 0).toFixed(1)}
                    </div>
                    <div className="mb-3">
                      <StarRow value={displayRating} size="text-2xl" />
                    </div>
                    <div className="text-[15px] font-semibold text-[#1D364D]">
                      Product Rating
                    </div>
                  </div>

                  {/* Right: Detailed Progress Bars - Spanning till '30 days' text on desktop (~520px more) */}
                  <div className="w-full lg:w-[520px] bg-[#F9FAFB] rounded-2xl p-7 border border-[#E4E4E4] flex flex-col justify-center space-y-4">
                    {[5, 4, 3, 2, 1].map((s) => (
                      <div
                        key={s}
                        className="grid grid-cols-[1fr_80px_45px] items-center gap-4"
                      >
                        <div className="h-[5px] bg-[#E4E4E4] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#20590C] rounded-full"
                            style={{ width: `${percentFor(s)}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-0.5 whitespace-nowrap justify-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-[12px] ${
                                i + 1 <= s ? "text-[#E59819]" : "text-slate-200"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className="text-right text-[14px] font-bold text-[#164C96]">
                          {percentFor(s)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews list */}
                <div className="mt-8">
                  <h4 className="text-xs font-semibold text-slate-900 mb-4">
                    Reviews
                  </h4>

                  <div className="space-y-6">
                    {(showAllReviews ? reviews : reviews.slice(0, 2)).map(
                      (r, i) => {
                        const name = r?.reviewerName || "Customer";
                        const initials = name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((p) => p[0].toUpperCase())
                          .join("");

                        const rating = Math.max(
                          1,
                          Math.min(5, Math.round(Number(r?.rating || 0))),
                        );

                        const dateText = r?.date
                          ? new Date(r.date).toLocaleDateString()
                          : "2 Days ago";

                        return (
                          <div
                            key={i}
                            className="border-b border-slate-100 pb-6"
                          >
                            <div className="flex gap-3">
                              <div className="h-9 w-9 rounded-full bg-[#164C96] text-white flex items-center justify-center text-[11px] font-bold">
                                {initials || "U"}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="text-xs font-semibold text-slate-900">
                                    {name}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {dateText}
                                  </div>
                                </div>

                                <div className="mt-1 flex items-center gap-2">
                                  <StarRow value={rating} size="text-[11px]" />
                                  <span className="text-[11px] font-medium text-slate-400">
                                    ({rating})
                                  </span>
                                </div>

                                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                  {r?.comment || ""}
                                </p>

                                <div className="mt-3 flex items-center gap-4 text-[11px]">
                                  <button
                                    className="text-slate-400 hover:text-slate-600"
                                    type="button"
                                  >
                                    Like
                                  </button>
                                  <button
                                    className="text-rose-500 hover:text-rose-600"
                                    type="button"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}

                    {reviews.length > 2 && (
                      <button
                        type="button"
                        className="block mx-auto text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews ? "Show Less" : "View All Reviews"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Write a Review */}
                <div className="mt-10">
                  <h4 className="text-xs font-semibold text-slate-900 mb-4">
                    Write a Review
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-700">
                        What is it like to Product?
                      </div>
                      <div className="mt-2">
                        <StarRow
                          value={newReviewRating}
                          onChange={setNewReviewRating}
                          size="text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">
                        Review Title
                      </label>
                      <input
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="Great Products"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#164C96]/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700">
                        Review Content
                      </label>
                      <textarea
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        rows={5}
                        placeholder="It is a long established fact that a reader will be distracted by the readable content..."
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#164C96]/20"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      className="mt-2 inline-flex items-center justify-center rounded-full bg-[#164C96] px-6 py-2.5 text-[11px] font-bold text-white hover:bg-[#123c75]"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* -------------------- SIMILAR ITEMS -------------------- */}
      {loadingSimilar && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-7 w-64" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {!loadingSimilar && similarProducts.length > 0 && (
        <div className="mt-20">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              Similar Items You Might Also Like
            </h2>
          </div>

          <div className="relative group">
            {/* Custom Navigation Buttons (Floating) */}
            <button className="custom-prev-btn absolute left-0 top-1/2 z-50 flex h-9 w-9 sm:h-10 sm:w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-800 shadow-2xl transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-20">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button className="custom-next-btn absolute right-0 top-1/2 z-50 flex h-9 w-9 sm:h-10 sm:w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-800 shadow-2xl transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-20">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".custom-next-btn",
                prevEl: ".custom-prev-btn",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="pb-4"
            >
              {similarProducts.map((p) => (
                <SwiperSlide key={p.id}>
                  <ProductCard
                    product={p}
                    wished={wishlistIds.has(p.id)}
                    onAddToCart={(prod) => dispatch(addToCart(prod))}
                    onToggleWishlist={(prod) => dispatch(toggleWishlist(prod))}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
