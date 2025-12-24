import React, { useEffect, useState } from 'react';

const descst = { fontFamily: "TT Supermolot Neue Trial Medium" };
const tab = { fontSize: "20px", width: "100%" };

function EditSlide() {
  // вставка слайдов в редактор
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSlide, setSelectedSlide] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // новое: модалка добавления
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    descript: '',
    button: '',
    link: '',
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [nameError, setNameError] = useState(null);

  // модалка удаления
  const [slideToDelete, setSlideToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // редактирование слайдов
  const [slideToEdit, setSlideToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    descript: '',
    button: '',
    link: '',
  });
  const [editFile, setEditFile] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editNameError, setEditNameError] = useState(null);

  // ======== ВАЛИДАЦИЯ НАЗВАНИЯ СЛАЙДА =========
  // Только русские буквы, дефис, пробел; нельзя начинать/заканчивать пробелом или дефисом.
  // Первая буква делается заглавной.
  const normalizeAndValidateName = (raw) => {
    if (!raw) {
      return { value: '', error: 'Название не может быть пустым' };
    }

    // Заменяем несколько пробелов на один, но не обрезаем сразу,
    // чтобы пользователь видел, что набрал в начале пробел, если так.
    let value = raw.replace(/\s+/g, ' ');

    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      return { value, error: 'Название не может быть пустым' };
    }

    // Только русские буквы (включая Ё/ё), пробел и дефис
    const allowedPattern = /^[A-Za-zА-Яа-яЁё0-9 -]+$/;
    if (!allowedPattern.test(trimmedValue)) {
      return {
        value,
        error: 'Допустимы только русские буквы, латиница, цифры, пробел и дефис'
      };
    }

    // Нельзя начинать или заканчивать пробелом/дефисом
    if (/^[\s-]/.test(value) || /[\s-]$/.test(value)) {
      return {
        value,
        error: 'Название не может начинаться или заканчиваться пробелом или дефисом',
      };
    }

    // Первая буква заглавная
    const first = trimmedValue.charAt(0).toUpperCase();
    const rest = trimmedValue.slice(1);
    const normalized = first + rest;

    // В инпут будем возвращать уже нормализованное значение без крайних пробелов
    return { value: normalized, error: null };
  };

  // ======== ЗАГРУЗКА СЛАЙДОВ =========
  useEffect(() => {
    fetch('/api/carousel')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки слайдов');
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

  // ======== ПРОСМОТР ИЗОБРАЖЕНИЯ =========
  const handleOpenImage = (slide) => {
    setSelectedSlide(slide);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedSlide(null);
  };

  // ======== УДАЛЕНИЕ СЛАЙДА =========
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
      const res = await fetch(`/api/carousel/${slideToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления слайда');
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

  // ======== ДОБАВЛЕНИЕ СЛАЙДА =========
  const handleOpenAddModal = () => {
    setForm({
      name: '',
      descript: '',
      button: '',
      link: '',
    });
    setFile(null);
    setSaveError(null);
    setNameError(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (saving) return;
    setShowAddModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const { value: normalized, error } = normalizeAndValidateName(value);
      setForm((prev) => ({ ...prev, [name]: normalized }));
      setNameError(error);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0] || null;
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Финальная проверка названия перед отправкой
    const { value: normalizedName, error } = normalizeAndValidateName(form.name);
    if (error) {
      setNameError(error);
      setForm((prev) => ({ ...prev, name: normalizedName }));
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      if (!file) {
        throw new Error('Выберите файл изображения');
      }

      const fd = new FormData();
      fd.append('name', normalizedName);
      fd.append('descript', form.descript);
      fd.append('button', form.button);
      fd.append('link', form.link);
      fd.append('img', file);

      const res = await fetch('/api/carousel', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка сохранения слайда');
      }

      const newSlide = await res.json();
      setSlides((prev) => [...prev, newSlide]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ======== РЕДАКТИРОВАНИЕ СЛАЙДА =========
  const handleOpenEditModal = (slide) => {
    setSlideToEdit(slide);
    setEditForm({
      name: slide.name ?? '',
      descript: slide.descript ?? '',
      button: slide.button ?? '',
      link: slide.link ?? '',
    });
    setEditFile(null);
    setEditError(null);
    setEditNameError(null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (editSaving) return;
    setShowEditModal(false);
    setSlideToEdit(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const { value: normalized, error } = normalizeAndValidateName(value);
      setEditForm((prev) => ({ ...prev, [name]: normalized }));
      setEditNameError(error);
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditFileChange = (e) => {
    const f = e.target.files[0] || null;
    setEditFile(f);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!slideToEdit) return;

    // Финальная проверка названия
    const { value: normalizedName, error } = normalizeAndValidateName(editForm.name);
    if (error) {
      setEditNameError(error);
      setEditForm((prev) => ({ ...prev, name: normalizedName }));
      return;
    }

    setEditSaving(true);
    setEditError(null);

    try {
      const fd = new FormData();
      fd.append('name', normalizedName);
      fd.append('descript', editForm.descript);
      fd.append('button', editForm.button);
      fd.append('link', editForm.link);

      if (editFile) {
        fd.append('img', editFile);
      }

      const res = await fetch(`/api/carousel/${slideToEdit.id}`, {
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'PUT',
        },
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка обновления слайда');
      }

      const updated = await res.json();
      setSlides((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );

      setShowEditModal(false);
      setSlideToEdit(null);
    } catch (err) {
      console.error(err);
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <>
      <div style={descst} className="p-3">
        <h3>Слайдеры</h3>
        <hr />
        <h4>Список слайдов</h4>
        <br />

        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <table style={tab} className="table table-striped">
              <thead>
                <tr className="table-dark">
                  <td style={{ width: '5%' }}>#</td>
                  <td style={{ width: '20%' }}>Заголовок</td>
                  <td style={{ width: '30%' }}>Описание</td>
                  <td style={{ width: '15%' }}>Кнопка</td>
                  <td style={{ width: '15%' }}>Ссылка</td>
                  <td style={{ width: '15%' }}></td>
                </tr>
              </thead>

              <tbody>
                {slides.map((slide, index) => (
                  <tr key={slide.id ?? index}>
                    <td>{slide.id}</td>
                    <td>{slide.name}</td>
                    <td>{slide.descript}</td>
                    <td>{slide.button}</td>
                    <td>{slide.link}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleOpenImage(slide)}
                      >
                        <i className="bi bi-card-image" />
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleOpenEditModal(slide)}
                      >
                        <i className="bi bi-pencil-fill" />
                      </button>
                      &nbsp;
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleOpenDeleteModal(slide)}
                      >
                        <i className="bi bi-x-lg" />
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

        {/* Модальное окно превью изображения */}
        {showViewModal && selectedSlide && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={handleCloseViewModal}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedSlide.title || 'Просмотр изображения'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseViewModal}
                  />
                </div>
                <div className="modal-body text-center">
                  <img
                    src={selectedSlide.img}
                    alt={selectedSlide.title || 'Изображение'}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseViewModal}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно добавления слайда */}
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
                  <h5 className="modal-title">Добавить слайд</h5>
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
                      <label className="form-label">Заголовок</label>
                      <input
                        type="text"
                        className={`form-control ${
                          nameError ? 'is-invalid' : ''
                        }`}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                      {nameError && (
                        <div className="invalid-feedback">{nameError}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Описание</label>
                      <textarea
                        className="form-control"
                        name="descript"
                        rows="3"
                        value={form.descript}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Текст кнопки</label>
                      <input
                        type="text"
                        className="form-control"
                        name="button"
                        value={form.button}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Ссылка</label>
                      <input
                        type="text"
                        className="form-control"
                        name="link"
                        value={form.link}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Изображение</label>
                      <input
                        type="file"
                        className="form-control"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={handleFileChange}
                        required
                      />
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
                      disabled={saving}
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно редактирования слайда */}
        {showEditModal && slideToEdit && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={handleCloseEditModal}
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Редактировать слайд #{slideToEdit.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseEditModal}
                  />
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    {editError && (
                      <div className="text-danger mb-2">{editError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Заголовок</label>
                      <input
                        type="text"
                        className={`form-control ${
                          editNameError ? 'is-invalid' : ''
                        }`}
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        required
                      />
                      {editNameError && (
                        <div className="invalid-feedback">
                          {editNameError}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Описание</label>
                      <textarea
                        className="form-control"
                        name="descript"
                        rows="3"
                        value={editForm.descript}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Текст кнопки</label>
                      <input
                        type="text"
                        className="form-control"
                        name="button"
                        value={editForm.button}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Ссылка</label>
                      <input
                        type="text"
                        className="form-control"
                        name="link"
                        value={editForm.link}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Изображение</label>
                      <div className="mb-2">
                        {slideToEdit.img && (
                          <img
                            src={slideToEdit.img}
                            alt={slideToEdit.name || 'Текущее изображение'}
                            style={{
                              maxWidth: '150px',
                              maxHeight: '80px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                        onChange={handleEditFileChange}
                      />
                      <div className="form-text">
                        Если не выбирать файл, останется текущее изображение.
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseEditModal}
                      disabled={editSaving}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editSaving}
                    >
                      {editSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно удаления слайда */}
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
                  <h5 className="modal-title">
                    Удалить слайд #{slideToDelete.id}?
                  </h5>
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

                  <p>Вы действительно хотите удалить этот слайд?</p>
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

export default EditSlide;