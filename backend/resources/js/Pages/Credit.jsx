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
const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, useMemo } from 'react';

import Slider from 'react-slider';
import Bank from '../elements/bank';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

// ползунки

function Credit() {

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

  const [value, setValue] = useState(10);
  const [valueM, setValueM] = useState(12);

  const [models, setModels] = useState([]);
  const [complectations, setComplectations] = useState([]);

  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]); // результат по кнопке

  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedComplectationId, setSelectedComplectationId] = useState('');
  const [loadingComplectations, setLoadingComplectations] = useState(false);

  // загрузка моделей и комплектаций

   // Загружаем модели при монтировании
  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(console.error);
  }, []);

  // Загружаем комплекатции
  useEffect(() => {
    fetch('/api/complectation')
      .then(res => res.json())
      .then(data => setComplectations(data))
      .catch(console.error);
  }, []);

  // Загружаем список банков (кредитные предложения) при монтировании
  useEffect(() => {
    fetch('/api/banks')
      .then(res => res.json())
      .then(data => {
        setBanks(data);
        console.log('Все банки из API:', data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedModelId) {
      setLoadingComplectations(true);
      fetch('/api/complectation')
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(
            item => item.model_id == selectedModelId
          );
          setComplectations(filtered);
        })
        .catch(console.error)
        .finally(() => setLoadingComplectations(false));
    } else {
      setComplectations([]);
    }
  }, [selectedModelId]);

  const handleModelChange = (e) => {
    setSelectedModelId(e.target.value);
    setSelectedComplectationId('');
  };

  const handleComplectationChange = (e) => {
    const id = Number(e.target.value); // или parseInt(e.target.value, 10)
    setSelectedComplectationId(id);
  };

  // тут нужно расчитать минимальную стоимость авто (среди всех комплектаций) или конкретную комплектацию

 const price = useMemo(() => {
  // Пока комплектации ещё не пришли / не готовы — показываем 0
  if (!complectations || complectations.length === 0) return 0;

  // Если выбрана комплектация
  if (selectedComplectationId !== null) {
    const selected = complectations.find(
      c => c.id === selectedComplectationId
    );
    return selected ? selected.price : 0;
  }

  // Если ничего не выбрано — тоже 0 (а не минимальная цена)
  return 0;
}, [complectations, selectedComplectationId]);

  function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  // фильтрация для банков

  useEffect(() => {
    fetch('/api/banks')
      .then(res => res.json())
      .then(data => {
        setBanks(data);
        console.log('Все банки из API:', data);
      })
      .catch(console.error);
  }, []);

  const handleFilterBanks = () => {
  if (!banks || banks.length === 0) {
    setFilteredBanks([]);
    return;
  }

  const result = banks
    .filter(bank => {
      const bankDepositMin = Number(bank.deposit_min);
      const bankMinMonth   = Number(bank.min_month);
      const bankMaxMonth   = Number(bank.max_month);

      const depositOk = value >= bankDepositMin;

      const monthsOk = valueM === 0
          ? true
          : (valueM >= bankMinMonth && valueM <= bankMaxMonth);

        return depositOk && monthsOk;
      })
      .map(bank => ({
        ...bank,
        // “снимок” значений на момент клика
        calcPrice:  price,   // стоимость авто
        calcDeposit: value,  // % первоначального взноса
        calcTerm:   valueM,  // срок в месяцах
      }));

    console.log('Параметры фильтрации:', { price, value, valueM });
    console.log('Отфильтрованные банки:', result);

    setFilteredBanks(result);
  };

  return (
    <div className="App" style={descst}>
      <Head title="Автокредит" />
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
                  <Link className="nav-link text-warning">
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
      <br></br>
      <h1 style={h1} class="text-center">Автокредит</h1>
      <br></br>
      <div className="container">
        <br></br>
        <p align="justify" style={{ fontSize: "24px" }}>
          Бренд PHOENIX предоставляет возможность оформить автокредит на покупку нового авто у банков партнеров. Первоначальный взнос на покупку
          авто - от 10% до 70%. Срок кредитования от 12 до 72 месяцев. Процентная ставка зависит от банка партнера. С предварительной информацией
          о платежах Вы можете ознакомиться на данной странице.
        </p>
        <p align="center" style={{ fontSize: "24px" }}>ОЦЕНИВАЙТЕ СВОИ ФИНАНСОВЫЕ ВОЗМОЖНОСТИ И РИСКИ!</p>
      </div>
      <br></br>
      <h1 style={h1} class="text-center">Кредитный калькулятор</h1>
      <br></br>
      <div className="container">
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6">
                <h3>Модель</h3>
            <select
                className="form-select mb-3"
                value={selectedModelId}
                onChange={handleModelChange}
              >
                <option value="">Любая</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.model_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-lg-6">
                <h3>Комплектация</h3>
            <select
              className="form-select"
              value={selectedComplectationId}
              onChange={handleComplectationChange}
              disabled={!selectedModelId || loadingComplectations}
            >
              <option value="">Выберите комплектацию</option>
              {loadingComplectations ? (
                <option>Загрузка...</option>
              ) : (
                complectations.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.complectation_name}
                  </option>
                ))
              )}
            </select>
            </div>
          </div>
        </div>
        <br></br>      
        <div className="container">
          <div className="row">
            <div className="d-none d-lg-block col-lg-8"><h3>Стоимость авто:</h3></div>
            <div className="d-none d-lg-block col-lg-4 text-end"><h3>{numberWithSpaces(price)} ₽</h3></div>
          </div>
          <div className="row">
            <div className="d-block d-lg-none col-lg-8 text-center"><h3>Стоимость авто:</h3></div>
            <div className="d-block d-lg-none col-lg-4 text-center"><h3>{numberWithSpaces(price)} ₽</h3></div>
          </div>
        </div>   
        <div style={{ width: '100%', margin: '50px auto' }}>
          <Slider
            value={value}
            onChange={setValue}
            min={10}
            max={70}
            step={10} // условно (будет меняться в зависимости от модели авто)
            renderTrack={(props, state) => (
              <div {...props} style={{
                ...props.style,
                height: '10px',
                background: state.index === 0 ? '#DEBD00' : 'hsl(0, 0%, 93%)',
                borderRadius: '2px'
              }} />
            )}
            renderThumb={(props, state) => (
              <div {...props} style={{
                ...props.style,
                height: '30px',
                width: '20px',
                marginTop: '-10px',
                backgroundColor: '#DEBD00',
                cursor: 'pointer'
              }} />
            )}
          />
        </div>
        <br></br><br></br>
        <div className="container">
          <div className="row">
            <div className="col-9"><h3>Первоначальный взнос</h3></div>
            <div className="col-3 text-end"><h3>{value}%</h3></div>
          </div>
        </div>
        <div style={{ width: '100%', margin: '50px auto' }}>
          <Slider
            value={valueM}
            onChange={setValueM}
            min={12}
            max={84}
            step={12}
            renderTrack={(props, state) => (
              <div {...props} style={{
                ...props.style,
                height: '10px',
                background: state.index === 0 ? '#DEBD00' : 'hsl(0, 0%, 93%)',
                borderRadius: '2px'
              }} />
            )}
            renderThumb={(props, state) => (
              <div {...props} style={{
                ...props.style,
                height: '30px',
                width: '20px',
                marginTop: '-10px',
                backgroundColor: '#DEBD00',
                cursor: 'pointer'
              }} />
            )}
          />
        </div>
        <br></br><br></br>
        <div className="container">
          <div className="row">
            <div className="col-8"><h3>Срок кредита</h3></div>
            <div className="col-4 text-end"><h3>{valueM} мес.</h3></div>
          </div>
        </div>
        <br></br>
        
        <div className="container">
          <div className="row">
            <div className="d-none d-lg-block col-lg-8"></div>
            <div className="d-none d-lg-block col-lg-4">
              <a style={buttons} type="button" onClick={handleFilterBanks} className="w-100 btn btn-sm btn-dark rounded-0">
                     Рассчитать
                </a> 
            </div>
          </div>
          <div className="row">
            <div className="d-block d-lg-none text-center">
              <a style={buttons} type="button" onClick={handleFilterBanks} className="w-100 btn btn-sm btn-dark rounded-0">
                     Рассчитать
                </a> 
            </div>
          </div>
          <br></br><br></br>
            {/* Тут предложения от банков (разумеется фейковые) */}

            
          <div className="row">
            <div className="col-12 ">
               {filteredBanks.map((item) => (
                <div key={item.id}>
                  <Bank
                    {...item}
                    price={item.calcPrice}
                    deposit={item.calcDeposit}
                    term={item.calcTerm}
                  />
                </div>
              ))}
            </div>
          </div>   

          </div>


          </div>
          <div className="col-1"></div>
        </div>
      </div>
      <br></br>
      
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

export default Credit;
