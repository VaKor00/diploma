import React, { useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

const buttons = { fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px" };
const descst  = { fontFamily: "TT Supermolot Neue Trial Medium" };
const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}

function AddAuto() {

  const { props } = usePage();
  const dealerId = props.dealerId;

  const [models, setModels] = useState([]);
  const [complectations, setComplectations] = useState([]);
  const [colors, setColors] = useState([]);

  const [form, setForm] = useState({
    model_id: '',
    complectation_id: '',
    color_id: '',
    vin: '',
    price: '',
    status: 0,
  });

  const [images, setImages] = useState({
    img_1: null,
    img_2: null,
    img_3: null,
    img_4: null,
    img_5: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState('');

  // Загрузка моделей
  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data))
      .catch(console.error);
  }, []);

  // Загрузка цветов
  useEffect(() => {
    fetch('/api/colors')
      .then(res => res.json())
      .then(data => setColors(data))
      .catch(console.error);
  }, []);

  // Загрузка комплектаций по выбранной модели
  useEffect(() => {
    if (!form.model_id) {
      setComplectations([]);
      setForm(prev => ({ ...prev, complectation_id: '' }));
      return;
    }

    fetch('/api/complectation')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(c => c.model_id === Number(form.model_id));
        setComplectations(filtered);
      })
      .catch(console.error);
  }, [form.model_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages(prev => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setLoading(true);

    try {
      if (!dealerId) {
        setErrors({ dealer_id: 'Не найден dealer_id. Перезайдите в систему.' });
        setLoading(false);
        return;
      }

      if (!form.model_id || !form.complectation_id || !form.color_id || !form.vin || !form.price) {
        setErrors({ form: 'Заполните все обязательные поля.' });
        setLoading(false);
        return;
      }

      if (!images.img_1) {
        setErrors({ img_1: 'Минимум одно изображение обязательно (img_1).' });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('model_id',         form.model_id);
      formData.append('complectation_id', form.complectation_id);
      formData.append('color_id',         form.color_id);
      formData.append('vin',              form.vin);
      formData.append('dealer_id',        dealerId);
      formData.append('price',            form.price);
      formData.append('status',           0);

      if (images.img_1) formData.append('img_1', images.img_1);
      if (images.img_2) formData.append('img_2', images.img_2);
      if (images.img_3) formData.append('img_3', images.img_3);
      if (images.img_4) formData.append('img_4', images.img_4);
      if (images.img_5) formData.append('img_5', images.img_5);

      const tokenTag = document.querySelector('meta[name="csrf-token"]');

      const response = await fetch('/dealer/cars', {
        method: 'POST',
        headers: tokenTag ? { 'X-CSRF-TOKEN': tokenTag.content } : {},
        body: formData,
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrors(data.errors || { general: 'Ошибка при сохранении.' });
      } else {
        setSuccess('Автомобиль успешно добавлен.');
        // очистка формы
        setForm({
          model_id: '',
          complectation_id: '',
          color_id: '',
          vin: '',
          price: '',
          status: 0,
        });
        setImages({
          img_1: null,
          img_2: null,
          img_3: null,
          img_4: null,
          img_5: null,
        });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Произошла ошибка. Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={descst}>
      <Head title="Добавить авто" />
      <h2 style={h1} className="mb-4">Добавить автомобиль</h2>

      {errors.form && (
        <div className="alert alert-danger">{errors.form}</div>
      )}
      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}
      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Модель */}
        <div className="mb-3">
          <label className="form-label">Модель *</label>
          <select
            name="model_id"
            className="form-select"
            value={form.model_id}
            onChange={handleChange}
          >
            <option value="">Выберите модель</option>
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.model_name}
              </option>
            ))}
          </select>
        </div>

        {/* Комплектация */}
        <div className="mb-3">
          <label className="form-label">Комплектация *</label>
          <select
            name="complectation_id"
            className="form-select"
            value={form.complectation_id}
            onChange={handleChange}
            disabled={!form.model_id}
          >
            <option value="">Выберите комплектацию</option>
            {complectations.map(comp => (
              <option key={comp.id} value={comp.id}>
                {comp.complectation_name}
              </option>
            ))}
          </select>
        </div>

        {/* Цвет */}
        <div className="mb-3">
          <label className="form-label">Цвет *</label>
          <select
            name="color_id"
            className="form-select"
            value={form.color_id}
            onChange={handleChange}
          >
            <option value="">Выберите цвет</option>
            {colors.map(color => (
              <option key={color.id} value={color.id}>
                {color.color_name}
              </option>
            ))}
          </select>
        </div>

        {/* VIN */}
        <div className="mb-3">
          <label className="form-label">VIN *</label>
          <input
            type="text"
            name="vin"
            className="form-control"
            value={form.vin}
            onChange={handleChange}
          />
        </div>

        {/* Цена */}
        <div className="mb-3">
          <label className="form-label">Цена, ₽ *</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        {/* Изображения */}
        <div className="mb-3">
          <label className="form-label">Изображения</label>
          <div className="mb-2">
            <label className="form-label">Изображение 1 (обязательно)</label>
            <input
              type="file"
              name="img_1"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.img_1 && <div className="text-danger">{errors.img_1}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Изображение 2</label>
            <input
              type="file"
              name="img_2"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Изображение 3</label>
            <input
              type="file"
              name="img_3"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Изображение 4</label>
            <input
              type="file"
              name="img_4"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Изображение 5</label>
            <input
              type="file"
              name="img_5"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* dealer_id и статус просто сохраняем на бэке, здесь не показываем */}
        <button
          type="submit"
          className="btn btn-dark"
          style={buttons}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Добавить авто'}
        </button>
      </form>
    </div>
  );
}

export default AddAuto;
