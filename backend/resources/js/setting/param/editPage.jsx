import React, { useEffect, useState } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"} 

const tab = {fontSize: "20px", width: "100%"} 

function editPage() {

    // вставка слайдов в редактов
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    const [selectedSlide, setSelectedSlide] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // новое: модалка добавления
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({
      name: '',
      edit_content: 0,
      desc: '',
      button_bool: 0,
      button: '',
      link: '',
    });

    const isSpecialTitle = (name) => {
      const n = (name || '').trim().toLowerCase();
      return n === 'модельный ряд' || n === 'дилеры';
    };

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
        const res = await fetch(`/api/startpage/${slideToDelete.id}`, {
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
      fetch('/api/startpage')
        .then((res) => {
          if (!res.ok) throw new Error('Ошибка загрузки слайдов');
          return res.json();
        })
        .then((data) => {
          const sorted = [...data].sort(
            (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
          );
          setSlides(sorted);
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
        desc: '',
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

      setForm((prev) => {
        if (name === 'name') {
          // если особый заголовок — чистим остальные поля
          if (isSpecialTitle(value)) {
            return {
              ...prev,
              name: value,
              edit_content: 0,
              desc: '',
              button_bool: 0,
              button: '',
              link: '',
            };
          }

          return { ...prev, name: value };
        }

        return { ...prev, [name]: value };
      });
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
        const special = isSpecialTitle(form.name);

        const fd = new FormData();
        fd.append('name', form.name);

        if (special) {
          // Модельный ряд / Дилеры → edit_content = 0
          fd.append('edit_content', '0');
          fd.append('desc', '');
          fd.append('button_bool', '1');
          fd.append('button', '');
          fd.append('link', '');
        } else {
          // Все остальные → edit_content = 1
          fd.append('edit_content', '1');
          fd.append('desc', form.desc ?? '');
          fd.append('button_bool', String(form.button_bool ?? 0));
          fd.append('button', form.button ?? '');
          fd.append('link', form.link ?? '');
        }

        if (file) {
          fd.append('img', file);
        }

        const res = await fetch('/api/startpage', { method: 'POST', body: fd });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            (data && (data.message || JSON.stringify(data))) ||
              'Ошибка сохранения элемента',
          );
        }

        const newItem = data;

        setSlides((prev) => {
          const copy = [...prev, newItem];
          copy.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
          return copy;
        });

        setShowAddModal(false);
      } catch (err) {
        console.error(err);
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    };
    
    // редактирование слайдов

    const [showEditModal, setShowEditModal] = useState(false);
    const [slideToEdit, setSlideToEdit] = useState(null);

    const handleOpenEditModal = (slide) => {
      setSlideToEdit(slide);
      setForm({
        name: slide.name || '',
        desc: slide.desc || '',
        button_bool: slide.button_bool ?? 0,
        button: slide.button || '',
        link: slide.link || '',
      });
      setFile(null); // изначально без нового файла
      setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
      if (saving) return;
      setShowEditModal(false);
      setSlideToEdit(null);
      setForm({
        name: '',
        desc: '',
        button_bool: 0,
        button: '',
        link: '',
      });
      setFile(null);
      setSaveError(null);
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setSaveError(null);

      try {
        if (!slideToEdit) {
          throw new Error('Нет выбранного слайда для редактирования');
        }

        const special = isSpecialTitle(form.name);
        const fd = new FormData();

        fd.append('name', form.name);

        if (special) {
          fd.append('edit_content', '0'); // как и при создании
          fd.append('desc', '');
          fd.append('button_bool', '1');
          fd.append('button', '');
          fd.append('link', '');
        } else {
          fd.append('edit_content', '1');
          fd.append('desc', form.desc);
          fd.append('button_bool', String(form.button_bool ?? 0));
          fd.append('button', form.button);
          fd.append('link', form.link);
        }

        if (file) {
          fd.append('img', file);
        }

        const res = await fetch(`/api/startpage/${slideToEdit.id}`, {
          method: 'PUT',
          body: fd,
        });

        let data;
        try {
          data = await res.json();
        } catch {
          const text = await res.text().catch(() => '');
          console.log('Non-JSON response:', text); // здесь увидишь HTML 405/500 Laravel
          throw new Error('Некорректный ответ сервера');
        }

        if (!res.ok) {
          throw new Error(
            (data && (data.message || JSON.stringify(data))) ||
              'Ошибка сохранения элемента',
          );
        }

        const updated = data;

        setSlides((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s)),
        );

        setShowEditModal(false);
        setSlideToEdit(null);
      } catch (err) {
        console.error(err);
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    };

    // смена приоритета

    const [priorityLoadingId, setPriorityLoadingId] = useState(null);
    const [priorityError, setPriorityError] = useState(null);

    const handleMove = async (slide, direction) => {
    setPriorityLoadingId(slide.id);
    setPriorityError(null);

    try {
      const index = slides.findIndex((s) => s.id === slide.id);
      if (index === -1) return;

      const neighborIndex =
        direction === 'up' ? index - 1 : index + 1;

      if (neighborIndex < 0 || neighborIndex >= slides.length) {
        return; // нет соседа
      }

      const neighbor = slides[neighborIndex];

      const res = await fetch('/api/startpage/swap-priority', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id1: slide.id, id2: neighbor.id }),
      });

      const data = await res.json();
      console.log('swap response', data);

      if (!res.ok) {
        throw new Error(data.message || 'Ошибка изменения приоритета');
      }

      const updated1 = data.row1;
      const updated2 = data.row2;

      if (!updated1 || !updated2) return;

      setSlides((prev) => {
        const copy = [...prev];

        const i1 = copy.findIndex((s) => s.id === updated1.id);
        const i2 = copy.findIndex((s) => s.id === updated2.id);

        if (i1 !== -1) copy[i1] = updated1;
        if (i2 !== -1) copy[i2] = updated2;

        // сортируем по priority, чтобы порядок в таблице обновился
        copy.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
        return copy;
      });
    } catch (err) {
      console.error(err);
      setPriorityError(err.message);
    } finally {
      setPriorityLoadingId(null);
    }
  };

  const priorities = slides.map((s) => s.priority ?? 0);
  const minPriority = priorities.length ? Math.min(...priorities) : null;
  const maxPriority = priorities.length ? Math.max(...priorities) : null;
  const special = isSpecialTitle(form.name);

    return(
        <>
        <div style={descst} className="p-3">
            <h3>Элементы главной страницы</h3>
            <hr />
            <h4>Список элементов</h4>
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
                    {slides.map((slide, index) => {
                      const isFirst = slide.priority === minPriority;
                      const isLast  = slide.priority === maxPriority;

                      return (
                        <tr key={slide.priority ?? index}>
                          <td>{slide.priority}</td>
                          <td>{slide.name}</td>
                          <td>{slide.desc}</td>
                          <td>{slide.button}</td>
                          <td>{slide.link}</td>
                          <td className="text-end">
                           
                           {(slide.img === null) ? <></> :
                              <>
                              <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleOpenImage(slide)}
                              >
                              <i class="bi bi-card-image"></i>
                              </button>
                              </>
                            }

                            &nbsp;

                            {(slide.edit_content === 0) ? <></> :
                              <>
                              <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleOpenEditModal(slide)}
                              >
                              <i class="bi bi-pencil-fill"></i>
                              </button>
                              </>
                            }
                            
                            &nbsp;
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleMove(slide, 'up')}
                              disabled={priorityLoadingId === slide.id || isFirst}
                            >
                              <i className="bi bi-arrow-up"></i>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleMove(slide, 'down')}
                              disabled={priorityLoadingId === slide.id || isLast}
                            >
                              <i className="bi bi-arrow-down"></i>
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
                      );
                    })}
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
          <h5 className="modal-title">Добавить элемент</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseAddModal}
            disabled={saving}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {saveError && <div className="text-danger mb-2">{saveError}</div>}

            {/* Заголовок */}
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

            {/* Все остальные поля скрываем, если special === true */}
            {!special && (
              <>
              
                {/* Описание */}
                <div className="mb-3">
                  <label className="form-label">Описание</label>
                  <textarea
                    className="form-control"
                    name="desc"
                    rows="3"
                    value={form.desc}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Флаг кнопки */}
                <div className="mb-3 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="button_bool"
                    checked={form.button_bool === 1}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        button_bool: e.target.checked ? 1 : 0,
                      }))
                    }
                  />
                  <label className="form-check-label" htmlFor="button_bool">
                    Показать кнопку
                  </label>
                </div>

                {/* Поля кнопки */}
                {form.button_bool === 1 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Текст кнопки</label>
                      <input
                        type="text"
                        className="form-control"
                        name="button"
                        value={form.button}
                        onChange={handleChange}
                        required
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
                        required
                      />
                    </div>
                  </>
                )}

                {/* Изображение (если нужно не для special) */}
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
              </>
            )}
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
          <h5 className="modal-title">Редактировать элемент</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseEditModal}
            disabled={saving}
          />
        </div>

        <form onSubmit={handleEditSubmit}>
          <div className="modal-body">
            {saveError && <div className="text-danger mb-2">{saveError}</div>}

            {/* Заголовок */}
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

            {/* Специальный заголовок (модельный ряд/дилеры)? */}
            {/*
              Можно использовать ту же isSpecialTitle(form.name) как при добавлении
            */}
            {!isSpecialTitle(form.name) && (
              <>
                {/* Описание */}
                <div className="mb-3">
                  <label className="form-label">Описание</label>
                  <textarea
                    className="form-control"
                    name="desc"
                    rows="3"
                    value={form.desc}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Флаг кнопки */}
                <div className="mb-3 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="button_bool_edit"
                    checked={form.button_bool === 1}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        button_bool: e.target.checked ? 1 : 0,
                      }))
                    }
                  />
                  <label
                    className="form-check-label"
                    htmlFor="button_bool_edit"
                  >
                    Показать кнопку
                  </label>
                </div>

                {/* Поля кнопки */}
                {form.button_bool === 1 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Текст кнопки</label>
                      <input
                        type="text"
                        className="form-control"
                        name="button"
                        value={form.button}
                        onChange={handleChange}
                        required
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
                        required
                      />
                    </div>
                  </>
                )}

                {/* Изображение: при редактировании обычно НЕ required */}
                <div className="mb-3">
                  <label className="form-label">Изображение</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleFileChange}
                  />
                  {slideToEdit.img && (
                    <small className="form-text text-muted">
                      Текущее изображение: {slideToEdit.img}
                    </small>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseEditModal}
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

export default editPage;
