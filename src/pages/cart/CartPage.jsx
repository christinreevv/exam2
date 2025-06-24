import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../../components/Header";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [orderError, setOrderError] = useState('');
  

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/cart', axiosConfig);
      setCartItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки корзины');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, action) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/cart/item/${itemId}`,
        { action },
        axiosConfig
      );
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка обновления');
    }
  };

  const handleOrder = async () => {
    setOrderMessage('');
    setOrderError('');

    if (!password) {
      setOrderError('Пожалуйста, введите пароль для подтверждения заказа');
      return;
    }

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/order',
        { password },
        axiosConfig
      );
      setOrderMessage(res.data.message || 'Заказ успешно оформлен!');
      setPassword('');
      fetchCart();
    } catch (err) {
      const message = err.response?.data?.message || 'Ошибка оформления заказа';
      setOrderError(message);
    }
  };

  if (loading) return <div>Загрузка корзины...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container my-5">
    <Header />
    <h1 className="mb-4 h3">🛒 Корзина</h1>
  
    {cartItems.length === 0 ? (
      <div className="alert alert-info">Корзина пуста</div>
    ) : (
      <>
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Товар</th>
                <th>Цена</th>
                <th>Кол-во</th>
                <th>Сумма</th>
                <th className="text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.product.price} ₽</td>
                  <td>{item.quantity}</td>
                  <td>{item.quantity * item.product.price} ₽</td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => updateQuantity(item.id, "increase")}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => updateQuantity(item.id, "decrease")}
                      >
                        −
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Итого: {total} ₽</h4>
        </div>
  
        <div className="input-group mb-3 w-50">
          <input
            type="password"
            className="form-control"
            placeholder="Введите пароль для подтверждения"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleOrder}
            className="btn btn-primary"
            type="button"
          >
            Сформировать заказ
          </button>
        </div>
  
        {orderMessage && (
          <div className="alert alert-success">{orderMessage}</div>
        )}
        {orderError && (
          <div className="alert alert-danger">{orderError}</div>
        )}
      </>
    )}
  </div>
  
  );
};

export default CartPage;
