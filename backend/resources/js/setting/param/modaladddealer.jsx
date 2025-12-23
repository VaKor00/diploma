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
  phone: '',
  coord_x: '',
  coord_y: '',
};

function Modaladddealer({ show, onClose, onCreate }) {
  const [city, setItems1] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target; // "HH:MM"
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Очистка формы после успешного сохранения
  const clearForm = () => {
    setForm((prev) => ({
      ...initialForm,
      // оставляем выбранный город тем же
      city: prev.city,
      city_name: prev.city_name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!form.street.trim() || !form.home.trim()) {
        throw new Error('Укажите улицу и дом');
      }
      if (!form.name.trim()) {
        throw new Error('Укажите название дилерского центра');
      }
      if (!form.open || !form.closed) {
        throw new Error('Укажите время работы (открытие и закрытие)');
      }
      if (!form.phone.trim()) {
        throw new Error('Укажите телефон');
      }


    
      if (!form.coord_x || !form.coord_y) {

        const address = `Россия, ${form.city_name}, ${form.street}, дом ${form.home}`;
        const geoResp = await fetch(`https://geocode-maps.yandex.ru/v1/?apikey=8735c427-2256-459f-9e73-3373945da236&geocode=${address}&format=json`)
        const geo = await geoResp.json();
        const pos = geo.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos; 
        const [lon, lat] = pos.split(' ').map(Number);
        form.coord_x = lon;
        form.coord_y = lat;
      }
      
      if (!form.timezone && form.coord_x && form.coord_y) {
        const tzResp = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${form.coord_y}&lon=${form.coord_x}&format=json&apiKey=3a978ba8996b4a46acfb26c128643a84`
        );
        const tz = await tzResp.json();
        const t =  tz.results;

        const tm =  t[0];
        const tmr = tm.timezone.offset_STD_seconds;

        form.timezone = tmr;
      }


      await onCreate(form); // тут editDealer отправит запрос и обновит таблицу

      clearForm(); // очистить поля
      onClose();   // закрыть модалку
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
                  className="form-control"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Дом</label>
                <input
                  type="text"
                  className="form-control"
                  name="home"
                  value={form.home}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Название дилерского центра */}
              <div className="mb-3">
                <label className="form-label">Название дилерского центра</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Время работы */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Открытие (чч:мм)</label>
                  <input
                    type="time"
                    className="form-control"
                    name="open"
                    value={form.open ? form.open.slice(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Закрытие (чч:мм)</label>
                  <input
                    type="time"
                    className="form-control"
                    name="closed"
                    value={form.closed ? form.closed.slice(0, 5) : ''}
                    onChange={handleTimeChange}
                    required
                  />
                </div>
              </div>

              {/* Телефон */}
              <div className="mb-3">
                <label className="form-label">Телефон</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+7XXXXXXXXXX"
                  required
                />
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