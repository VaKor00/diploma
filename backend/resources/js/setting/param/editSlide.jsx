import React, { useEffect, useState } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"} 

const tab = {fontSize: "20px", width: "100%"} 

function editSlide() {

    // вставка слайдов в редактов
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

    // модалка удаления

    // удаление слайда
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
        // Вариант 1: настоящий DELETE
        const res = await fetch(`/api/carousel/${slideToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Ошибка удаления слайда');
        }

        // убираем из списка
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

  const handleOpenImage = (slide) => {
    setSelectedSlide(slide);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedSlide(null);
  };

    const handleOpenAddModal = () => {
    setForm({
        name: '',
        descript: '',
        button: '',
        link: '',
    });
    setFile(null);
    setSaveError(null);
    setShowAddModal(true);
    };

    const handleCloseAddModal = () => {
    if (saving) return;
    setShowAddModal(false);
    };

    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
    const f = e.target.files[0] || null;
    setFile(f);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
        if (!file) {
        throw new Error('Выберите файл изображения');
        }

        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('descript', form.descript);
        fd.append('button', form.button);
        fd.append('link', form.link);
        fd.append('img', file); // имя поля для файла

        const res = await fetch('/api/carousel', {
        method: 'POST',
        body: fd, // НЕ указываем Content-Type — браузер сам поставит multipart/form-data
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
    setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        if (editSaving) return;
        setShowEditModal(false);
        setSlideToEdit(null);
        };

        const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
        };

        const handleEditFileChange = (e) => {
        const f = e.target.files[0] || null;
        setEditFile(f);
        };

        const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!slideToEdit) return;

    setEditSaving(true);
    setEditError(null);

    try {
        const fd = new FormData();
        fd.append('name', editForm.name);
        fd.append('descript', editForm.descript);
        fd.append('button', editForm.button);
        fd.append('link', editForm.link);

        // новый файл опционально
        if (editFile) {
        fd.append('img', editFile);
        }

        const res = await fetch(`/api/carousel/${slideToEdit.id}`, {
        method: 'POST', // Laravel может принять через POST + метод-спуфер
        headers: {
            'X-HTTP-Method-Override': 'PUT', // или используйте прямой PUT без headers
        },
        body: fd,
        });

        // если используете прямой PUT, уберите headers и поставьте method: 'PUT'

        if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка обновления слайда');
        }

        const updated = await res.json();

        // обновляем локальное состояние
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

    return(
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
                        <td className='text-end'>
                            {/* тут можно потом сделать кнопку "Открыть" или превью */}
                            <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => handleOpenImage(slide)}
                            >
                            <i class="bi bi-card-image"></i>
                            </button>
                            &nbsp;
                            <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => handleOpenEditModal(slide)}
                            >
                            <i class="bi bi-pencil-fill"></i>
                            </button>
                            &nbsp;
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
                    <button type="button" className="btn-close" onClick={handleCloseViewModal} />
                  </div>
                  <div className="modal-body text-center">
                    <img
                      src={selectedSlide.img}
                      alt={selectedSlide.title || 'Изображение'}
                      style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseViewModal}>
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
                      <button type="button" className="btn-close" onClick={handleCloseAddModal} />
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        {saveError && <div className="text-danger mb-2">{saveError}</div>}

                        <div className="mb-3">
                          <label className="form-label">Заголовок</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
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
                        <button type="submit" className="btn btn-primary" disabled={saving}>
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
                        <h5 className="modal-title">Редактировать слайд #{slideToEdit.id}</h5>
                        <button type="button" className="btn-close" onClick={handleCloseEditModal} />
                        </div>

                        <form onSubmit={handleEditSubmit}>
                        <div className="modal-body">
                            {editError && <div className="text-danger mb-2">{editError}</div>}

                            <div className="mb-3">
                            <label className="form-label">Заголовок</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                required
                            />
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
                                    style={{ maxWidth: '150px', maxHeight: '80px', objectFit: 'cover' }}
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
                            <button type="submit" className="btn btn-primary" disabled={editSaving}>
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

                    <p>
                      Вы действительно хотите удалить этот слайд?
                    </p>
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
    )

}

export default editSlide;
