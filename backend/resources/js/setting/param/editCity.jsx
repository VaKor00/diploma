import React, { useEffect, useState } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

// Регулярка для названия города
const cityRegex =
  /^(?!(?:.*[ -]){3,})[А-ЯЁ][а-яё]+(?: [А-ЯЁ][а-яё]+)*(?:-[А-ЯЁа-яё]+)*$/;

function EditCity() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    city: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // ошибка именно валидации города (регулярка)
  const [cityError, setCityError] = useState('');

  const [slideToDelete, setSlideToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleOpenDeleteModal = (slide) => {
    setSlideToDelete(slide);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteSaving) return;
    setShowDeleteModal(false);
    setSlideToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!slideToDelete) return;

    setDeleteSaving(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/city/${slideToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления города');
      }

      setSlides((prev) => prev.filter((s) => s.id !== slideToDelete.id));
      setShowDeleteModal(false);
      setSlideToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError(err.message);
    } finally {
      setDeleteSaving(false);
    }
  };

  useEffect(() => {
    fetch('/api/city')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки городов');
        return res.json();
      })
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleOpenAddModal = () => {
    setForm({
      city: '',
    });
    setCityError('');
    setSaveError(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (saving) return;
    setShowAddModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // общая логика обновления формы
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'city') {
      const val = value.trim();

      if (!val) {
        setCityError('Заполните название города');
      } else if (!cityRegex.test(val)) {
        setCityError(
          'Неверный формат. Пример: "Нижний Новгород", "Ростов-на-Дону". ' +
            'Первая буква заглавная, не более двух пробелов/дефисов.',
        );
      } else {
        setCityError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const trimmedCity = form.city.trim();

      if (!trimmedCity) {
        throw new Error('Заполните город');
      }

      if (!cityRegex.test(trimmedCity)) {
        throw new Error(
          'Неверный формат города. Пример: "Нижний Новгород", "Ростов-на-Дону".',
        );
      }

      const fd = new FormData();
      fd.append('city', trimmedCity);

      const res = await fetch('/api/city', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // обработка дубликата (зависит от того, что вернёт бэкенд)
        if (res.status === 409 || data.code === 'CITY_ALREADY_EXISTS') {
          throw new Error('Такой город уже существует');
        }

        throw new Error(data.message || 'Ошибка сохранения города');
      }

      const newSlide = data;
      setSlides((prev) => [...prev, newSlide]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isSubmitDisabled =
    saving || !form.city.trim() || Boolean(cityError);

  return (
    <>
      <div style={descst} className="p-3">
        <h4>Список городов</h4>
        <br />

        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <table style={tab} className="table table-striped">
              <thead>
                <tr className="table-dark">
                  <td style={{ width: '80%' }}>Город</td>
                  <td style={{ width: '20%' }}></td>
                </tr>
              </thead>

              <tbody>
                {slides.map((slide, index) => (
                  <tr key={slide.id ?? index}>
                    <td>{slide.city}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleOpenDeleteModal(slide)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row">
              <div className="col-9"></div>
              <div className="col-3">
                <button
                  style={tab}
                  type="button"
                  className="w-100 btn btn-sm btn-dark rounded-0"
                  onClick={handleOpenAddModal}
                >
                  Добавить
                </button>
              </div>
            </div>
          </>
        )}

        {/* Модальное окно добавления города */}
        {showAddModal && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={handleCloseAddModal}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Добавить город</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseAddModal}
                  />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {saveError && (
                      <div className="text-danger mb-2">{saveError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Название города</label>
                      <input
                        type="text"
                        className={`form-control ${
                          cityError ? 'is-invalid' : ''
                        }`}
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                      />
                      {cityError && (
                        <div className="invalid-feedback">{cityError}</div>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseAddModal}
                      disabled={saving}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitDisabled}
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно удаления города */}
        {showDeleteModal && slideToDelete && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={handleCloseDeleteModal}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Удалить город?</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseDeleteModal}
                    disabled={deleteSaving}
                  />
                </div>

                <div className="modal-body">
                  {deleteError && (
                    <div className="text-danger mb-2">{deleteError}</div>
                  )}

                  <p>Вы действительно хотите удалить город?</p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseDeleteModal}
                    disabled={deleteSaving}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmDelete}
                    disabled={deleteSaving}
                  >
                    {deleteSaving ? 'Удаление...' : 'Удалить'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditCity;