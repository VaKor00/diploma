import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";

import logo from "../assets/logo.svg";
import vk from "../img/socnetwork/vk.svg";
import tg from "../img/socnetwork/tg.svg";
import yt from "../img/socnetwork/yt.svg";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    

import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect  } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

// параметры для автодилеров

import CarsS  from '../elements/dealer/carsdealer.jsx';
import AddS from '../elements/dealer/addauto.jsx';
import ApplicationS from '../elements/dealer/application.jsx';

function Dealerpanel() {
  
  const { props } = usePage();
  const dealerId = Number(props.dealerId ?? 0);
  const dealerName = props.dealerName ?? 'Дилер';

  const [activePage, setActivePage] = useState('cars'); // что сейчас выбрано

  const isActive = (page) => activePage === page;

  // Мапинг "ключ -> компонент"
  const renderContent = () => {
    switch (activePage) {
      case 'cars':
        return <CarsS dealerId={dealerId} />;
      case 'add':
        return <AddS dealerId={dealerId} />;
      case 'application':
        return <ApplicationS dealerId={dealerId} />;
      default:
        return <CarsS dealerId={dealerId} />;
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post('/logout'); // Laravel route('logout')
  };

  return (
    <div className="App">
      <Head title={dealerName} />
      {/* шапка сайта */}
      <header className="bg-dark" style={{ position: 'relative' }}> {/* Добавили position: relative */}
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand text-light" href="/" style={logoText}>
              <img src={logo} style={{ width: '35px', height: '35px', marginTop: '-5px', marginRight: '10px' }} alt="logo" />
              {dealerName}
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
                    <a className={
                    'nav-link btn btn-link text-start sidebar-link ' +
                    (isActive('cars') ? 'sidebar-link-active' : '')
                  } 
                  onClick={() => setActivePage('cars')}
                  >
                      Авто в наличии
                    </a>
                </li>
                <li className="nav-item">
                    <a className={
                    'nav-link btn btn-link text-start sidebar-link ' +
                    (isActive('add') ? 'sidebar-link-active' : '')
                  } 
                  onClick={() => setActivePage('add')}
                  >
                      Добавить авто
                    </a>
                </li>
                <li className="nav-item">
                    <a className={
                    'nav-link btn btn-link text-start sidebar-link ' +
                    (isActive('application') ? 'sidebar-link-active' : '')
                  } 
                  onClick={() => setActivePage('application')}
                  >
                      Заявки
                    </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link btn btn-link text-start sidebar-link" onClick={handleLogout}>
                    Выйти {/* в зависимости от авторизации будет меняться */}
                  </a>
                </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

        {/* тело сайта */}
      <main class="container">
        <div>
          {renderContent()}
        </div>
      </main>
      <footer className='bg-dark d-block'>
        <div class="container text-light" style={descst}>
          <br></br>
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

export default Dealerpanel;
