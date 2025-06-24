import React, { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!formData.login || !formData.password) {
      setMessage("Пожалуйста, введите логин и пароль.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Вы успешно вошли!");
        navigate("/");
      } else if (response.status === 422) {
        setErrors(data.errors || {});
      } else if (response.status === 401) {
        setMessage(data.message || "Неверный логин или пароль.");
      } else {
        setMessage("Ошибка входа. Попробуйте позже.");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Ошибка подключения к серверу.");
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="responsive-wrapper">
          <h1>Вход в систему</h1>
          <form className="login-form card" onSubmit={handleSubmit}>
            <label>
              Логин
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
              />
              {errors.login && <p className="error">{errors.login[0]}</p>}
            </label>

            <label>
              Пароль
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password[0]}</p>}
            </label>

            <button className="base-button" type="submit">
              Войти
            </button>
          </form>

          {message && <p className="info">{message}</p>}
        </div>
      </main>
    </>
  );
}

export default Login;
