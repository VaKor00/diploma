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

function Register() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    login: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <div className="App" style={descst}>
      <Head title="Регистрация" />

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
          </nav>
        </div>
      </header>

      {/* тело */}
      <main className="py-5">
        <div className="container">
          <h1 style={h1} className="mb-4 text-center">
            Регистрация клиента
          </h1>

          <div className="row justify-content-center">
            <div className="col-md-4">
              <form onSubmit={handleSubmit}>
                {/* ошибки общие */}
                {errors.login && (
                  <div className="alert alert-danger">{errors.login}</div>
                )}

                <div className="mb-3">
                  <label className="form-label">Имя</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.first_name}
                    onChange={(e) => setData('first_name', e.target.value)}
                    required
                  />
                  {errors.first_name && (
                    <div className="text-danger">{errors.first_name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Фамилия</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.last_name}
                    onChange={(e) => setData('last_name', e.target.value)}
                    required
                  />
                  {errors.last_name && (
                    <div className="text-danger">{errors.last_name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">VIN номер Вашего авто</label>
                  <input
                    type="text"
                    className={`form-control ${errors.login ? 'is-invalid' : 'Некорректный VIN номер'}`}
                    value={data.login}
                    onChange={(e) => setData('login', e.target.value)}
                    required
                  />
                  {errors.login && <div className="invalid-feedback">{errors.login}</div>}
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
                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Подтверждение пароля</label>
                  <input
                    type="password"
                    className="form-control"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark w-100" disabled={processing}>
                  {processing ? 'Регистрируем...' : 'Зарегистрироваться'}
                </button>

                <div className="mt-3 text-center">
                  Уже есть аккаунт?{' '}
                  <Link href="/autorization">Войти</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;