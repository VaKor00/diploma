import React, { useState, useEffect } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };

// название модели: с заглавной буквы, дальше буквы/цифры/пробелы/-.,
const MODEL_NAME_REGEX = /^[A-ZА-ЯЁ][\p{L}0-9\s\-.,]*$/u;

function ModalEditCarModel({ show, model, onClose, onUpdate }) {
  const [form, setForm] = useState({
    model_name: '',
    length: '',
    width: '',
    height: '',
    whellbase: '',
    clearance: '',
    trunk: '',
    fuel_tank: '',
    engine_m: '',
    min_price: 0,
    img: '',
    description: '',
    description_full: '',
    salon_photo: '',
    features: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);   // общая ошибка
  const [errors, setErrors] = useState({});   // ошибки по полям

  const [salonPreview, setSalonPreview] = useState(null);
  const [salonPoints, setSalonPoints] = useState([]);
  const [activePointIndex, setActivePointIndex] = useState(null);

  useEffect(() => {
    if (show && model) {
      setError(null);
      setErrors({});

      setForm(prev => ({
        ...prev,
        model_name: model.model_name ?? '',
        length: model.length ?? '',
        width: model.width ?? '',
        height: model.height ?? '',
        whellbase: model.whellbase ?? '',
        clearance: model.clearance ?? '',
        trunk: model.trunk ?? '',
        fuel_tank: model.fuel_tank ?? '',
        engine_m: model.engine_m ?? '',
        min_price: model.min_price ?? 0,
        img: '',
        description: model.description ?? '',
        description_full: model.description_full ?? '',
        salon_photo: '',
        features: model.features ?? '',
      }));

      // парсим точки из features
      try {
        const parsed = model.features ? JSON.parse(model.features) : [];
        if (Array.isArray(parsed)) {
          setSalonPoints(parsed);
        } else {
          setSalonPoints([]);
        }
      } catch (e) {
        console.error('Ошибка парсинга features JSON', e);
        setSalonPoints([]);
      }

      setActivePointIndex(null);
      setSalonPreview(model.salon_photo_path || model.salon_photo || null);
    }
  }, [show, model]);

  // если бы мы создавали objectURL — тут бы его ревокали
  useEffect(() => {
    return () => {
      // оставляем пустым, если salonPreview — URL с сервера
    };
  }, [salonPreview]);

  if (!show || !model) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setError(null);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
    setError(null);
  };

  const handleImgFileChange = (e) => {
    const file = e.target.files[0] || null;
    setForm(prev => ({ ...prev, img: file }));
    setError(null);
  };

  const handleSalonFileChange = (e) => {
    const file = e.target.files[0] || null;

    setForm(prev => ({ ...prev, salon_photo: file }));
    setSalonPoints([]);
    setActivePointIndex(null);

    if (file) {
      try {
        const url = URL.createObjectURL(file);
        setSalonPreview(url);
      } catch (err) {
        console.error('Ошибка создания objectURL', err);
      }
    } else {
      setSalonPreview(model?.salon_photo_path || model?.salon_photo || null);
    }
    setError(null);
  };

  const handleSalonImageClick = (e) => {
    if (!salonPreview) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const xPercent = (offsetX / rect.width) * 100;
    const yPercent = (offsetY / rect.height) * 100;

    const newPoint = {
      x: Number(xPercent.toFixed(2)),
      y: Number(yPercent.toFixed(2)),
      comment: '',
    };

    setSalonPoints(prev => [...prev, newPoint]);
    setActivePointIndex(salonPoints.length);
  };

  const handlePointTextChange = (index, value) => {
    setSalonPoints(prev =>
      prev.map((p, i) => (i === index ? { ...p, comment: value } : p))
    );
  };

  const handleDeletePoint = (index) => {
    setSalonPoints(prev => prev.filter((_, i) => i !== index));
    if (activePointIndex === index) {
      setActivePointIndex(null);
    } else if (activePointIndex > index) {
      setActivePointIndex(activePointIndex - 1);
    }
  };

  const validate = () => {
    const newErrors = {};

    // model_name
    if (!form.model_name.trim()) {
      newErrors.model_name = 'Укажите название модели';
    } else if (!MODEL_NAME_REGEX.test(form.model_name.trim())) {
      newErrors.model_name =
        'Название модели должно начинаться с заглавной буквы и содержать только буквы, цифры и знаки - . ,';
    }

    // числовые поля
    ['length', 'width', 'height', 'whellbase', 'clearance', 'trunk', 'fuel_tank', 'engine_m'].forEach((field) => {
      if (form[field] && isNaN(Number(form[field]))) {
        newErrors[field] = 'Значение должно быть числом';
      }
    });

    if (form.min_price && isNaN(Number(form.min_price))) {
      newErrors.min_price = 'Цена должна быть числом';
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

      const formToSend = {
        ...form,
        features: JSON.stringify(salonPoints),
        id: model.id,
      };

      await onUpdate(formToSend);
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
        className="modal-dialog modal-xl modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Редактировать модель автомобиля</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={descst}>
              {error && <div className="text-danger mb-2">{error}</div>}

              {/* Название модели */}
              <div className="mb-3">
                <label className="form-label">Модель</label>
                <input
                  type="text"
                  className={
                    'form-control' + (errors.model_name ? ' is-invalid' : '')
                  }
                  name="model_name"
                  value={form.model_name}
                  onChange={handleChange}
                  required
                />
                {errors.model_name && (
                  <div className="invalid-feedback">{errors.model_name}</div>
                )}
              </div>

              {/* Габариты */}
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Длина, мм</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.length ? ' is-invalid' : '')
                    }
                    name="length"
                    value={form.length}
                    onChange={handleNumberChange}
                  />
                  {errors.length && (
                    <div className="invalid-feedback">{errors.length}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Ширина, мм</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.width ? ' is-invalid' : '')
                    }
                    name="width"
                    value={form.width}
                    onChange={handleNumberChange}
                  />
                  {errors.width && (
                    <div className="invalid-feedback">{errors.width}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Высота, мм</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.height ? ' is-invalid' : '')
                    }
                    name="height"
                    value={form.height}
                    onChange={handleNumberChange}
                  />
                  {errors.height && (
                    <div className="invalid-feedback">{errors.height}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Колёсная база, мм</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.whellbase ? ' is-invalid' : '')
                    }
                    name="whellbase"
                    value={form.whellbase}
                    onChange={handleNumberChange}
                  />
                  {errors.whellbase && (
                    <div className="invalid-feedback">{errors.whellbase}</div>
                  )}
                </div>
              </div>

              {/* Клиренс, багажник, бак, мотор */}
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Клиренс, мм</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.clearance ? ' is-invalid' : '')
                    }
                    name="clearance"
                    value={form.clearance}
                    onChange={handleNumberChange}
                  />
                  {errors.clearance && (
                    <div className="invalid-feedback">{errors.clearance}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Объем багажника, л</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.trunk ? ' is-invalid' : '')
                    }
                    name="trunk"
                    value={form.trunk}
                    onChange={handleNumberChange}
                  />
                  {errors.trunk && (
                    <div className="invalid-feedback">{errors.trunk}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Объем бака, л</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.fuel_tank ? ' is-invalid' : '')
                    }
                    name="fuel_tank"
                    value={form.fuel_tank}
                    onChange={handleNumberChange}
                  />
                  {errors.fuel_tank && (
                    <div className="invalid-feedback">{errors.fuel_tank}</div>
                  )}
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Мощность двигателя, л.с.</label>
                  <input
                    type="number"
                    className={
                      'form-control' + (errors.engine_m ? ' is-invalid' : '')
                    }
                    name="engine_m"
                    value={form.engine_m}
                    onChange={handleNumberChange}
                  />
                  {errors.engine_m && (
                    <div className="invalid-feedback">{errors.engine_m}</div>
                  )}
                </div>
              </div>

              {/* Цена и изображения */}
              <div className="row">
                <div className="col-md-12 mb-12">
                  <label className="form-label">Изображение модели авто</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleImgFileChange}
                  />
                  <small className="text-muted">
                    Если файл не выбран, останется текущее изображение.
                  </small>

                  <label className="form-label mt-3">
                    Изображение салона авто
                  </label>
                  <input
                    type="file"
                    name="salon_photo"
                    className="form-control"
                    accept="image/*"
                    onChange={handleSalonFileChange}
                  />
                  <small className="text-muted">
                    Если файл не выбран, останется текущее изображение.
                  </small>
                </div>
              </div>

              <br />

              {/* Превью + точки */}
              <div>
                {salonPreview ? (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '450px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={salonPreview}
                      alt="Превью салона"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 0,
                        cursor: 'crosshair',
                        display: 'block',
                      }}
                      onClick={handleSalonImageClick}
                    />

                    {salonPoints.map((point, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'absolute',
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          transform: 'translate(-50%, -50%)',
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 0, 0, 0.8)',
                          border: '2px solid #fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 10,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePointIndex(index);
                        }}
                        title={point.comment || `Точка ${index + 1}`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">
                    Превью салона появится, если загружено изображение или оно
                    уже сохранено для модели.
                  </span>
                )}
              </div>

              {/* Список точек и подписи */}
              {salonPoints.length > 0 && (
                <div className="mt-3">
                  <h6>Подписи к точкам</h6>
                  {salonPoints.map((point, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center mb-2"
                      style={{
                        background:
                          index === activePointIndex
                            ? 'rgba(0,0,0,0.03)'
                            : 'transparent',
                        padding: '4px 8px',
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ width: 28, fontWeight: 'bold' }}>
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder={`Подпись (x: ${point.x}%, y: ${point.y}%)`}
                        value={point.comment || ''}
                        onChange={(e) =>
                          handlePointTextChange(index, e.target.value)
                        }
                        onFocus={() => setActivePointIndex(index)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => handleDeletePoint(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <br />

              {/* Описания */}
              <div className="mb-3">
                <label className="form-label">Краткое описание</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows={2}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Полное описание</label>
                <textarea
                  className="form-control"
                  name="description_full"
                  rows={4}
                  value={form.description_full}
                  onChange={handleChange}
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
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalEditCarModel;