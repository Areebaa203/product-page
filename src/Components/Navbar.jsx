import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import profileimg from "../assets/pfp.png";
import {
  faBell,
  faBagShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import { selectCartCount } from "../redux/cartSlice";
import { selectWishlistCount } from "../redux/wishlistSlice";
import { selectNotificationsCount } from "../redux/notificationsSlice";

const Navbar = () => {
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const notifCount = useSelector(selectNotificationsCount);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* LEFT: Brand */}
        <a
          href="/"
          className="text-xl font-extrabold italic tracking-tight text-[0D3356] font-inter"
        >
          Fashion<span className="text-[0D3356]">Hub</span>
        </a>

        {/* MIDDLE: Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm text-slate-600">
          <a href="/" className="hover:text-slate-900">
            Category
          </a>
          <a href="/" className="hover:text-slate-900">
            Brand
          </a>
          <a href="/" className="hover:text-slate-900">
            Contact
          </a>
          <a href="/" className="hover:text-slate-900">
            FAQ&apos;s
          </a>
        </nav>

        {/* RIGHT: Actions + Profile */}
        <div className="flex items-center gap-4">
          {/* ✅ Wishlist (added, same button style) */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            aria-label="Wishlist"
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

          {/* Cart (only badge changed to redux) */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            aria-label="Cart"
          >
            <span className="text-lg">
              <FontAwesomeIcon icon={faBagShopping} />
            </span>

            {/* ✅ CHANGED: 8 -> cartCount */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications (only dot changed to redux badge) */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            aria-label="Notifications"
          >
            <span className="text-lg">
              <FontAwesomeIcon icon={faBell} />
            </span>

            {/* ✅ CHANGED: red dot -> notifCount */}
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {notifCount}
              </span>
            )}
          </button>

          {/* Profile (UNCHANGED) */}
          <div className="flex items-center gap-3">
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
    </header>
  );
};

export default Navbar;
