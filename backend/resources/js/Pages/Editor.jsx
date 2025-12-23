import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import React, { useState } from 'react';

import logo from "../assets/logo.svg";

import { Head, Link, router } from '@inertiajs/react';

// все настройки для админа

import HomeS  from '../setting/homeS.jsx'; // редактор главной страницы
import CityS from '../setting/cityS.jsx'; // редактор городов
import DealerS from '../setting/dealerS.jsx'; // редактор дилеров
import ModelsS from '../setting/modelsS.jsx'; // редактор моделей
import ComplectationS from '../setting/complectationS.jsx'; // редактор комплектаций
import ColorsS from '../setting/colorsS.jsx'; // редактор цветов
import BanksS from '../setting/banksS.jsx'; // редактор банков

const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "38px"}

const images = import.meta.glob('../img/startpage/*.{jpg,jpeg,png}', { eager: true });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([key, value]) => [key.split('/').pop(), value.default])
);

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"} 

function Editor() {

  const [activePage, setActivePage] = useState('home'); // что сейчас выбрано

  const isActive = (page) => activePage === page;

  // Мапинг "ключ -> компонент"
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomeS  />;
      case 'cities':
        return <CityS />;
      case 'dealers':
        return <DealerS />;
      case 'models':
        return <ModelsS />;
      case 'complectation':
        return <ComplectationS />;
      case 'colors':
        return <ColorsS />;
      case 'banks':
        return <BanksS />;
      default:
        return <HomeS />;
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout');
  };

  return (
    <div className="App">
      <Head title="PHOENIX Администратор" />

      <div className="row g-0" style={{ minHeight: '100vh' }}>
        <div
          className="col-2 bg-dark text-light position-sticky d-flex flex-column"
          style={{ top: 0, height: '100vh' }}
        >
          <div>
            <br />
            <div className="navbar-brand text-light" style={logoText}>
              &nbsp;
              <img
                src={logo}
                style={{ width: '35px', height: '35px', marginTop: '-5px', marginRight: '10px' }}
                alt="logo"
              />
              Админ
            </div>
            <hr />
            <div style={descst} className="p-3">
              <h3 style={{ textAlign: 'center' }}>Настройки</h3>
              <br />

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('home') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('home')}
              >
                Главная страница
              </button>

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('cities') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('cities')}
              >
                Города
              </button>

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('dealers') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('dealers')}
              >
                Дилеры
              </button>

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('models') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('models')}
              >
                Модели
              </button>

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('complectation') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('complectation')}
              >
                Комплектации
              </button>

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('colors') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('colors')}
              >
                Цвет авто
              </button>

              <button
                type="button"
                className={
                  'nav-link btn btn-link text-start sidebar-link ' +
                  (isActive('banks') ? 'sidebar-link-active' : '')
                }
                style={buttons}
                onClick={() => setActivePage('banks')}
              >
                Банки партнеры
              </button>
            </div>
          </div>

          {/* нижняя часть левой панели – кнопка выхода */}
          <div className="mt-auto p-3">
            <div>
              <Link className="navbar-brand text-light" href="/" style={logoText}>
              <button
                type="submit"
                className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
                style={buttons}
              >
                На главную
              </button>
              </Link>
            </div>
            <br/>
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
                style={buttons}
              >
                <i className="bi bi-box-arrow-right me-2" />
                Выйти
              </button>
            </form>
          </div>
        </div>

        <div className="col-10">
          <br />
          <h1 style={h1} className="text-center">
            {activePage === 'home' && 'Главная страница'}
            {activePage === 'cities' && 'Города'}
            {activePage === 'dealers' && 'Дилеры'}
            {activePage === 'models' && 'Модели'}
            {activePage === 'complectation' && 'Комплектации'}
            {activePage === 'colors' && 'Цвет авто'}
            {activePage === 'banks' && 'Банки партнеры'}
          </h1>
          <hr />
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
