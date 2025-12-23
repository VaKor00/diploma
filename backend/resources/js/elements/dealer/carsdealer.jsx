import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";
import Car from '../../elements/models/car';

import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import MultiRangeSlider from "multi-range-slider-react";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    
const descst  = { fontFamily: "TT Supermolot Neue Trial Medium" };
const h1      = { fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px" };

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

  const showMore = () => setVisibleCount(prev => prev + increment);

  return { visibleCount, showMore, isMobile };
}

function Carsdealer() {
  const { props } = usePage();
  const dealerId = props.dealerId;

  const [items, setItems] = useState([]);
  const [itemsToShow, setItemsToShow] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [powerRange, setPowerRange] = useState({ min: 0, max: 100 });
  const [colors, setColors] = useState([]);

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const [powerMin, setPowerMin] = useState(0);
  const [powerMax, setPowerMax] = useState(100);

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
  });

  // первичная загрузка — только машины этого дилера
  useEffect(() => {
    if (!dealerId) return;

    fetch('/api/cars?status=0')
      .then(res => res.json())
      .then(data => {
        const dealerCars = data.filter(item => item.dealer_id === Number(dealerId));

        setItems(dealerCars);
        setItemsToShow(dealerCars);
        setReadyCount(0);
        setLoading(true);

        if (dealerCars.length) {
          const prices = dealerCars.map(item => item.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange({ min: minPrice, max: maxPrice });
          setMinValue(minPrice);
          setMaxValue(maxPrice);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [dealerId]);

  useEffect(() => {
    if (readyCount >= totalToRender && totalToRender > 0) {
      setLoading(false);
    }
  }, [readyCount, totalToRender]);

  const handleCarReady = () => {
    setReadyCount(prev => prev + 1);
  };

  // модалка фильтра
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

  // справочники
  useEffect(() => {
    fetch('/api/colors')
      .then(res => res.json())
      .then(data => setColors(data))
      .catch(console.error);
  }, []);

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
        setComplectations1(data);
        const powers = data
          .map(c => c.engine)
          .filter(engine => typeof engine === 'number' && !isNaN(engine));
        if (powers.length > 0) {
          const minPower = Math.min(...powers);
          const maxPower = Math.max(...powers);
          setPowerRange({ min: minPower, max: maxPower });
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
          const filtered = data.filter(item => item.model_id == selectedModelId);
          setComplectations(filtered);
        })
        .catch(console.error)
        .finally(() => setLoadingComplectations(false));
    } else {
      setComplectations([]);
    }
  }, [selectedModelId]);

  // обработчики фильтров
  const handleModelChange = (e) => {
    const value = e.target.value;
    setSelectedModelId(value);
    setSelectedComplectationId('');
    setFilters(prev => ({
      ...prev,
      modelId: value,
      complectationId: '',
    }));
  };

  const handleComplectationChange = (e) => {
    const value = e.target.value;
    setSelectedComplectationId(value);
    setFilters(prev => ({ ...prev, complectationId: value }));
  };

  const handleInput = (e) => {
    setMinValue(e.minValue);
    setMaxValue(e.maxValue);
    setFilters(prev => ({
      ...prev,
      priceMin: e.minValue,
      priceMax: e.maxValue
    }));
  };

  const handleInputPower = (e) => {
    setPowerMin(e.minValue);
    setPowerMax(e.maxValue);
    setFilters(prev => ({
      ...prev,
      powerMin: e.minValue,
      powerMax: e.maxValue
    }));
  };

  const handleColorChange = (colorId) => {
    setFilters(prev => {
      const newColors = prev.colors.includes(colorId)
        ? prev.colors.filter(c => c !== colorId)
        : [...prev.colors, colorId];
      return { ...prev, colors: newColors };
    });
  };

  const handleTransmisson = (e) => {
    const value = e.target.value;
    setSelectedTransmisson(value);
    setFilters(prev => ({ ...prev, transmission: value }));
  };

  const handlePrivod = (e) => {
    const value = e.target.value;
    setSelectedPrivod(value);
    setFilters(prev => ({ ...prev, privod: value }));
  };

  // применить фильтры (всегда для этого дилера)
  const applyFilters = () => {
    fetch('/api/complectation')
      .then(res => res.json())
      .then(data => {
        const minEngine = filters.powerMin;
        const maxEngine = filters.powerMax;
        let filteredComplectations = data.filter(c => c.engine >= minEngine && c.engine <= maxEngine);

        if (filters.transmission && filters.transmission !== 'any') {
          filteredComplectations = filteredComplectations.filter(c => c.transmission === filters.transmission);
        }

        if (filters.privod && filters.privod !== 'any') {
          filteredComplectations = filteredComplectations.filter(c => c.wheel_drive === filters.privod);
        }

        const complectationIds = filteredComplectations.map(c => c.id);

        if (filters.complectationId && filters.complectationId !== 'any') {
          const selectedId = Number(filters.complectationId);
          if (!complectationIds.includes(selectedId)) {
            setItems([]);
            setItemsToShow([]);
            return;
          }
        }

        fetch('/api/cars?status=0')
          .then(res => res.json())
          .then(dataCars => {
            let filteredData = dataCars;

            // только текущий дилер
            filteredData = filteredData.filter(item => item.dealer_id === Number(dealerId));

            if (filters.complectationId && filters.complectationId !== 'any') {
              filteredData = filteredData.filter(item => item.complectation_id === Number(filters.complectationId));
            } else {
              filteredData = filteredData.filter(item => complectationIds.includes(item.complectation_id));
            }

            if (filters.modelId && filters.modelId !== 'any') {
              filteredData = filteredData.filter(item => item.model_id === Number(filters.modelId));
            }

            if (filters.colors.length > 0) {
              filteredData = filteredData.filter(item => filters.colors.includes(item.color_id));
            }
            if (filters.priceMin != null) {
              filteredData = filteredData.filter(item => item.price >= filters.priceMin);
            }
            if (filters.priceMax != null) {
              filteredData = filteredData.filter(item => item.price <= filters.priceMax);
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
      <main className="container">
        <br />
        <h1 style={h1} className="text-center">Автомобили в наличии</h1>
        <div className="d-flex flex-column align-items-end p-3">
          <button className="btn text-secondary" style={buttons} onClick={handleOpen}>
            <i className="bi bi-funnel"></i> Фильтр
          </button>
        </div>
        <hr />

        {/* модалка фильтра */}
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={logoText}>Фильтры</h5>
                <button className="btn-close" onClick={handleClose}></button>
              </div>

              {/* модель / комплектация */}
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

              <br />
              {/* цена */}
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

              {/* мотор */}
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

              {/* цвета */}
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

              <br />
              {/* КПП */}
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

              <br />
              {/* привод */}
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

              <br />
              <div className="mt-auto w-100 d-flex flex-column align-items-center">
                <br />
                <a
                  style={buttons}
                  onClick={applyFilters}
                  className="w-100 btn btn-sm btn-dark rounded-0"
                >
                  Применить
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <div className="row">
            {itemsToShow.map((item) => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                <Car {...item} onReady={handleCarReady} />
              </div>
            ))}
          </div>
        </div>

        <br />
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
    </div>
  );
}

export default Carsdealer;