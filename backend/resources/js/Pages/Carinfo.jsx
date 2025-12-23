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

import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState, useEffect  } from 'react';
import { usePage } from '@inertiajs/react';
import Infocar from '../elements/models/infocar';
import { Modal, Button } from 'react-bootstrap';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

//изображение

function Carinfo() {

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

  console.log('modelId из props:', id); // проверьте, что приходит

  const [carData, setCarData] = useState(null);
  const [model, setModel] = useState(null);
  const [complectation, setComplectation] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/cars/${id}`)
      .then(res => res.json())
      .then(data => {
        setCarData(data);
        console.log("filtered car", data);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!carData) return;
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        const modelItem = data.find(item => item.id === carData.model_id);
        setModel(modelItem);
      })
      .catch(console.error);
  }, [carData]);

  useEffect(() => {
    if (!carData) return;
    fetch('/api/complectation')
      .then(res => res.json())
      .then(data => {
        const compItem = data.find(item => item.id === carData.complectation_id);
        setComplectation(compItem);
      })
      .catch(console.error);
  }, [carData]);
 
  useEffect(() => {
    if (!carData) return;
    fetch('/api/colors')
      .then(res => res.json())
      .then(data => {
        const color = data.find(item => item.id === carData.color_id);
        setColor(color);
      })
      .catch(console.error);
  }, [carData]);  

  if (!carData || !model || !complectation || !color) {
    return <div></div>;
    // Загрузка...
  }

  // VIN номер

  function maskVin(vin, visibleStart = 3, visibleEnd = 4) {
    if (!vin || vin.length <= visibleStart + visibleEnd) return vin;
    const start = vin.slice(0, visibleStart);
    const end = vin.slice(-visibleEnd);
    const stars = '*'.repeat(vin.length - visibleStart - visibleEnd);
    return start + stars + end;
  }

  // цена

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }


  function ImageGallery() {

  const images = [
    carData.img_1,
    carData.img_2,
    carData.img_3,
    carData.img_4,
    carData.img_5
  ].filter(Boolean); 

  const [selectedImage, setSelectedImage] = useState(images[0]); 

  

  return (
    
    <div>
              <div>
                {/* Тут будет отображаться изображение машины */}
                      {/* Большое изображение при нажатии */}
                    <img
                      src={selectedImage}
                      alt="main"
                      style={{ width: '100%' }}
                    />
              </div>
              <div>
                {/* Тут будет отображаться остальные изображения для выбора */}
                <div className="row">
                  <div className="col-12">
                    <div className="col-1">&nbsp;</div>
                    <div className="col-10">
                      {/* Контейнер с миниатюрами */}
                      <div className="col-2" style={{ display: 'flex', gap: '10px' }}>
                          {images.map((src, index) => (
                            <img key={index} src={src} alt={`img ${index + 1}`} style={{ width: '100%', cursor: 'pointer' }} 
                            onClick={() => setSelectedImage(src)}/>
                          ))}
                        </div>
                    </div>
                    <div className="col-1">&nbsp;</div>
                  </div>
                </div>
              </div>
      </div>
    );
  }

  function ShowModal({vin}) {

    const nameRegex = /^(?=.{1,64}$)[А-Яа-яЁё]+(?:[ -][А-Яа-яЁё]+)*$/;
    const phoneRegex = /^\+79\d{9}$/

    const [show, setShow] = useState(false);

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const [phone, setPhone] = useState('+7');
    const [phoneError, setPhoneError] = useState('');

    const handleClose = () => setShow(false);
    const handleShow  = () => setShow(true);

    // Имя
    const handleNameChange = (e) => {
      const value = e.target.value;
      setName(value);

      if (value === '') {
        setNameError('');
      } else if (!nameRegex.test(value)) {
        setNameError('Введите имя на русском, до 64 символов. Допускаются пробелы и дефисы.');
      } else {
        setNameError('');
      }
    };

    // Телефон
    const handlePhoneChange = (e) => {
      let value = e.target.value;

      // Всегда начинается с +7
      if (!value.startsWith('+7')) {
        value = '+7' + value.replace(/^\+?7?/, '');
      }

      // Удаляем всё, кроме + и цифр
      value = value.replace(/[^\d+]/g, '');

      // Оставляем только один +7 в начале
      if (!value.startsWith('+7')) {
        value = '+7';
      }

      // Ограничиваем общую длину до 12 символов: "+7" + 10 цифр
      if (value.length > 12) {
        value = value.slice(0, 12);
      }

      // Применяем
      setPhone(value);

      // Валидация: полная строка или пустой хвост
      if (value === '+7') {
        setPhoneError('');
      } else if (!phoneRegex.test(value)) {
        setPhoneError('Введите номер формата +79XXXXXXXXX (10 цифр, первая после 7 — 9).');
      } else {
        setPhoneError('');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      let valid = true;

      if (!nameRegex.test(name)) {
        setNameError('Введите корректное имя.');
        valid = false;
      }

      if (!phoneRegex.test(phone)) {
        setPhoneError('Введите номер формата +79XXXXXXXXX (10 цифр, первая после 7 — 9).');
        valid = false;
      }

      if (!vin) {
        // на всякий случай, если по какой-то причине VIN не пришёл
        console.error('VIN не передан в BookingModal');
        valid = false;
      }

      if (!valid) return;

      try {
        const res = await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            phone,
            vin_car: vin,
          }),
        });

        if (!res.ok) {
          if (res.status === 422) {
            const data = await res.json();
            console.error('Ошибки валидации backend:', data.errors);
          } else {
            throw new Error('Ошибка отправки заявки');
          }
          return;
        }

        const data = await res.json();
        console.log('Создан клиент / заявка:', data);

        // Очистка и закрытие
        setName('');
        setPhone('+7');
        setNameError('');
        setPhoneError('');
        handleClose();
      } catch (err) {
        console.error(err);
        // здесь можно показать пользователю сообщение об ошибке
      }
    };


    return (
      <>
      {(carData.status == 0) ?
              <> 
                <a style={buttons} type="button" onClick={handleShow}  className="w-100 btn btn-sm btn-dark rounded-0">
                     Забронировать
        </a>
              </>
              :
              <></>
      }

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title style={buttons}>Забронировать авто</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              {/* Тут ввод имени и номера телефона */}

            <div style={{ marginBottom: '10px' }}>
              <div className="row">
                <div className="col-3">
                    <label style={descst}>
                    Имя&nbsp;
                    
                  </label>
                </div>
                <div className="col-9">
                    <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  style={{width: "100%"}}
                  maxLength={64}
                />
                </div>
              </div>
              {nameError && (
                <div style={{ color: 'red', marginTop: 4 }}>{nameError}</div>
              )}
            </div>
            <div>
              <div className="row">
                <div className="col-3">
                  <label style={descst}>
                    Телефон&nbsp;
                  </label>
                </div>
                <div className="col-9">
                    <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={{width: "100%"}}
                  />
                </div>
              </div>
              {phoneError && (
                <div style={{ color: 'red', marginTop: 4 }}>{phoneError}</div>
              )}
            </div>

            </Modal.Body>

            <Modal.Footer>
              <button style={buttons} type="submit" onClick={handleShow}  className="btn btn-sm btn-dark rounded-0">
                Отправить заявку
              </button>
            </Modal.Footer>
           </form>
        </Modal>
      </>
    );
  }

  return (
    <div className="App">
      <Head title={`PHOENIX ${model?.model_name} ${complectation?.complectation_name}`} />
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
                <li className="nav-item" href="/carstock">
                  <Link className="nav-link text-warning">
                    Авто в наличии
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="#">
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

        {/* тело сайта */}
      <main class="container">
        {/* Модельный ряд */}
      <br></br>
      <h1 style={h1} class="text-center">PHOENIX {model?.model_name} {complectation?.complectation_name}</h1>
      <br></br>
        <div className="row">
          <div className="d-none d-lg-block">
            <div className="row">
              {/* Фотографии */}
            <div className="col-1"></div>
              <div className='col-10'>
                <div className="row">
                  <div className="col-6">
                  <ImageGallery />
                  </div>
                  {/* Описание */}
                  
                  <div className="col-6">
                    <h4 style={descst} className="text-dark">Двигатель: <span className="text-secondary">{complectation?.engine} л.с.</span></h4>
                    <h4 style={descst} className="text-dark">Привод: <span className="text-secondary">{complectation?.wheel_drive}</span></h4>
                    <h4 style={descst} className="text-dark">Трансмиссия: <span className="text-secondary">{complectation?.transmission}</span></h4>
                    <h4 style={descst} className="text-dark">Комплектация: <span className="text-secondary">{complectation?.complectation_name}</span></h4>
                    <h4 style={descst} className="text-dark">Цвет: <span style={{
                          display: 'inline-block',
                          width: '50px',
                          height: '25px',
                          backgroundColor: color.color_code,
                          marginLeft: '6px',
                          marginTop: '-5px',
                          border: '1px solid #ccc',
                          verticalAlign: 'middle'
                        }}></span></h4>
                    <h4 style={descst} className="text-dark">VIN: <span className="text-secondary">{maskVin(carData.VIN)}</span></h4>
                    <br></br>
                    <p style={h1}>{numberWithSpaces(carData.price)} ₽</p>
                    <br></br>
                    <ShowModal vin={carData.VIN} />
                  </div>
                </div>
              </div>
              <div className="col-1"></div>
            </div>
          </div>
          <div className='d-block d-lg-none'>
              {/* Фотографии */}
            <div className="col-12">
              <ImageGallery />
            </div>
            {/* Описание */}
            
            <div className="col-12">
              <h4 style={descst} className="text-dark">Двигатель: <span className="text-secondary">{complectation?.engine} л.с.</span></h4>
              <h4 style={descst} className="text-dark">Привод: <span className="text-secondary">{complectation?.wheel_drive}</span></h4>
              <h4 style={descst} className="text-dark">Трансмиссия: <span className="text-secondary">{complectation?.transmission}</span></h4>
              <h4 style={descst} className="text-dark">Комплектация: <span className="text-secondary">{complectation?.complectation_name}</span></h4>
              <h4 style={descst} className="text-dark">Цвет: <span style={{
                    display: 'inline-block',
                    width: '50px',
                    height: '25px',
                    backgroundColor: color.color_code,
                    marginLeft: '6px',
                    marginTop: '-5px',
                    border: '1px solid #ccc',
                    verticalAlign: 'middle'
                  }}></span></h4>
              <h4 style={descst} className="text-dark">VIN: <span className="text-secondary">{maskVin(carData.VIN)}</span></h4>
              <br></br>
              <p style={h1}>{numberWithSpaces(carData.price)} ₽</p>
              <br></br>
                <ShowModal vin={carData.VIN} />
            </div>
          </div>
        </div>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-12 col-lg-10">
            <div className="row" style={descst}>
               <Infocar {...complectation} />
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

export default Carinfo;
