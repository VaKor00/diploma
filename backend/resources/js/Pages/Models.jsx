import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";
import ConditionSt from "../elements/conditionst";
import Model from "../elements/models/model";

import logo from "../assets/logo.svg";
import vk from "../img/socnetwork/vk.svg";
import tg from "../img/socnetwork/tg.svg";
import yt from "../img/socnetwork/yt.svg";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    

import { Head } from '@inertiajs/react';
import { useState, useEffect  } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

function Models() {

  const [items, setItems] = useState([]);
          
            useEffect(() => {
              fetch('/api/models')
                .then(res => res.json())
                .then(data => {
                  setItems(data);
                })
                .catch(console.error);
            }, []);

  return (
    <div className="App">
      <Head title="Модельный ряд" />
      {/* шапка сайта */}
      <header className="bg-dark" style={{ position: 'relative' }}> {/* Добавили position: relative */}
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand text-light" href="/" style={logoText}>
              <img src={logo} style={{ width: '35px', height: '35px', marginTop: '-5px', marginRight: '10px' }} alt="logo" />
              PHOENIX
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav" style={buttons}> {/* Обновленные стили */}
            <ul className="navbar-nav custom-right-align">
              <li className="nav-item">
                  <a className="nav-link text-warning">
                    Модельный ряд
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Авто в наличии
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Автокредит
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Вход {/* в зависимости от авторизации будет меняться */}
                  </a>
                </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

        {/* тело сайта */}
      <main class="container">
        {/* Модельный ряд */}
      <br></br>
      <h1 style={h1} class="text-center">Модельный ряд</h1>
      <br></br>
      <div class="container">
        <div class="row">
            {items.map((item) => {
            
              return (
                <div key={item.id} className="col-12 col-md-6 col-lg-12 col-xl-6">
                  <Model {...item} />
                  
                </div>
              );
            })}
        </div>
      </div> 
      </main>
      <footer className='bg-dark d-block'>
        <div class="container text-light" style={descst}>
          <br></br>
          <p>Изложенная на данном сайте информация носит ознакомительный характер не является публичной офертой, определяемой положениями статей 435 и 437 Гражданского Кодекса Российской Федерации. Подробности актуальных предложений доступны в салонах официальных дилеров PHOENIX. Указанные на сайте цены, комплектации и технические характеристики, а также условия гарантии могут быть изменены в любое время без специального уведомления. Внешний вид товара, включая цвет, могут отличаться от представленных на фотографиях. Товар сертифицирован.</p>
          <br></br>
          <h3 className='text-center'>ОЦЕНИВАЙТЕ СВОИ ФИНАНСОВЫЕ ВОЗМОЖНОСТИ И РИСКИ!</h3>

          <hr></hr>
          <div class="row">
            <div class="text-center col-md-6 text-md-start">
              <a href="/" class="text-decoration-none text-light" style={logoText}>
                  <img src={logo} style={{width: "35px", height: "35px", marginTop: "-5px"}} alt="logo"></img> PHOENIX</a>
              <br></br><br></br>
            </div>
            <div class="text-center col-md-6 text-md-end">
              <h5>Горячая линия</h5>
              <h3><a class="text-decoration-none text-light" href="tel:+78005553535">+7 800 555 35 35</a></h3>
              <h5>PHOENIX в социальных сетях</h5>
              <div>
                <a href="http://vk.com" class="text-decoration-none text-light" style={logoText}>
                <img src={vk} style={{width: "45px", height: "45px", marginTop: "-5px"}} alt="logo"></img></a>
                <a href="http://vk.com" class="text-decoration-none text-light" style={logoText}>
                <img src={yt} style={{width: "45px", height: "45px", marginTop: "-5px"}} alt="logo"></img></a>
                <a href="http://vk.com" class="text-decoration-none text-light" style={logoText}>
                <img src={tg} style={{width: "45px", height: "45px", marginTop: "-5px"}} alt="logo"></img></a>
              
              </div>
              <br></br>
            </div>
            <h5 className='text-center text-md-start'>(с) 2025 ООО “ФЕНИКС АВТО”</h5> 
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Models;
