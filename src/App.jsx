import WishlistPage from "./pages/wishlist";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Category from "./pages/category";
import CategoryProductsPage from "./pages/productcategorypage";
import Cart from "./pages/cart";
import Faqs from "./pages/faqs";
import { Brand } from "./pages/Brand";
import ProductDetails from "./pages/ProductDetail";
import Footer from "./components/Footer";
import ContactUs from "./pages/contact";
import CreateProduct from "./pages/CreateProduct";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:slug" element={<CategoryProductsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
