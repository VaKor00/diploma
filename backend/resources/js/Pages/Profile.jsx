import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"}   

import logo from "../assets/logo.svg";
import vk from "../img/socnetwork/vk.svg";
import tg from "../img/socnetwork/tg.svg";
import yt from "../img/socnetwork/yt.svg";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    
const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

function Profile() {

    
  const { props } = usePage();
  const { user, dealers, services } = props;

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
      // клиент: показываем выход
      return (
        <Link
          className="nav-link"
          href="/logout"
          method="post"
          as="button"
          type="button"
        >
          Выход
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

  const { data, setData, post, processing, errors } = useForm({
    dealer_id: '',
    date_service: '',
    time_service: '',
  });

  const [slots, setSlots] = useState([]);

  // минимальная дата = завтра
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (!data.dealer_id || !data.date_service) {
      setSlots([]);
      setData('time_service', '');
      return;
    }

    fetch(`/api/technical-service/slots?dealer_id=${data.dealer_id}&date_service=${data.date_service}`)
      .then(res => res.json())
      .then(json => {
        setSlots(json.slots || []);
        setData('time_service', '');
      })
      .catch(console.error);
  }, [data.dealer_id, data.date_service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/technical-service'); // route name 'technical-service.store'
  };

  return (
    <div className="App" style={descst}>
    <Head title={`${user.first_name} ${user.last_name} | PHOENIX`} />
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
    
    <div className="container">
      <br></br>
      <h1 style={h1}>{user.first_name} {user.last_name} | VIN {user.login}</h1>
      <br></br>
      <h2>Запись на ТО</h2>
      <form onSubmit={handleSubmit}>
        {/* выбор дилера */}
        <div className="mb-3">
          <label className="form-label">Дилер</label>
          <select
            className="form-select"
            value={data.dealer_id}
            onChange={e => setData('dealer_id', e.target.value)}
            required
          >
            <option value="">Выберите дилера</option>
            {dealers.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.city_name})
              </option>
            ))}
          </select>
          {errors.dealer_id && <div className="text-danger">{errors.dealer_id}</div>}
        </div>

        {/* дата ≥ завтра */}
        <div className="mb-3">
          <label className="form-label">Дата</label>
          <input
            type="date"
            className="form-control"
            min={minDate}
            value={data.date_service}
            onChange={e => setData('date_service', e.target.value)}
            required
          />
          {errors.date_service && <div className="text-danger">{errors.date_service}</div>}
        </div>

        {/* время как radio-кнопки */}
        <div className="mb-3">
          <label className="form-label">Время</label>
          {slots.length === 0 && data.dealer_id && data.date_service && (
            <div className="text-muted">Свободного времени нет</div>
          )}
          <div className="d-flex flex-wrap gap-2">
            {slots.map(time => (
              <label key={time} className="btn btn-outline-dark">
                <input
                  type="radio"
                  name="time_service"
                  value={time}
                  checked={data.time_service === time}
                  onChange={e => setData('time_service', e.target.value)}
                  className="me-1"
                />
                {time}
              </label>
            ))}
          </div>
          {errors.time_service && <div className="text-danger">{errors.time_service}</div>}
        </div>

        <button type="submit" className="btn btn-dark" disabled={processing || !data.time_service}>
          {processing ? 'Записываем...' : 'Записаться на ТО'}
        </button>
      </form>

      <hr />

      <h2>Мои записи</h2>
        <ul>
        {services.map(s => (
            <h4 key={s.id}>
            {s.date_service} {s.time_service} –{' '}
            {/* {s.dealer?.name ?? 'Неизвестный дилер'}  */}
            статус: {s.status_ts}
            </h4>
        ))}
        </ul>
    </div>
    <br/>
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

export default Profile;