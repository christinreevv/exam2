import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/auth/Profile";
import CatalogPage from "./pages/shop/CatalogPage";
import ProductPage from "./pages/shop/ProductPage";
import CartPage from "./pages/cart/CartPage";
import About from "./pages/auth/About"; // ✅ "О нас"
import ContactPage from "./pages/auth/AboutLocation"; // ✅ "Где нас найти?" — новый импорт

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<ContactPage />} /> {/* ✅ Добавлен маршрут "Где нас найти?" */}
      </Routes>
    </Router>
  );
}

export default App;
