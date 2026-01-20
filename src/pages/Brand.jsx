import { Link } from "react-router-dom";
import logo from "../assets/fashionhub-logo.png";

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src={logo}
        alt="FashionHub"
        className="h-10 w-10 rounded-xl object-contain bg-white border border-slate-100"
      />

      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">FashionHub</div>
        <div className="text-xs text-slate-500">Shop • Style • Save</div>
      </div>
    </Link>
  );
}
