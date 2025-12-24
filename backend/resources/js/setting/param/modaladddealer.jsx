import React, { useEffect, useState } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };

const initialForm = {
  city: '',
  city_name: '',
  street: '',
  home: '',
  name: '',
  open: '',
  closed: '',
  timezone: '',
  phone: '+7',           // <<< сразу +7
  coord_x: '',
  coord_y: '',
};

// РЕГУЛЯРКИ
const NAME_REGEX = /^[A-ZА-ЯЁ][\p{L}0-9\s\-.,]*$/u;
const STREET_REGEX =
  /^(улица|проспект|переулок|бульвар|шоссе|проезд)\s+[A-ZА-ЯЁ][\p{L}0-9\s\-.,]*$/u;
const HOME_REGEX =
  /^[A-ZА-ЯЁ0-9/]+(?:\s+(?:корпус|строение)\s+[A-ZА-ЯЁ0-9/]+)?$/u;

// <<< телефон: +7 и еще 10 цифр, первая из них 3/4/8/9
const PHONE_REGEX = /^\+7[3489]\d{9}$/;

function Modaladddealer({ show, onClose, onCreate }) {
  const [city, setItems1] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);       // общая ошибка (сервер/логика)
  const [errors, setErrors] = useState({});       // ошибки по полям

  // Загрузка городов
  useEffect(() => {
    fetch('/api/city')
      .then((res) => res.json())
      .then((data) => {
        setItems1(data);
      })
      .catch(console.error);
  }, []);

  // Устанавливаем первый город, как только загрузили города
  useEffect(() => {
    if (city.length > 0) {
      const firstCity = city[0];
      setSelectedCityId(firstCity.id);
      setForm((prev) => ({
        ...prev,
        city: firstCity.id,
        city_name: firstCity.city,
      }));
    }
  }, [city]);

  const handleCityChange = (event) => {
    const cityID = parseInt(event.target.value, 10);
    setSelectedCityId(cityID);
    const selectedCity = city.find((c) => c.id === cityID);

    setForm((prev) => ({
      ...prev,
      city: cityID,
      city_name: selectedCity ? selectedCity.city : '',
    }));
  };

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // <<< специальная обработка телефона
    if (name === 'phone') {
      // гарантируем префикс +7
      let v = value.replace(/[^\d+]/g, ''); // убираем всё, кроме цифр и +
      if (!v.startsWith('+7')) {
        // пользователь пытается стереть/переписать — насильно вернём +7
        v = '+7' + v.replace(/^\+?7?/, '');
      }
      // обрезаем до +7 + 10 цифр максимум
      if (v.length > 12) v = v.slice(0, 12);
      setForm((prev) => ({ ...prev, phone: v }));
      setErrors((prev) => ({ ...prev, phone: null }));
      setError(null);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setError(null);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target; // "HH:MM"
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setError(null);
  };

  // Очистка формы после успешного сохранения
  const clearForm = () => {
    setForm((prev) => ({
      ...initialForm,
      // оставляем выбранный город тем же
      city: prev.city,
      city_name: prev.city_name,
    }));
    setErrors({});
    setError(null);
  };

  const validate = () => {
    const newErrors = {};

    // street
    if (!form.street.trim()) {
      newErrors.street = 'Укажите улицу';
    } else if (!STREET_REGEX.test(form.street.trim())) {
      newErrors.street =
        'Адрес должен начинаться со слова: улица, проспект, переулок, бульвар, шоссе или проезд, затем пробел и название с заглавной буквы.';
    }

    // home
    if (!form.home.trim()) {
      newErrors.home = 'Укажите номер дома';
    } else if (!HOME_REGEX.test(form.home.trim())) {
      newErrors.home =
        'Дом может содержать только заглавные буквы, цифры, "/", а также слова "корпус" и "строение" с номером.';
    }

    // name
    if (!form.name.trim()) {
      newErrors.name = 'Укажите название дилерского центра';
    } else if (!NAME_REGEX.test(form.name.trim())) {
      newErrors.name =
        'Название должно начинаться с заглавной буквы и содержать только буквы, цифры и знаки - . ,';
    }

    // время
    if (!form.open) {
      newErrors.open = 'Укажите время открытия';
    }
    if (!form.closed) {
      newErrors.closed = 'Укажите время закрытия';
    }

    // <<< проверка open < closed
    if (form.open && form.closed) {
      // сравниваем строки HH:MM — можно привести к минутам
      const [oh, om] = form.open.split(':').map(Number);
      const [ch, cm] = form.closed.split(':').map(Number);
      const openMinutes = oh * 60 + om;
      const closedMinutes = ch * 60 + cm;

      if (openMinutes >= closedMinutes) {
        newErrors.open = 'Время открытия должно быть меньше времени закрытия';
        newErrors.closed = 'Время закрытия должно быть больше времени открытия';
      }
    }

    // телефон
    const phone = form.phone.trim();
    if (!phone) {
      newErrors.phone = 'Укажите телефон';
    } else if (!PHONE_REGEX.test(phone)) {
      newErrors.phone =
        'Телефон должен быть в формате +7XXXXXXXXXX, где после +7 цифра 3, 4, 8 или 9.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!validate()) {
        throw new Error('Исправьте ошибки в форме');
      }

      // Координаты
      if (!form.coord_x || !form.coord_y) {
        const address = `Россия, ${form.city_name}, ${form.street}, дом ${form.home}`;
        const geoResp = await fetch(
          `https://geocode-maps.yandex.ru/v1/?apikey=8735c427-2256-459f-9e73-3373945da236&geocode=${address}&format=json`
        );
        if (!geoResp.ok) {
          throw new Error('Ошибка геокодера Яндекса');
        }
        const geo = await geoResp.json();
        const pos =
          geo.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.Point
            ?.pos;

        if (pos) {
          const [lon, lat] = pos.split(' ').map(Number);
          form.coord_x = lon;
          form.coord_y = lat;
        } else {
          throw new Error('Не удалось определить координаты по адресу');
        }
      }

      // Таймзона
      if (!form.timezone && form.coord_x && form.coord_y) {
        const tzResp = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${form.coord_y}&lon=${form.coord_x}&format=json&apiKey=3a978ba8996b4a46acfb26c128643a84`
        );
        if (!tzResp.ok) {
          throw new Error('Ошибка определения часового пояса');
        }
        const tz = await tzResp.json();
        const t = tz.results;
        if (t && t[0] && typeof t[0].timezone?.offset_STD_seconds !== 'undefined') {
          const tmr = t[0].timezone.offset_STD_seconds;
          form.timezone = tmr;
        }
      }

      await onCreate(form);

      clearForm();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex={-1}
      onClick={() => !saving && onClose()}
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Добавить дилерский центр</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="text-danger mb-2">{error}</div>}

              {/* Город */}
              <div className="mb-3">
                <label className="form-label">Город</label>
                <select
                  className="form-select mb-3 w-100 p-2"
                  style={descst}
                  value={selectedCityId}
                  onChange={handleCityChange}
                >
                  {city.map((item) => (
                    <option className="text-dark" value={item.id} key={item.id}>
                      {item.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Адрес */}
              <div className="mb-3">
                <label className="form-label">Улица</label>
                <input
                  type="text"
                  className={
                    'form-control' + (errors.street ? ' is-invalid' : '')
                  }
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
                {errors.street && (
                  <div className="invalid-feedback">{errors.street}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Дом</label>
                <input
                  type="text"
                  className={'form-control' + (errors.home ? ' is-invalid' : '')}
                  name="home"
                  value={form.home}
                  onChange={handleChange}
                  required
                />
                {errors.home && (
                  <div className="invalid-feedback">{errors.home}</div>
                )}
              </div>

              {/* Название дилерского центра */}
              <div className="mb-3">
                <label className="form-label">Название дилерского центра</label>
                <input
                  type="text"
                  className={'form-control' + (errors.name ? ' is-invalid' : '')}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Время работы */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Открытие (чч:мм)</label>
                  <input
                    type="time"
                    className={
                      'form-control' + (errors.open ? ' is-invalid' : '')
                    }
                    name="open"
                    value={form.open ? form.open.slice(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  />
                  {errors.open && (
                    <div className="invalid-feedback">{errors.open}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Закрытие (чч:мм)</label>
                  <input
                    type="time"
                    className={
                      'form-control' + (errors.closed ? ' is-invalid' : '')
                    }
                    name="closed"
                    value={form.closed ? form.closed.slice(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  />
                  {errors.closed && (
                    <div className="invalid-feedback">{errors.closed}</div>
                  )}
                </div>
              </div>

              {/* Телефон */}
              <div className="mb-3">
                <label className="form-label">Телефон</label>
                <input
                  type="text"
                  className={
                    'form-control' + (errors.phone ? ' is-invalid' : '')
                  }
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7XXXXXXXXXX"
                  required
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Отмена
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modaladddealer;