import React, { useEffect, useState } from 'react';

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
    phone: '',
    coord_x: '',
    coord_y: '',
  });

  // ВАЖНО: добавляем стейты для saving и error
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && dealer) {
      setForm({
        id: dealer.id,               // ВАЖНО!
        city: dealer.city,
        city_name: dealer.city_name,
        street: dealer.street || '',
        home: dealer.home || '',
        name: dealer.name || '',
        open: dealer.open || '',
        closed: dealer.closed || '',
        timezone: dealer.timezone || '',
        phone: dealer.phone || '',
        coord_x: dealer.coord_x || '',
        coord_y: dealer.coord_y || '',
      });
      setError(null);
    }
  }, [show, dealer]);

  if (!show || !dealer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target; // "HH:MM"
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // если нужно пересчитать координаты по адресу
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
      if (pos) {
        const [lon, lat] = pos.split(' ').map(Number);
        form.coord_x = lat; // широта
        form.coord_y = lon; // долгота
      }

      if (!form.street.trim() || !form.home.trim()) {
        throw new Error('Укажите улицу и дом');
      }
      if (!form.name.trim()) {
        throw new Error('Укажите название дилерского центра');
      }
      if (!form.open || !form.closed) {
        throw new Error('Укажите время работы');
      }
      if (!form.phone.trim()) {
        throw new Error('Укажите телефон');
      }

      await onSave(form); // вызывает handleEditDealer в EditDealer

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

export default Modaleditdealer;