import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";

import { YMapComponentsProvider, YMap, YMapFeatureDataSource, YMapDefaultSchemeLayer } from 'ymap3-components';
import custom from "../customization.json";

import logo from "../assets/logo.svg";
import vk from "../img/socnetwork/vk.svg";
import tg from "../img/socnetwork/tg.svg";
import yt from "../img/socnetwork/yt.svg";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    
const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, useCallback, useMemo } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

const maps = { width: "100%", height: "300px" };

import Car from '../elements/models/car';

function Dealer() {

  const { props } = usePage();
  const user = props.auth;

  const renderAuthLink = () => {
    if (!user) {
      // не авторизован
      return (
        <Link className="nav-link" href="/autorization">
          Вход
        </Link>
      );
    }

    if (user.type === 0) {
      return (
        <Link className="nav-link" href="/editor">
          Настройки
        </Link>
      );
    }

    if (user.type === 1) {
      return (
        <Link className="nav-link" href="/dealerpanel">
          Дилер
        </Link>
      );
    }

    if (user.type === 2) {
      return (
        <Link className="nav-link" href="/profile">
          Профиль
        </Link>
      );
    }

    // дефолт на всякий случай
    return (
      <Link className="nav-link" href="/autorization">
        Вход
      </Link>
    );
  };

 const { url } = usePage();

  const segments = url.split('/');
  const id = segments[segments.length - 1];

  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    // Загружаем данные по id
    fetch(`/api/dealer/${id}`)
      .then(res => res.json())
      .then(data => setModelData(data))
      .catch(error => console.error(error));
  }, [id]);

   const [items, setModelData2] = useState([]);

  // Загружаем данные
    useEffect(() => {
    // Загружаем данные по id
    fetch('/api/cars?status=0')
      .then(res => res.json())
      .then(data => {
          const filtered = data.filter(
            item => item.dealer_id == id
          );
          setModelData2(filtered);
        })
      .catch(error => console.error(error));
  }, [id]);

  if (!modelData) return <div></div>;

  console.log(modelData)
  console.log(items)
 

  // API Яндекс карты
  const apiKey = "8735c427-2256-459f-9e73-3373945da236"; //

  const centerCoordinates = [modelData.coord_x, modelData.coord_y];

  
  // Настройка карты
  const mapLocation = { center: centerCoordinates, zoom: 19 };

  return (
    <div className="App" style={descst}>
      <Head title={`${modelData.name}`} />
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
                  <Link className="nav-link" href="/models">
                    Модельный ряд
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/carstock">
                    Авто в наличии
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/credit">
                    Автокредит
                  </Link>
                </li>
                <li className="nav-item">
                    {renderAuthLink()}
                </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    
      <main class="container">
      <br></br>
      <h1 style={h1} class="text-center">{modelData?.name}</h1>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-12 col-lg-10">
              <div className="row align-items-center">
                <div className="col-12 col-lg-5">
                  <h3>Контакты:</h3>
                  <br></br>
                  <h4><i className="bi bi-geo-alt"></i> <span className="text-secondary">{modelData.city_name}, {modelData.street}, {modelData.home}</span></h4>
                  <h4><i className="bi bi-clock"></i> <span className="text-secondary">{modelData.open} - {modelData.closed}</span></h4>
                  <h4><i className="bi bi-telephone"> </i><span className="text-secondary">{modelData.phone}</span></h4>
                <br></br>
              </div>
              <div className="col-12 col-lg-7">
                <div style={maps}>
                  <YMapComponentsProvider apiKey={apiKey}>
                    <YMap location={mapLocation}>
                      <YMapDefaultSchemeLayer customization={custom} />
                      <YMapFeatureDataSource id="my-source" />
                    </YMap>
                  </YMapComponentsProvider>
                </div>               
              </div>
            </div>
          </div>
          <div className="col-lg-1"></div>
        </div>
      </div>
      <br></br>
      <h1 style={h1} class="text-center">Авто в наличии</h1>
      <br></br>
      <div className="container">
        {/* список карточек */}
        <div className="row">
          {items && items.length > 0 && (
            <div className="row">
              {items.map((item) => (
                <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                  <Car {...item} />
                </div>
              ))}
            </div>
          )}
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

export default Dealer;
