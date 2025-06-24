import React from "react";
import { Link, useNavigate } from "react-router-dom";



function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
      <header className="bg-white shadow-sm py-3">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <h2 className="h4 m-0 fw-bold">
              <Link to="/" className="text-decoration-none text-dark">
                Music Store
              </Link>
            </h2>
    
            <nav className="d-flex flex-wrap justify-content-center justify-content-md-end align-items-center gap-3">
              <Link to="/" className="text-decoration-none text-dark">
                Каталог
              </Link>
              <Link to="/about" className="text-decoration-none text-dark">
                О нас
              </Link>
              <Link to="/contacts" className="text-decoration-none text-dark">
                Где нас найти?
              </Link>
              <Link to="/cart" className="text-decoration-none text-dark">
                Корзина
              </Link>
    
              {token ? (
                <>
                  <Link to="/profile" className="text-decoration-none text-dark">
                    Профиль
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="text-decoration-none text-dark">
                    Регистрация
                  </Link>
                  <Link to="/login" className="text-decoration-none text-dark">
                    Вход
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    );
    
}

export default Header;
