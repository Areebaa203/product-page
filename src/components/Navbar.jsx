// Navbar.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profileimg from "../assets/pfp.png";
import { faBagShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { selectCartCount } from "../redux/cartSlice";
import { selectWishlistCount } from "../redux/wishlistSlice";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleWishlist = () => navigate("/wishlist");
  const handleCart = () => navigate("/cart");

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 sm:px-10 md:px-12">
        {/* ================= MOBILE LEFT: CART (only mobile) ================= */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            aria-label="Cart"
            onClick={handleCart}
          >
            <span className="text-lg">
              <FontAwesomeIcon icon={faBagShopping} />
            </span>

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* ================= LEFT: BRAND + LINKS (grouped) ================= */}
        <div className="flex items-center gap-10 lg:gap-15">
          <Link
            to="/"
            className="text-2xl font-extrabold italic tracking-tighter text-[#0D3356] font-inter"
          >
            FashionHub
          </Link>

          {/* DESKTOP MIDDLE: LINKS */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-[15px] font-medium text-[#1D364D]">
            <Link
              to="/category"
              className="hover:text-slate-900 transition-colors"
            >
              Category
            </Link>
            <Link
              to="/brand"
              className="hover:text-slate-900 transition-colors"
            >
              Brand
            </Link>
            <Link
              to="/contact"
              className="hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
            <Link to="/faqs" className="hover:text-slate-900 transition-colors">
              FAQ&apos;s
            </Link>
          </nav>
        </div>

        {/* ================= DESKTOP RIGHT: ACTIONS + PROFILE ================= */}
        <div className="hidden md:flex items-center gap-1">
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1EE] hover:opacity-80 transition-all"
              aria-label="Cart"
              onClick={handleCart}
            >
              <span className="text-lg text-[#7C5A41]">
                <FontAwesomeIcon icon={faBagShopping} />
              </span>

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1D364D] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Wishlist/Notification (Now showing as heart but user mentioned wishlist) */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEFF8] hover:opacity-80 transition-all"
              aria-label="Wishlist"
              onClick={handleWishlist}
            >
              <span className="text-lg text-[#3A4980]">
                <FontAwesomeIcon icon={faHeart} />
              </span>

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FB7272] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 ml-1">
            <img
              src={profileimg}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col -space-y-0.5">
              <span className="text-[11px] font-medium text-[#C0C3C6]">
                Good Morning!
              </span>
              <span className="text-sm font-bold text-[#1D364D]">
                Scarlet Johnson
              </span>
            </div>
          </div>
        </div>

        {/* ================= MOBILE RIGHT: HAMBURGER (only mobile) ================= */}
        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5 text-slate-800" />
        </button>
      </div>

      {/* ================= MOBILE MENU DRAWER ================= */}
      {mobileOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            aria-label="Close menu backdrop"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div className="text-lg font-bold text-slate-900">Menu</div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5 text-slate-800" />
              </button>
            </div>

            <div className="px-4 py-4 space-y-2">
              {/* Links */}
              <MobileLink to="/category" onClick={() => setMobileOpen(false)}>
                Category
              </MobileLink>
              <MobileLink to="/brand" onClick={() => setMobileOpen(false)}>
                Brand
              </MobileLink>
              <MobileLink to="/contact" onClick={() => setMobileOpen(false)}>
                Contact
              </MobileLink>
              <MobileLink to="/faqs" onClick={() => setMobileOpen(false)}>
                FAQ&apos;s
              </MobileLink>

              <div className="my-4 h-px bg-slate-100" />

              {/* Wishlist inside menu */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleWishlist();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faHeart} />
                  Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Profile inside menu */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
                <img
                  src={profileimg}
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <div className="leading-tight">
                  <p className="text-[11px] text-slate-400">Good Morning!</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Scarlet Johnson
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

/* ----------------- small component ----------------- */
function MobileLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
    >
      {children}
    </Link>
  );
}
