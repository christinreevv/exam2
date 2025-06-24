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

  if (!product) return <p>Загрузка...</p>;

  return (
    <div className="p-6">
      <img
        src={`http://127.0.0.1:8000/storage/${product.image}`}
        alt={product.name}
        className="w-full max-w-md h-auto"
      />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p>Год: {product.year}</p>
      <p>Цена: {product.price}₽</p>
      <p>Цена: {product.manufacturer_country}₽</p>
      <p>Цена: {product.model}₽</p>
    </div>
  );
};

export default ProductPage;
