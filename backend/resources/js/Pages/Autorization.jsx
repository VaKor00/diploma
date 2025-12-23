import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

import logo from '../assets/logo.svg';

const logoText = {
  fontFamily: 'TT Supermolot Neue Trial Expanded DemiBold',
  fontSize: '30px',
};
const buttons = {
  fontFamily: 'TT Supermolot Neue Trial Medium',
  fontSize: '22px',
};
const h1 = {
  fontFamily: 'TT Supermolot Neue Trial Medium',
  fontSize: '40px',
};

import { Head, Link, useForm } from '@inertiajs/react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };

function Autorization() {
  const { data, setData, post, processing, errors } = useForm({
    login: '',
    password: '',
  });

  const handleSubmit = (e) => {
  e.preventDefault();
  post('/login');
};

  return (
    <div className="App" style={descst}>
      <Head title="Авторизация" />

      {/* шапка */}
      <header className="bg-dark" style={{ position: 'relative' }}>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <Link className="navbar-brand text-light" href="/" style={logoText}>
              <img
                src={logo}
                style={{ width: '35px', height: '35px', marginTop: '-5px', marginRight: '10px' }}
                alt="logo"
              />
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
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
              style={buttons}
            >
              <ul className="navbar-nav custom-right-align"></ul>
            </div>
          </nav>
        </div>
      </header>

      {/* тело */}
      <main className="py-5">
        <div className="container">
          <h1 style={h1} className="mb-4 text-center">
            Вход в систему
          </h1>

          <div className="row justify-content-center">
            <div className="col-md-4">
              <form onSubmit={handleSubmit}>
                {/* общая ошибка логина */}
                {errors.login && (
                  <div className="alert alert-danger">
                    {errors.login}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Логин (VIN номер Вашего авто)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.login}
                    onChange={(e) => setData('login', e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100" disabled={processing}>
                  {processing ? 'Входим...' : 'Войти'}
                </button>
              </form>
              <div className="mt-3 text-center">
                <br/>
                <Link href="/register">Зарегистрироваться</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Autorization;