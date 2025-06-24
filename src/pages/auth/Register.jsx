import React, { useState } from "react";
import Header from "../../components/Header";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    login: "",
    email: "",
    password: "",
    password_confirmation: "",
    rules: false,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (
      !formData.name ||
      !formData.surname ||
      !formData.login ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirmation ||
      !formData.rules
    ) {
      setMessage("Пожалуйста, заполните все обязательные поля и подтвердите согласие с правилами.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Регистрация прошла успешно!");
        setFormData({
          name: "",
          surname: "",
          patronymic: "",
          login: "",
          email: "",
          password: "",
          password_confirmation: "",
          rules: false,
        });
      } else if (response.status === 422) {
        setErrors(data.errors || {});
      } else {
        setMessage(data.message || "Ошибка регистрации.");
      }
    } catch (error) {
      setMessage("Ошибка подключения к серверу.");
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="responsive-wrapper">
          <h1>Регистрация клиента</h1>
          <form className="registration card" onSubmit={handleSubmit}>
            <label>
              Имя *
              <input name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="error">{errors.name[0]}</p>}
            </label>

            <label>
              Фамилия *
              <input name="surname" value={formData.surname} onChange={handleChange} />
              {errors.surname && <p className="error">{errors.surname[0]}</p>}
            </label>

            <label>
              Отчество (необязательно)
              <input name="patronymic" value={formData.patronymic} onChange={handleChange} />
              {errors.patronymic && <p className="error">{errors.patronymic[0]}</p>}
            </label>

            <label>
              Логин *
              <input name="login" value={formData.login} onChange={handleChange} />
              {errors.login && <p className="error">{errors.login[0]}</p>}
            </label>

            <label>
              Email *
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="error">{errors.email[0]}</p>}
            </label>

            <label>
              Пароль *
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
              {errors.password && <p className="error">{errors.password[0]}</p>}
            </label>

            <label>
              Подтвердите пароль *
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && <p className="error">{errors.password_confirmation[0]}</p>}
            </label>

            <label className="checkbox">
              <input type="checkbox" name="rules" checked={formData.rules} onChange={handleChange} />
              Я согласен с правилами регистрации *
              {errors.rules && <p className="error">{errors.rules[0]}</p>}
            </label>

            <button className="base-button" type="submit">
              Зарегистрироваться
            </button>
          </form>

          {message && <p className="info">{message}</p>}
        </div>
      </main>
    </>
  );
}

export default Register;
