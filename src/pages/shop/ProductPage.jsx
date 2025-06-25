import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from "../../components/Header";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p className="text-center mt-5">Загрузка...</p>;

  const handleAddToCart = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину.');
        return;
      }

      await axios.post(
        `http://127.0.0.1:8000/api/cart/add/${product.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <img
              src={`http://127.0.0.1:8000/storage/${product.image}`}
              alt={product.name}
              className="img-fluid rounded shadow-sm mb-4"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
            <h1 className="h3 mb-3">{product.name}</h1>
            <p><strong>Год:</strong> {product.year}</p>
            <p><strong>Цена:</strong> <span className="text-primary fw-bold">{product.price}₽</span></p>
            <p><strong>Страна-производитель:</strong> {product.manufacturer_country}</p>
            <p><strong>Модель:</strong> {product.model}</p>

            <button
              onClick={handleAddToCart}
              className="btn btn-success mt-4"
            >
              Положить в корзину
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
