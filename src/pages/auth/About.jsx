import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Carousel from "react-bootstrap/Carousel";
import ProductCard from "../shop/ProductCard";
import axios from "axios";

const About = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        const all = res.data;
        const latest = [...all]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setLatestProducts(latest);
      })
      .catch(err => console.error("Ошибка при загрузке товаров:", err));
  }, []);

  return (
    <div className="container py-4">
      <Header />

      {/* Логотип и девиз */}
      <div className="text-center mb-5">
        <img
          src="/logo.png"
          alt="Логотип компании"
          className="img-fluid mb-3"
          style={{ maxWidth: "150px", height: "auto" }}
        />
        <h1 className="fw-bold fs-3">Музыка в каждый дом 🎶</h1>
        <p className="lead text-muted fs-6">Мы делаем звук доступным и стильным</p>
      </div>

      {/* Слайдер с карточками товаров */}
      <h2 className="text-center mb-4 fs-4">Новинки компании</h2>

      <Carousel interval={2500} pause="hover" indicators={false}>
        {latestProducts.map((product) => (
          <Carousel.Item key={product.id}>
            <div className="d-flex justify-content-center">
              <div className="w-100 px-2" style={{ maxWidth: "340px" }}>
                <ProductCard product={product} user={user} />
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default About;
