import React, { useEffect, useState } from 'react';

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"} 

const tab = {fontSize: "20px", width: "100%"} 

import ModalAddCarModel from "./modaladdcarmodel"
import ModalEditCarModel from "./modaleditcarmodel"

function editModel() {

  const [showAddModelModal, setShowAddModelModal] = useState(false);

  const handleOpenAddModelModal = () => setShowAddModelModal(true);
  const handleCloseAddModelModal = () => setShowAddModelModal(false);

  const handleCreateModel = async (form) => {
  const fd = new FormData();
  fd.append('model_name', form.model_name);
  fd.append('length', form.length);
  fd.append('width', form.width);
  fd.append('height', form.height);
  fd.append('whellbase', form.whellbase);
  fd.append('clearance', form.clearance);
  fd.append('trunk', form.trunk);
  fd.append('fuel_tank', form.fuel_tank);
  fd.append('engine_m', form.engine_m);
  fd.append('min_price', form.min_price ?? 0);

  if (form.img) fd.append('img', form.img);
  if (form.salon_photo) fd.append('salon_photo', form.salon_photo);

  fd.append('description', form.description);
  fd.append('description_full', form.description_full);

  // ВАЖНО: JSON — только как строку
  fd.append('features', form.features); // здесь у нас уже JSON-строка

  const res = await fetch('/api/models', {
    method: 'POST',
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Ошибка сохранения модели');
  }

    // тут обновляете таблицу моделей
    setSlides(prev => [...prev, data]);
  };

    // вставка слайдов в редактов
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // новое: модалка добавления
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({
    city: '',
    });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

   const [editModelData, setEditModelData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
        const res = await fetch(`/api/models/${slideToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Ошибка удаления модели');
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
      
    fetch('/api/models')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки моделей');
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      setSaveError(null);

      try {
        if (!form.city.trim()) {
          throw new Error('Заполните модель');
        }

        const fd = new FormData();
        fd.append('city', form.city);  // ← то же имя, что на бэке

        const res = await fetch('/api/models', {
          method: 'POST',
          body: fd,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || 'Ошибка сохранения модели');
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

    const handleOpenEdit = (model) => {
      setEditModelData(model);
      setShowEditModal(true);
    };

    const handleCloseEdit = () => {
      setShowEditModal(false);
      setEditModelData(null);
    };

    const handleUpdateModel = async (form) => {
    console.log('Update form:', form); // чтобы увидеть id и данные

    const fd = new FormData();
    fd.append('model_name', form.model_name);
    fd.append('length', form.length);
    fd.append('width', form.width);
    fd.append('height', form.height);
    fd.append('whellbase', form.whellbase);
    fd.append('clearance', form.clearance);
    fd.append('trunk', form.trunk);
    fd.append('fuel_tank', form.fuel_tank);
    fd.append('engine_m', form.engine_m);
    fd.append('min_price', form.min_price ?? 0);
    fd.append('description', form.description);
    fd.append('description_full', form.description_full);
    fd.append('features', form.features); // JSON-строка

    if (form.img) fd.append('img', form.img);
    if (form.salon_photo) fd.append('salon_photo', form.salon_photo);

    const res = await fetch(`/api/models/${form.id}`, {
      method: 'PUT',
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('Update error response:', data);
      throw new Error(data.message || 'Ошибка обновления модели');
    }

    // обновляем запись в списке
    setSlides((prev) => prev.map((m) => (m.id === data.id ? data : m)));
    setShowEditModal(false);
    setEditModelData(null);
  };

    return(
        <>
        <div style={descst} className="p-3">
            <h4>Список моделей</h4>
            <br />

            {loading && <div>Загрузка...</div>}
            {error && <div className="text-danger">{error}</div>}

            {!loading && !error && (
                <>
                <table style={tab} className="table table-striped">
                    <thead>
                    <tr className="table-dark">
                        <td style={{ width: '80%' }}>Модель</td>
                        <td style={{ width: '20%' }}></td>
                    </tr>
                    </thead>

                    <tbody>
                    {slides.map((slide, index) => (
                        <tr key={slide.id ?? index}>
                        <td>{slide.model_name }</td>
                        <td className='text-end'>
                          <button
                              type="button"
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleOpenEdit(slide)}
                            >
                              <i className="bi bi-pencil-fill"></i>
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
                        onClick={handleOpenAddModelModal}
                    >
                        Добавить
                    </button>

                      <ModalAddCarModel
                        show={showAddModelModal}
                        onClose={handleCloseAddModelModal}
                        onCreate={handleCreateModel}
                      />

                      {showEditModal && editModelData && (
                        <ModalEditCarModel
                          show={showEditModal}
                          model={editModelData}
                          onClose={handleCloseEdit}
                          onUpdate={handleUpdateModel}
                        />
                      )}
                    </div>
                </div>
                </>
            )}


            {/* Модальное окно удаления модели */}    
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
                      Удалить модель?
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
                      Вы действительно хотите удалить модель?
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

export default editModel;
