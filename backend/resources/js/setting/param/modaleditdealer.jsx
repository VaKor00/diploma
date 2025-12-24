import React, { useEffect, useState } from 'react';

// РЕГУЛЯРКИ — те же, что и в Modaladddealer
const NAME_REGEX = /^[A-ZА-ЯЁ][\p{L}0-9\s\-.,]*$/u;
const STREET_REGEX =
  /^(улица|проспект|переулок|бульвар|шоссе|проезд)\s+[A-ZА-ЯЁ][\p{L}0-9\s\-.,]*$/u;
const HOME_REGEX =
  /^[A-ZА-ЯЁ0-9/]+(?:\s+(?:корпус|строение)\s+[A-ZА-ЯЁ0-9/]+)?$/u;
const PHONE_REGEX = /^\+7[3489]\d{9}$/; // +7 и ещё 10 цифр, первая 3/4/8/9

function Modaleditdealer({ show, onClose, onSave, dealer }) {
  const [form, setForm] = useState({
    id: '',
    city: '',
    city_name: '',
    street: '',
    home: '',
    name: '',
    open: '',
    closed: '',
    timezone: '',
    phone: '+7',
    coord_x: '',
    coord_y: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);   // общая ошибка
  const [errors, setErrors] = useState({});   // ошибки по полям

  useEffect(() => {
    if (show && dealer) {
      setForm({
        id: dealer.id,
        city: dealer.city,
        city_name: dealer.city_name,
        street: dealer.street || '',
        home: dealer.home || '',
        name: dealer.name || '',
        open: dealer.open || '',
        closed: dealer.closed || '',
        timezone: dealer.timezone || '',
        phone: dealer.phone && dealer.phone.startsWith('+7')
          ? dealer.phone
          : '+7', // гарантируем +7
        coord_x: dealer.coord_x || '',
        coord_y: dealer.coord_y || '',
      });
      setError(null);
      setErrors({});
    }
  }, [show, dealer]);

  if (!show || !dealer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // специальная обработка телефона, как в Modaladddealer
    if (name === 'phone') {
      let v = value.replace(/[^\d+]/g, ''); // оставляем только цифры и +
      if (!v.startsWith('+7')) {
        v = '+7' + v.replace(/^\+?7?/, '');
      }
      if (v.length > 12) v = v.slice(0, 12); // +7 + 10 цифр
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

    // проверка open < closed
    if (form.open && form.closed) {
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

      // пересчитать координаты по адресу
      const address = `Россия, ${form.city_name}, ${form.street}, дом ${form.home}`;
      const geoResp = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=8735c427-2256-459f-9e73-3373945da236&format=json&geocode=${encodeURIComponent(
          address
        )}`
      );
      if (!geoResp.ok) {
        throw new Error('Ошибка геокодера Яндекса');
      }
      const geo = await geoResp.json();
      const member =
        geo.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject;
      const pos = member?.Point?.pos; // "долгота широта"
      let formToSave = { ...form };

      if (pos) {
        const [lon, lat] = pos.split(' ').map(Number);
        formToSave = {
          ...formToSave,
          coord_x: lon, // широта
          coord_y: lat, // долгота
        };
      }

      await onSave(formToSave);
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
            <h5 className="modal-title">Редактировать дилерский центр</h5>
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

export default Modaleditdealer;