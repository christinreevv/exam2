import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Header from "../../components/Header";

const CatalogPage = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('');
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
    }
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories')
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Ошибка загрузки категорий:", err));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [sortBy, category]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products', {
        params: { sortBy, category },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товаров', error);
    }
  };

  return (
    <div className="container py-5">
  <Header />
  <h1 className="mb-4 h3">Каталог</h1>

  <div className="row mb-4">
    <div className="col-md-6 mb-2">
      <select
        onChange={(e) => setSortBy(e.target.value)}
        className="form-select"
      >
        <option value="newest">Сначала новые</option>
        <option value="year">По году выпуска</option>
        <option value="name">По названию</option>
        <option value="price_asc">По цене: сначала дешевые</option>
        <option value="price_desc">По цене: сначала дорогие</option>
      </select>
    </div>
    <div className="col-md-6 mb-2">
      <select
        onChange={(e) => setCategory(e.target.value)}
        className="form-select"
      >
        <option value="">Все категории</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="row g-4">
    {products.map((product) => (
      <div className="col-sm-6 col-md-4" key={product.id}>
        <ProductCard product={product} user={user} />
      </div>
    ))}
  </div>
</div>

  );
};

export default CatalogPage;
