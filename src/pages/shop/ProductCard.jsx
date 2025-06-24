import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../../components/Header";

const ProductCard = ({ product, user }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Чтобы не переходило на страницу товара

    try {
      const token = localStorage.getItem('token'); // Получаем токен из localStorage

      if (!token) {
        alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину.');
        return;
      }

      await axios.post(
        `http://127.0.0.1:8000/api/cart/add/${product.id}`,
        {},
        {
        
          headers: {
            Authorization: `Bearer ${token}`, // Передаем токен в заголовках
            Accept: 'application/json',
          },
        }
      );
      alert('Товар добавлен в корзину!');
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.message || 'неизвестная'));
    }
  };

  return (
    <> 
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="border p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
    >
      
      <img src={`http://127.0.0.1:8000/${product.image}`} alt={product.name} />

      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p>Год: {product.year}</p>
      <p className="text-blue-600 font-bold">{product.price}₽</p>

      {user && (
        <button
          onClick={handleAddToCart}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Положить в корзину
        </button>
      )}
    </div></>
  );
};

export default ProductCard;
