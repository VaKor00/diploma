import React, { Component} from "react";

const startText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"}; const text = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "16px"}

const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px"}

const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "30px"}   

import { Link } from '@inertiajs/react';

import { useEffect, useState, useRef  } from 'react';

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function Car({onReady, ...props}) {
  const { id, model_id, complectation_id, dealer_id, img_1, price} = props;

  const [model, setItems2] = useState([]);
  const [complectation, setItems3] = useState([]);
  const [dealers, setItems4] = useState([]);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        const filteredItems = data.filter(
            item => item.id == model_id
        );
        setItems2(filteredItems);
        })
      .catch(console.error);
  }, [model_id]);

  useEffect(() => {
    fetch('/api/complectation')
      .then(res => res.json())
      .then(data => {
        const filteredItems = data.filter(
            item => item.model_id == model_id && item.id == complectation_id
            
        );
        setItems3(filteredItems);
        })
      .catch(console.error);
  }, [model_id, complectation_id]);

  useEffect(() => {
    fetch('/api/dealers')
      .then(res => res.json())
      .then(data => {
        const filteredItems = data.filter(
            item => item.id == dealer_id
            
        );
      setItems4(filteredItems);
      })
      .catch(console.error);
  }, [dealer_id]);

  const hasCalledRef = useRef(false);

  const handleImageLoad = () => {
    if (onReady && !hasCalledRef.current) {
      onReady(id);
      hasCalledRef.current = true;
    }
  };

  // Остальной JSX
  return (
    <div onLoad={handleImageLoad} className="d-flex flex-column h-100 p-3" style={{ minHeight: '350px' }}>
      {/* Верхняя часть: изображение */}
      <div style={{ maxHeight: '300px' }}>
        <img src={`${img_1}`} alt={id} className="w-100" style={{ objectFit: 'cover', height: '100%' }} />
      </div>
      {/* Текст и блок с ценой + кнопкой */}
      <div className="d-flex flex-column flex-fill pt-3">
        {/* Заголовок и описание */}
        <div style={text}>
          <h4 className="text-dark" style={startText}>{model[0]?.model_name}</h4>
          <h5 className="text-secondary" style={startText}>{complectation[0]?.complectation_name}</h5>
          <p><i className="bi bi-hypnotize"></i> Двигатель: {complectation[0]?.engine} л.с.</p>
          <p><i className="bi bi-pin-map"></i> Коробка: {complectation[0]?.transmission}</p>
          <p><i className="bi bi-arrows-fullscreen"></i> Привод: {complectation[0]?.wheel_drive}</p>
          <br/>
          <p><i className="bi bi-geo-alt-fill"></i> {dealers[0]?.city_name}, {dealers[0]?.name}</p>
        </div>
        <div className="mt-auto w-100 d-flex flex-column align-items-center">
          <br />
          <p style={descst} className="mb-2">{numberWithSpaces(price)} ₽</p>
          <a style={buttons} className="w-100 btn btn-sm btn-dark rounded-0" href={`/carinfo/${id}`}>
            Подробнее <i className="bi bi-chevron-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Car;