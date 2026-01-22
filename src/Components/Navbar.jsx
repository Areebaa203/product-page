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

        {/* ================= LEFT: BRAND (always) ================= */}
        <Link
          to="/"
          className="text-xl font-extrabold italic tracking-tight text-[#0D3356] font-inter"
        >
          FashionHub
        </Link>

        {/* ================= DESKTOP MIDDLE: LINKS (unchanged) ================= */}
        <nav className="hidden md:flex items-center gap-10 text-[16px] text-[#1D364D]">
          <Link to="/category" className="hover:text-slate-900">
            Category
          </Link>
          <Link to="/brand" className="hover:text-slate-900">
            Brand
          </Link>
          <Link to="/contact" className="hover:text-slate-900">
            Contact
          </Link>
          <Link to="/faqs" className="hover:text-slate-900">
            FAQ&apos;s
          </Link>
        </nav>

        {/* ================= DESKTOP RIGHT: ACTIONS + PROFILE (unchanged) ================= */}
        <div className="hidden md:flex items-center gap-4">
          {/* Wishlist */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            aria-label="Wishlist"
            onClick={handleWishlist}
          >
            <span className="text-lg">
              <FontAwesomeIcon icon={faHeart} />
            </span>

            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
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

          {/* Profile */}
          <div className="flex items-center gap-3">
            <img
              src={profileimg}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div className="leading-tight">
              <p className="text-[11px] text-[#C0C3C6]">Good Morning!</p>
              <p className="text-sm font-semibold text-[#1D364D]">
                Scarlet Johnson
              </p>
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
