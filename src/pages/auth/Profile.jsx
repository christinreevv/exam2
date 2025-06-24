import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  const [orderFilter, setOrderFilter] = useState("Все");
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: "", price: 0 });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    model: "",
    year: "",
    manufacturer_country: "",
    price: "",
    quantity: "",
    image: null,
    category_id: "",
  });


  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);




  const fetchProducts = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/products", {
      headers: {
        Authorization: `Bearer ${token}`,  // берём из состояния
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      setProducts(data.products || []);
    } else {
      setProducts([]);
    }
  };


  const deleteProduct = async (id) => {
    if (!window.confirm("Удалить товар?")) return;

    await fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    fetchProducts();
  };

  const toggleProductStatus = async (id, currentStatus) => {
    await fetch(`http://127.0.0.1:8000/api/admin/products/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !currentStatus }),
    });

    fetchProducts();
  };

  const startEditProduct = (product) => {
    setEditProductId(product.id);
    setEditedProduct({ name: product.name, price: product.price });
  };

  const saveEditProduct = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedProduct),
    });

    setEditProductId(null);
    fetchProducts();
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Вы не авторизованы");
      return;
    }

    fetch("http://127.0.0.1:8000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          setMessage("Сессия истекла. Пожалуйста, войдите снова.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        const data = await res.json();

        if (data.user) {
          setUser(data.user);

          // Грузим всё параллельно и ждем
          const promises = [fetchOrders(token)];

          if (data.user.role === 1) {
            promises.push(fetchCategories(token));
            promises.push(fetchProducts(token));
          }

          await Promise.all(promises);
        } else {
          setMessage("Не удалось загрузить профиль");
        }
      })
      .catch(() => {
        setMessage("Ошибка при получении данных профиля");
      })
      .finally(() => {
        setLoading(false); // Завершили загрузку
      });
  }, [navigate]);



  const fetchOrders = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );

      setOrders(data);
    } else {
      setOrders([]);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Удалить заказ?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Ошибка удаления: ${errorData.message || response.statusText}`);
        return;
      }

      await fetchOrders(token);
    } catch (error) {
      alert("Ошибка сети при удалении заказа");
    }
  };


  const confirmOrder = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/orders/${id}/confirm`, { // изменил путь на plural 'orders', часто так делают
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Ошибка подтверждения: ${errorData.message || response.statusText}`);
        return;
      }

      await fetchOrders(token);
    } catch (error) {
      alert("Ошибка сети при подтверждении заказа");
    }
  };

  const cancelOrder = async (id) => {
    const reason = prompt("Укажите причину отмены:");
    if (!reason) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/orders/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ cancel_reason: reason }), // <-- ключевой момент
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Ошибка отмены: ${errorData.message || response.statusText}`);
        return;
      }

      await fetchOrders(token);
    } catch (error) {
      alert("Ошибка сети при отмене заказа");
    }
  };


  const fetchCategories = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      setCategories(data.categories);
    } else {
      setCategories([]);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Ошибка добавления категории: ${error.message || "Неизвестная ошибка"}`);
        return;
      }

      const createdCategory = await response.json(); // допустим, API возвращает объект категории
      setCategories((prev) => [...prev, createdCategory]); // добавляем в конец списка

      setNewCategory(""); // очищаем инпут
    } catch (error) {
      alert("Сетевая ошибка при добавлении категории");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Удалить категорию?")) return;

    await fetch(`http://127.0.0.1:8000/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    fetchCategories(token);
  };

  const createProduct = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      const createdProduct = await res.json();

      // Добавляем новый товар в конец массива продуктов
      setProducts((prevProducts) => [...prevProducts, createdProduct]);

      setNewProduct({
        name: "",
        price: "",
        model: "",
        year: "",
        manufacturer_country: "",
        quantity: "",
        category_id: "",
      });
    } else {
      const errorText = await res.text();
      alert("Ошибка при добавлении: " + errorText);
    }
  };



  return (
    <>
      <Header />
      <main className="py-4">
        <div className="container">
          <h1 className="mb-4">Профиль</h1>

          {loading ? (
  <p>Загрузка данных...</p>
) : (
  <>
    {user ? (
      <div className="card mb-4 p-3">
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Фамилия:</strong> {user.surname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Роль:</strong> {user.role === 1 ? "Администратор" : "Пользователь"}</p>
      </div>
    ) : (
      <p>{message}</p>
    )}

    {user && user.role !== 1 && (
      <>
        <h2 className="mb-3">Мои заказы</h2>
        {orders.length === 0 ? (
          <p>Заказов пока нет</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card mb-4 p-3">
              <p>
                <strong>Заказ #{order.id}</strong> — Статус: {order.status} —{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              {order.items?.length > 0 ? (
                <ul className="mb-2">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product?.name || "Неизвестный товар"} — {item.quantity} шт.
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Нет товаров в заказе</p>
              )}
              {order.status === "Новый" && (
                <button className="btn btn-outline-danger btn-sm w-100 w-md-auto" onClick={() => deleteOrder(order.id)}>
                  Удалить
                </button>
              )}
            </div>
          ))
        )}
      </>
    )}

    {user?.role === 1 && (
      <>
        <div className="mb-5">
          <h2>Управление заказами</h2>
          <div className="mb-3">
            <label className="form-label">
              Фильтр по статусу:{" "}
              <select
                className="form-select d-inline-block w-100 w-md-auto mt-2 mt-md-0"
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option value="Все">Все</option>
                <option value="Новый">Новый</option>
                <option value="В обработке">В обработке</option>
                <option value="Отменён">Отменён</option>
              </select>
            </label>
          </div>

          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Пользователь</th>
                    <th>Товары</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((o) => orderFilter === "Все" || o.status === orderFilter)
                    .map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user?.name || "Неизвестно"}</td>
                        <td>{order.items?.length || 0}</td>
                        <td>{order.status}</td>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                        <td>
                          {order.status === "Новый" && (
                            <div className="d-flex flex-column flex-md-row gap-1">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => confirmOrder(order.id)}
                              >
                                ✔
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => cancelOrder(order.id)}
                              >
                                ✖
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Нет заказов</p>
          )}
        </div>

                  {/* КАТЕГОРИИ */}
                  <div className="mb-5">
                    <h2>Управление категориями</h2>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Новая категория"
                        className="form-control"
                      />
                      <button className="btn btn-primary" onClick={handleAddCategory}>
                        Добавить
                      </button>
                    </div>

                    {categories.length > 0 ? (
                      <ul className="list-group">
                        {categories.map((cat) => (
                          <li key={cat.id} className="list-group-item d-flex justify-content-between">
                            {cat.name}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              Удалить
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Нет категорий</p>
                    )}
                  </div>

                  {/* ТОВАРЫ */}
                  <div className="mb-5">
                    <h2>Управление товарами</h2>

                    <div className="card p-3 mb-4">
                      <h5 className="mb-3">Добавить товар</h5>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Название"
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Модель"
                            value={newProduct.model}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, model: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Год"
                            value={newProduct.year}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, year: e.target.valueAsNumber })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Цена"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, price: e.target.valueAsNumber })
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Количество"
                            value={newProduct.quantity}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, quantity: e.target.valueAsNumber })
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <select
                            className="form-select"
                            value={newProduct.category_id}
                            onChange={(e) =>
                              setNewProduct({ ...newProduct, category_id: parseInt(e.target.value) })
                            }
                          >
                            <option value="">Выберите категорию</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Страна производитель"
                            value={newProduct.manufacturer_country}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                manufacturer_country: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>


                      <button className="btn btn-success mt-3" onClick={createProduct}>
                        Добавить товар
                      </button>
                    </div>

                    {products.length === 0 ? (
                      <p>Нет товаров</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Название</th>
                              <th>Цена</th>
                              <th>Количество</th>
                              <th>Действия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>
                                  {editProductId === product.id ? (
                                    <input
                                      className="form-control"
                                      value={editedProduct.name}
                                      onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, name: e.target.value })
                                      }
                                    />
                                  ) : (
                                    product.name
                                  )}
                                </td>
                                <td>
                                  {editProductId === product.id ? (
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editedProduct.price}
                                      onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, price: e.target.value })
                                      }
                                    />
                                  ) : (
                                    `${product.price}₽`
                                  )}
                                </td>
                                <td>
                                  {editProductId === product.id ? (
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={editedProduct.quantity}
                                      onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, quantity: e.target.value })
                                      }
                                    />
                                  ) : (
                                    product.quantity
                                  )}
                                </td>
                                <td>
                                  {editProductId === product.id ? (
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => saveEditProduct(product.id)}
                                    >
                                      Сохранить
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-warning me-1"
                                      onClick={() => startEditProduct(product)}
                                    >
                                      Редактировать
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => deleteProduct(product.id)}
                                  >
                                    Удалить
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

    </>
  );
}

export default Profile;
