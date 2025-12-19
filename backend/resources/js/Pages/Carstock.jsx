import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";
import Car from '../elements/models/car';

import logo from "../assets/logo.svg";
import vk from "../img/socnetwork/vk.svg";
import tg from "../img/socnetwork/tg.svg";
import yt from "../img/socnetwork/yt.svg";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    

import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState, useEffect  } from 'react';

import MultiRangeSlider from "multi-range-slider-react";

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}


function useLoadMore(initialCount = 8, increment = 8) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setVisibleCount(mobile ? 4 : 8);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showMore = () => {
    setVisibleCount(prev => prev + increment);
  };

  return { visibleCount, showMore, isMobile };
}

function Carstock() {

  const [items, setItems] = useState([]);
  const [itemsToShow, setItemsToShow] = useState([]);
  const [loading, setLoading] = useState(true); // изначально показываем загрузчик
  const { visibleCount, showMore } = useLoadMore();

  const [readyCount, setReadyCount] = useState(0);
  const totalToRender = Math.min(visibleCount, items.length);

  const [models, setModels] = useState([]);
  const [complectations, setComplectations] = useState([]);
  const [complectations1, setComplectations1] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedComplectationId, setSelectedComplectationId] = useState('');
  const [selectedTransmisson, setSelectedTransmisson] = useState('');  
  const [selectedPrivod, setSelectedPrivod] = useState('');  
  const [loadingComplectations, setLoadingComplectations] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [powerRange, setPowerRange] = useState({ min: 0, max: 100 }); // начальные значения
  const [colors, setColors] = useState([]);

  // Загружаем данные
  useEffect(() => {
    console.log('useEffect вызван')
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setItemsToShow(data); // обновляем отображаемые карточки
        setReadyCount(0);
        setLoading(true); // показываем загрузчик при новой загрузке

        // цена при загрузке

        const prices = data.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
        
        // Устанавливаем minValue и maxValue только один раз
        setMinValue(minPrice);
        setMaxValue(maxPrice);

      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // при ошибке тоже скрываем загрузчик
      });
  }, []);

  // Когда все "готовы"
  useEffect(() => {
    if (readyCount >= totalToRender && totalToRender > 0) {
      console.log('Все элементы вставлены, скрываем загрузчик');
      setLoading(false);
    }
  }, [readyCount, totalToRender]);

  const handleCarReady = (id) => {
    console.log('Car полностью вставлена:', id);
    setReadyCount(prev => prev + 1);
  };

  // if (loading) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '50px' }}>
  //       <div className="spinner-border" role="status">
  //         <span className="visually-hidden">Загрузка...</span>
  //       </div>
  //     </div>
  //   );
  // }

  // модальное окно с фильтром

  const [isAnimating, setIsAnimating] = useState(false);
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    setShow(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setShow(false), 300);
  };

  // Загружаем цвета при монтировании компонента
  useEffect(() => {
    fetch('/api/colors') // замените на ваш API-адрес
      .then(res => res.json())
      .then(data => setColors(data))
      .catch(console.error);
  }, []);

   // Загружаем модели при монтировании
  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(console.error);
  }, []);

   useEffect(() => {
      fetch('/api/complectation')
        .then(res => res.json())
        .then(data => {
          const powers = data
            .map(c => c.engine)
            .filter(engine => typeof engine === 'number' && !isNaN(engine));
          if (powers.length > 0) {
            const minPower = Math.min(...powers);
            const maxPower = Math.max(...powers);
            setPowerRange({ min: minPower, max: maxPower });
            // Устанавливаем min/max только один раз
            setPowerMin(minPower);
            setPowerMax(maxPower);
          }
        });
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

  // модель авто

  const handleModelChange = (e) => {
    setSelectedModelId(e.target.value);
    setSelectedComplectationId('');
    setFilters(prev => ({ ...prev, modelId: e.target.value }));
    setFilters(prev => ({ ...prev, complectationId: '' }));
    console.log('Выбранная модель:', e.target.value);
  };

  // комплектация

  const handleComplectationChange = (e) => {
    setSelectedComplectationId(e.target.value);
    setFilters(prev => ({ ...prev, complectationId: e.target.value }));
    console.log('Выбранная комлектация:', e.target.value);
  };

  // для цены 
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const handleInput = (e) => {
    setMinValue(e.minValue);
    setMaxValue(e.maxValue);
    // Обновляем фильтр
    setFilters(prev => ({
      ...prev,
      priceMin: e.minValue,
      priceMax: e.maxValue
    }));
    console.log('Выбранная цена от: ', e.minValue, 'до: ', e.maxValue);
  };
  
  const [powerMin, setPowerMin] = useState(0);
  const [powerMax, setPowerMax] = useState(100);
  const handleInputPower = (e) => {
  setPowerMin(e.minValue);
  setPowerMax(e.maxValue);
  setFilters(prev => ({
    ...prev,
    powerMin: e.minValue,
    powerMax: e.maxValue
  }));
};

  useEffect(() => {
  console.log('Мощность двигателя изменена:', powerMin, powerMax);
}, [powerMin, powerMax]);

  // При первой загрузке данных
  useEffect(() => {
    if (complectations1.length > 0) {
      const powers = complectations1
        .map(c => c.engine)
        .filter(engine => typeof engine === 'number' && !isNaN(engine));
      if (powers.length > 0) {
        const minPower = Math.min(...powers);
        const maxPower = Math.max(...powers);
        setPowerRange({ min: minPower, max: maxPower });
        // Устанавливаем min/max только один раз
        setPowerMin(minPower);
        setPowerMax(maxPower);
      }
    }
  }, [complectations1]);

    // обработчик выбора цветов

  const handleColorChange = (colorId) => {
  setFilters(prev => {
    const newColors = prev.colors.includes(colorId)
      ? prev.colors.filter(c => c !== colorId)
      : [...prev.colors, colorId];
    return { ...prev, colors: newColors };
  });
};
// трансмиссия

const handleTransmisson = (e) => {
    setSelectedTransmisson(e.target.value);
    setFilters(prev => ({ ...prev, transmission: e.target.value }));
    console.log('Выбранная трансмиссия:', e.target.value);
  };

// привод

const handlePrivod = (e) => {
    setSelectedPrivod(e.target.value);
    setFilters(prev => ({ ...prev, privod: e.target.value }));
    console.log('Выбранный привод:', e.target.value);
  };

// состояния для городов и салонов
const [cities, setCities] = useState([]);
const [allDealers, setAllDealers] = useState([]);

const [selectedCity, setSelectedCity] = useState('');
const [selectedDealer, setSelectedDealer] = useState('');

// загрузка городов и салонов
useEffect(() => {
  fetch('/api/city')
    .then(res => res.json())
    .then(data => setCities(data))
    .catch(console.error);
}, []);

useEffect(() => {
  fetch('/api/dealers')
    .then(res => res.json())
    .then(data => {
      setAllDealers(data);
    })
    .catch(console.error);
}, []);

// 2. Создаем фильтр по выбранному городу
const filteredDealers = selectedCity
  ? allDealers.filter(d => d.city === Number(selectedCity))
  : allDealers;

// обработчики города

const handleCityChange = (e) => {
  setSelectedCity(e.target.value);
  setFilters(prev => ({ ...prev, city: e.target.value }));
  console.log('Выбранный город:', e.target.value);
  // при смене города грузите автосалоны
}
const handleDealerChange = (e) => {
  setSelectedDealer(e.target.value);
  setFilters(prev => ({ ...prev, dealer: e.target.value }));
  console.log('Выбранный дилер:', e.target.value);
}

// Фильтр

const [filters, setFilters] = useState({
  modelId: '',
  complectationId: '',
  priceMin: null,
  priceMax: null,
  powerMin: null,
  powerMax: null,
  colors: [],
  transmission: '',
  privod: '',
  city: '',
  dealer: ''
});

// По кнопке применить
const applyFilters = () => {

  // Создаем объект с параметрами
  const params = {
    model_id: filters.modelId,
    complectation_id: filters.complectationId,
    price_min: filters.priceMin,
    price_max: filters.priceMax,
    engine_min: filters.powerMin,
    engine_max: filters.powerMax,
    colors: filters.colors.join(','),
    transmission: filters.transmission,
    privod: filters.privod,
    city: filters.city,
    dealer: filters.dealer,
  };
  
  console.log('Параметры запроса:', params.toString());

  console.log('Фильтр transmission:', filters.transmission);

  // Получаем список комплектаций и фильтруем по мощности
  fetch('/api/complectation')
  .then(res => res.json())
  .then(data => {
    // Фильтрация по мощности
    const minEngine = filters.powerMin;
    const maxEngine = filters.powerMax;
    let filteredComplectations = data.filter(c => c.engine >= minEngine && c.engine <= maxEngine);

    // Фильтрация по transmission, если выбран
    if (filters.transmission && filters.transmission !== 'any') {
      // Для отладки
    filteredComplectations.forEach(c => {
      console.log('Комплектация:', c, 'transmission:', c.transmission);
    });
      filteredComplectations = filteredComplectations.filter(c => c.transmission === filters.transmission);
    }

    // Фильтрация по приводу, если выбран
    if (filters.privod && filters.privod !== 'any') {
      // Для отладки
    filteredComplectations.forEach(c => {
      console.log('Комплектация привод:', c, 'transmission:', c.wheel_drive);
    });
      filteredComplectations = filteredComplectations.filter(c => c.wheel_drive === filters.privod);
    }

    const complectationIds = filteredComplectations.map(c => c.id);
    console.log('ID комплектаций после фильтрации:', complectationIds);
    console.log('Выбранная комплектация:', filters.complectationId);

    // Проверка: если выбран ID, которого нет в списке, результат пустой
    if (filters.complectationId && filters.complectationId !== 'any') {
      const selectedId = Number(filters.complectationId);
      if (!complectationIds.includes(selectedId)) {
        // Нет такой комплектации в списке, результат пустой
        setItems([]);
        setItemsToShow([]);
        return; // завершить фильтрацию
      }
    }

    const filteredDealers = filters.city
        ? allDealers.filter(d => d.city === Number(filters.city))
        : allDealers;

      // Проверка: есть ли дилеры в выбранном городе
      if (filters.city && filteredDealers.length === 0) {
        // Нет дилеров в выбранном городе — показываем пустой результат
        setItems([]);
        setItemsToShow([]);
        return;
      }

      // Если дилер выбран, проверяем его наличие в списке дилеров по городу
      if (filters.dealer && filters.dealer !== 'any') {
        const dealerExists = filteredDealers.some(d => d.id === Number(filters.dealer));
        if (!dealerExists) {
          setItems([]);
          setItemsToShow([]);
          return;
        }
      }


    // Далее фильтруем машины по этим ID
    fetch('/api/cars/')
      .then(res => res.json())
      .then(data => {
        let filteredData = data;

        if (filters.complectationId && filters.complectationId !== 'any') {
          // фильтруем только по выбранному ID
          filteredData = filteredData.filter(item => item.complectation_id === Number(filters.complectationId));
        } else {
          // фильтруем по списку
          filteredData = filteredData.filter(item => complectationIds.includes(item.complectation_id));
        }
        
        if (filters.modelId && filters.modelId !== 'any') {
          filteredData = filteredData.filter(item => item.model_id === Number(filters.modelId));
        }

        // Остальные фильтры...
        if (filters.colors.length > 0) {
          filteredData = filteredData.filter(item => filters.colors.includes(item.color_id));
        }
        if (filters.priceMin != null) {
          filteredData = filteredData.filter(item => item.price >= filters.priceMin);
        }
        if (filters.priceMax != null) {
          filteredData = filteredData.filter(item => item.price <= filters.priceMax);
        }

        if (filters.dealer && filters.dealer !== 'any') {
          filteredData = filteredData.filter(item => item.dealer_id === Number(filters.dealer));
        }

        setItems(filteredData);
        setItemsToShow(filteredData);
        handleClose();
      });
  })
  .catch(console.error);
};

  return (
    <div className="App">
      <Head title="Автомобили в наличии" />
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
                  <a className="nav-link text-warning">
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
      <h1 style={h1} class="text-center">Автомобили в наличии</h1>
      <div className="d-flex flex-column align-items-end p-3">
        <button className="btn text-secondary"  style={buttons} onClick={handleOpen}>
              <i className="bi bi-funnel"></i> Фильтр
            </button>
      </div>
      <hr></hr>

      {/* Фон-затемнение и блок */}
      {show && (
        <div
          className="fixed-top fixed-bottom fixed-left fixed-right"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
          }}
          onClick={handleClose}
        >
          {/* Сам блок фильтров */}
          <div
            className={`filter-block ${isAnimating ? 'modal-slide-in' : 'modal-slide-out'}`}
            style={{
              width: '25%',
              maxWidth: '70%',
              backgroundColor: '#fff',
              height: '100%',
              padding: '1rem',
              overflowY: 'auto',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок и кнопка закрытия */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={logoText}>Фильтры</h5>
              <button className="btn-close" onClick={handleClose}></button>
            </div>
            {/* Контент фильтров */}
            
            <h5 style={buttons} className="text-secondary">Модель</h5>
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
            <h5 style={buttons} className="text-secondary">Комплектация</h5>
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
            <br></br>
            <h5 style={buttons} className="text-secondary">Цена</h5>
            <MultiRangeSlider
              min={priceRange.min}
              max={priceRange.max}
              step={1}
              minValue={minValue}
              maxValue={maxValue}
              ruler={false}
              label={false}
              onInput={handleInput}
            />
            <div className="row" style={descst}>
            <div className="col-6"><span className="text-secondary">от {minValue} ₽</span></div>
            <div className="col-6 text-end"><span className="text-secondary">до {maxValue} ₽</span></div>
            <div className="col-6"><span className="text-secondary">&nbsp;</span></div>
            </div>
            <h5 style={buttons} className="text-secondary">Двигатель</h5>
            <MultiRangeSlider
              min={powerRange.min}
              max={powerRange.max}
              step={1}
              minValue={powerMin}
              maxValue={powerMax}
              ruler={false}
              label={false}
              onInput={handleInputPower}
            />
            <div className="row" style={descst}>
            <div className="col-6"><span className="text-secondary">от {powerMin} л.с.</span></div>
            <div className="col-6 text-end"><span className="text-secondary">до {powerMax} л.с.</span></div>
            <div className="col-6"><span className="text-secondary">&nbsp;</span></div>
            </div>
            <h5 style={buttons} className="text-secondary">Цвета</h5>
            <div className="row" style={descst}>
            <div className="col-md-6 text-secondary">
              {colors.slice(0, Math.ceil(colors.length / 2)).map((color) => (
                <label key={color.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.id)}
                    onChange={() => handleColorChange(color.id)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: color.color_code,
                    marginLeft: '8px',
                    border: '1px solid #ccc'
                  }}></span>
                  &nbsp;{color.color_name}
                </label>
              ))}
            </div>
            <div className="col-md-6">
              {colors.slice(Math.ceil(colors.length / 2)).map((color) => (
                <label key={color.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color.id)}
                    onChange={() => handleColorChange(color.id)}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: color.color_code,
                    marginLeft: '8px',
                    border: '1px solid #ccc'
                  }}></span>
                  &nbsp;{color.color_name}
                </label>
              ))}
            </div>
          </div>
            <br></br>
              <h5 style={buttons} className="text-secondary">КПП</h5>
              <select
                className="form-select"
                value={selectedTransmisson}
                onChange={handleTransmisson}
              >
                <option value="">Любая</option>
                <option value="Механическая">Механическая</option>
                <option value="Вариатор">Вариатор</option>
                <option value="Роботизированная">Роботизированная</option>
                <option value="Автоматическая">Автоматическая</option>
              </select>
            <br></br>
              <h5 style={buttons} className="text-secondary">Привод</h5>
              <select
                className="form-select" 
                value={selectedPrivod}
                onChange={handlePrivod}
              >
                <option value="">Любой</option>
                <option value="Передний">Передний</option>
                <option value="Полный">Полный</option>
              </select>  
              <br></br>
                <h5 style={buttons} className="text-secondary">Город</h5>
                <select value={selectedCity} onChange={handleCityChange} className="form-select mb-3">
                  <option value="">Любой город</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.city}</option>
                  ))}
                </select>

                <h5 style={buttons} className="text-secondary">Автосалон</h5>
                <select
                  className="form-select"
                  value={selectedDealer}
                  onChange={handleDealerChange}
                  disabled={!selectedCity}
                >
                  <option value="">Все автосалоны</option>
                  {filteredDealers.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>{dealer.name}</option>
                    
                  ))}
                </select>
            <div className="mt-auto w-100 d-flex flex-column align-items-center">
              <br></br>
            <a style={buttons} onClick={applyFilters} className="w-100 btn btn-sm btn-dark rounded-0">
            Применить
            </a>
          </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* список карточек */}
        <div className="row">
          {itemsToShow.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
              <Car {...item} onReady={handleCarReady} />
            </div>
          ))}
        </div>
      </div>
      <br></br>
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          {items.length > totalToRender && (
            <button className="btn text-secondary" onClick={showMore} style={buttons}>
              Показать ещё
            </button>
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

export default Carstock;
