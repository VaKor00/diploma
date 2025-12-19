import React, { Component} from "react";

const startText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"}; const text = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "20px"}

const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px"}

const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "30px"}   

import { Link } from '@inertiajs/react';

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

class Model extends Component { render() {

    const { id, img, model_name, description, min_price} = this.props;
    return (
        <>
            {/* ПК и планшет с горизонтальной ориентацией */}
            <div className="d-none d-lg-flex flex-column h-100 p-3">
                <div className="row flex-fill">
                    <div className="col-12 col-lg-4 col-xl-5">
                    <img src={img} alt={id} className="w-100" style={{ objectFit: 'cover', height: '100%' }} />
                    </div>
                    <div className="col-12 col-lg-8 col-xl-7 d-flex flex-column">
                    <div className="flex-fill">
                        <h4 className="text-dark" style={startText}>PHOENIX {model_name}</h4>
                        <span className="text-dark">{description}</span>
                        <br /><br />
                    </div>
                    {/* Блок с ценой и кнопкой — закреплен снизу */}
                    <div className="mt-auto text-end">
                        <p style={descst}>от {numberWithSpaces(min_price)} ₽</p>
                        <Link style={buttons} type="button" className="btn btn-sm btn-dark mb-1 rounded-0" href={`/modelcar/${id}`}>
                        Подробнее
                        <i className="bi bi-chevron-right"></i>
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
            {/* Для смартфонов и планшетов (до lg) */}
            <div className="d-flex d-lg-none flex-column h-100 p-3" style={{ minHeight: '400px' }}>
            {/* Верхняя часть: изображение */}
            <div style={{ maxHeight: '300px' }}>
                <img src={img} alt={id} className="w-100" style={{ objectFit: 'cover', height: '100%' }} />
            </div>
            {/* Текст и блок с ценой + кнопкой */}
            <div className="d-flex flex-column flex-fill pt-3">
                {/* Заголовок и описание */}
                <div>
                <h4 className="text-dark" style={startText}>{model_name}</h4>
                <span className="text-dark">{description}</span>
                </div>
                {/* Блок с ценой и кнопкой — закреплен снизу */}
                <div className="mt-auto w-100 d-flex flex-column align-items-center">
                    <br></br>
                <p style={descst} className="mb-2">от {numberWithSpaces(min_price)} ₽</p>
                <Link style={buttons} type="button" className="w-100 btn btn-sm btn-dark rounded-0" href={`/modelcar/${id}`}>
                     Подробнее
                     <i className="bi bi-chevron-right"></i>
                </Link>
                </div>
            </div>
            </div>
        </>
    );
    
}
}

export default Model;