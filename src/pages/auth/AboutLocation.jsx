import React from "react";
import Header from "../../components/Header";

const AboutLocation = () => {
  return (
    <div className="container py-5">
      <Header />

      <h1 className="mb-4 text-center">Где нас найти?</h1>

      <div className="row">
        {/* Левая колонка: Карта */}
        <div className="col-md-7 mb-4">
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.438516987611!2d37.62039361593179!3d55.75396058055259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x414ab54f6a01f08d%3A0xbfd426e6869a9c6e!2z0JrQvtC70YzQvdCwINCc0LjRgNGB0YLRg9C70YzQvdGL0Lkg0L_RgNC-0YHRgtGA0LDRgtCw0Y8!5e0!3m2!1sru!2sru!4v1687638236175!5m2!1sru!2sru"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="map"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Правая колонка: Контакты */}
        <div className="col-md-5">
          <h3>Контактная информация</h3>
          <p><strong>Адрес:</strong> г. Москва, Красная площадь, д.1</p>
          <p><strong>Телефон:</strong> +7 (495) 123-45-67</p>
          <p><strong>Email:</strong> info@musicstore.ru</p>
        </div>
      </div>
    </div>
  );
};

export default AboutLocation;
