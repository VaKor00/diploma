import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";

import logo from "../assets/logo.svg";
import vk from "../img/socnetwork/vk.svg";
import tg from "../img/socnetwork/tg.svg";
import yt from "../img/socnetwork/yt.svg";

import Complectation from '../elements/models/complectation';
import Salon from '../elements/models/salon';

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    
const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

const black = {filter: "brightness(15%)", zIndex: "1", height: "400px", objectFit: "cover" };
const blackS = {filter: "brightness(15%)", zIndex: "1", height: "350px", objectFit: "cover" };

const startTextM = {position: "absolute", zIndex: "2", marginTop: "200px", fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"};
const startTextD = {position: "absolute", zIndex: "2", marginTop: "210px", fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"};

//изображение

const images = import.meta.glob('../img/cars/*.{jpg,jpeg,png}', { eager: true });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([key, value]) => {
    const filename = key.split('/').pop().toLowerCase(); // получаем имя файла
    return [filename, value.default]; // создаем пару ключ-значение
  })
);

function Modelcar() {

 const { url } = usePage();

  const segments = url.split('/');
  const id = segments[segments.length - 1];

  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    // Загружаем данные по id
    fetch(`/api/models/${id}`)
      .then(res => res.json())
      .then(data => setModelData(data))
      .catch(error => console.error(error));
  }, [id]);

  const [complect, setItems] = useState([]);
          
  useEffect(() => {
      fetch('/api/complectation')
        .then(res => res.json())
        .then(data => {
          const filteredItems = data.filter(item => item.model_id == id);
          setItems(filteredItems);
        })
        .catch(console.error);
    }, []);

  if (!modelData) return <div></div>;

  const imgName = modelData.img.split('/').pop().toLowerCase();
  const imgSrc = imageMap[imgName]; // путь к изображению

  const imgName1 = modelData.salon_photo.split('/').pop().toLowerCase();
  const imgSrc1 = imageMap[imgName1]; // путь к изображению

  const parsedSalon= JSON.parse(modelData.features);

  return (
    <div className="App" style={descst}>
      <Head title={`PHOENIX ${modelData.model_name}`} />
      {/* шапка сайта */}
      <header className="bg-dark" style={{ position: 'relative' }}> {/* Добавили position: relative */}
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <Link className="navbar-brand text-light" href="/" style={logoText}>
              <img src={logo} style={{ width: '35px', height: '35px', marginTop: '-5px', marginRight: '10px' }} alt="logo" />
              PHOENIX
            </Link>
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
                  <Link className="nav-link" href="/carstock">
                    Автокредит
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/credit">
                    Автокредит
                  </Link>
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
    <div>
      <img style={black} src={imgSrc} className="d-none d-lg-block w-100" alt={`carid ${id}`} />
      <img style={blackS} src={imgSrc} className="w-100 d-sm-block d-lg-none" alt={`carid ${id}`} />
        <div style={startTextD} className="position-absolute top-0 start-0 w-100 d-none d-lg-flex flex-column justify-content-between">
          <div class="container text-center text-md-start">
            <h1 className="text-light" style={{textAlign: "center", fontSize: "72px"}}> PHOENIX {modelData.model_name} </h1>
          </div>
        </div>
        <div style={startTextM} className="position-absolute top-0 start-0 w-100 d-sm-flex d-lg-none flex-column justify-content-between">
          <div class="container text-center text-md-start">
            <h1 className="text-light" style={{textAlign: "center", fontSize: "50px"}}> {modelData.model_name} </h1>
          </div>
        </div>
      </div>
        {/* тело сайта */}
      <main class="container">
      <br></br>
      <p align="justify" style={{ fontSize: "24px" }}>{modelData.description_full}</p>
      <br></br>
      <h1 style={h1} class="text-center">Характеристики</h1>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="col-1 col-lg-2"></div>
          <div className="col-12 col-lg-8">
            <div className="row">
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-hypnotize"></i> Двигатель</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.engine_m} <span style={{ fontSize: "30px" }}>л.с.</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-fuel-pump"></i> Топливный бак</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.fuel_tank} <span style={{ fontSize: "30px" }}>литров</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-archive"></i> Багажник</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.trunk} <span style={{ fontSize: "30px" }}>литров</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-arrows"></i> Длина</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.length} <span style={{ fontSize: "30px" }}>мм.</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-arrows-vertical"></i> Ширина</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.width} <span style={{ fontSize: "30px" }}>мм.</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-arrow-up-square"></i> Высота</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.height} <span style={{ fontSize: "30px" }}>мм.</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-arrows-angle-contract"></i> Колесная база</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.whellbase} <span style={{ fontSize: "30px" }}>мм.</span></h1>
              </div>
              <div className="col-12 col-md-6">
                <h2><i className="bi bi-arrow-bar-down"></i> Клиренс</h2>
                <h1 style={{ fontSize: "60px" }} className="text-secondary">{modelData.clearance} <span style={{ fontSize: "30px" }}>cм.</span></h1>
              </div>
            </div>
          </div>
          <div className="col-1 col-lg-2"></div>
        </div>
      </div>
      <br></br>
      <div className='d-none d-md-block'>
      <h1 style={h1} class="text-center">Салон {modelData.model_name}</h1>
      <br></br>
      <Salon
        src={"/img/cars/" + imgName1}
        points={parsedSalon}
      />
      </div>
      <br></br>
      <h1 style={h1} class="text-center">Комплектации</h1>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-12 col-lg-10">
            <div className="row">
                {complect.map((item) => {
                  return (
                    <div key={item.id}>
                      <Complectation {...item} />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="col-lg-1"></div>
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

export default Modelcar;
