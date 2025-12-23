import React, { useEffect, useState } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

function EditColor() {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----- Добавление -----
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    color_name: '',
    color_code: '#FFFFFF',
  });
  const [savingAdd, setSavingAdd] = useState(false);
  const [saveAddError, setSaveAddError] = useState(null);

  // ----- Редактирование -----
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    color_name: '',
    color_code: '#FFFFFF',
  });
  const [editingColor, setEditingColor] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveEditError, setSaveEditError] = useState(null);

  // ----- Удаление -----
  const [colorToDelete, setColorToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Загрузка списка цветов
  useEffect(() => {
    fetch('/api/colors')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки цветов');
        return res.json();
      })
      .then((data) => {
        setColors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- общая проверка HEX ---
  const isValidHex = (value) => /^#([0-9A-Fa-f]{6})$/.test(value.trim());

  // =======================
  //       ДОБАВЛЕНИЕ
  // =======================
  const handleOpenAddModal = () => {
    setAddForm({
      color_name: '',
      color_code: '#FFFFFF',
    });
    setSaveAddError(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (savingAdd) return;
    setShowAddModal(false);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPresetClick = (hex) => {
    setAddForm((prev) => ({
      ...prev,
      color_code: hex,
    }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setSavingAdd(true);
    setSaveAddError(null);

    try {
      if (!addForm.color_name.trim()) {
        throw new Error('Заполните название цвета');
      }
      if (!addForm.color_code.trim()) {
        throw new Error('Выберите/введите цвет');
      }
      if (!isValidHex(addForm.color_code)) {
        throw new Error('Некорректный HEX-код цвета (формат #RRGGBB)');
      }

      const fd = new FormData();
      fd.append('color_name', addForm.color_name);
      fd.append('color_code', addForm.color_code);

      const res = await fetch('/api/colors', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Ошибка сохранения цвета');
      }

      const newColor = data;
      setColors((prev) => [...prev, newColor]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setSaveAddError(err.message);
    } finally {
      setSavingAdd(false);
    }
  };

  // =======================
  //       РЕДАКТИРОВАНИЕ
  // =======================
  const handleOpenEditModal = (color) => {
    setEditingColor(color);
    setEditForm({
      color_name: color.color_name || '',
      color_code: color.color_code || '#FFFFFF',
    });
    setSaveEditError(null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (savingEdit) return;
    setShowEditModal(false);
    setEditingColor(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditPresetClick = (hex) => {
    setEditForm((prev) => ({
      ...prev,
      color_code: hex,
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editingColor) return;

    setSavingEdit(true);
    setSaveEditError(null);

    try {
      if (!editForm.color_name.trim()) {
        throw new Error('Заполните название цвета');
      }
      if (!editForm.color_code.trim()) {
        throw new Error('Выберите/введите цвет');
      }
      if (!isValidHex(editForm.color_code)) {
        throw new Error('Некорректный HEX-код цвета (формат #RRGGBB)');
      }

      // отправляем JSON через PUT
      const payload = {
        color_name: editForm.color_name,
        color_code: editForm.color_code,
      };

      const res = await fetch(`/api/colors/${editingColor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Ошибка обновления цвета');
      }

      const updated = data;

      // обновляем локальный список
      setColors((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setShowEditModal(false);
      setEditingColor(null);
    } catch (err) {
      console.error(err);
      setSaveEditError(err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // =======================
  //        УДАЛЕНИЕ
  // =======================
  const handleOpenDeleteModal = (color) => {
    setColorToDelete(color);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteSaving) return;
    setShowDeleteModal(false);
    setColorToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!colorToDelete) return;

    setDeleteSaving(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/colors/${colorToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления цвета');
      }

      setColors((prev) => prev.filter((c) => c.id !== colorToDelete.id));
      setShowDeleteModal(false);
      setColorToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError(err.message);
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <>
      <div style={descst} className="p-3">
        <h4>Список цветов</h4>
        <br />

        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <table style={tab} className="table table-striped">
              <thead>
                <tr className="table-dark">
                  <td style={{ width: '35%' }}>Название</td>
                  <td style={{ width: '35%' }}>Код (HEX)</td>
                  <td style={{ width: '15%' }}>Цвет</td>
                  <td style={{ width: '15%' }}></td>
                </tr>
              </thead>

              <tbody>
                {colors.map((color) => (
                  <tr key={color.id}>
                    <td>{color.color_name}</td>
                    <td>{color.color_code}</td>
                    <td>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 4,
                          border: '1px solid #ccc',
                          backgroundColor: color.color_code || '#ffffff',
                        }}
                      />
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => handleOpenEditModal(color)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleOpenDeleteModal(color)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="row">
              <div className="col-9" />
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

        {/* Модальное окно добавления */}
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
                  <h5 className="modal-title">Добавить цвет</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseAddModal}
                    disabled={savingAdd}
                  />
                </div>

                <form onSubmit={handleSubmitAdd}>
                  <div className="modal-body">
                    {saveAddError && (
                      <div className="text-danger mb-2">{saveAddError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Название цвета</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color_name"
                        value={addForm.color_name}
                        onChange={handleAddFormChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Цвет (HEX) / палитра
                      </label>

                      <div className="input-group mb-2">
                        <span className="input-group-text">HEX</span>
                        <input
                          type="text"
                          className="form-control"
                          name="color_code"
                          value={addForm.color_code}
                          onChange={handleAddFormChange}
                          placeholder="#RRGGBB"
                        />
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={addForm.color_code}
                          onChange={(e) =>
                            setAddForm((prev) => ({
                              ...prev,
                              color_code: e.target.value,
                            }))
                          }
                          title="Выберите цвет"
                          style={{ maxWidth: 60 }}
                        />
                      </div>

                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseAddModal}
                      disabled={savingAdd}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={savingAdd}
                    >
                      {savingAdd ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно редактирования */}
        {showEditModal && editingColor && (
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
                  <h5 className="modal-title">Редактировать цвет</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseEditModal}
                    disabled={savingEdit}
                  />
                </div>

                <form onSubmit={handleSubmitEdit}>
                  <div className="modal-body">
                    {saveEditError && (
                      <div className="text-danger mb-2">{saveEditError}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Название цвета</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color_name"
                        value={editForm.color_name}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Цвет (HEX) / палитра
                      </label>

                      <div className="input-group mb-2">
                        <span className="input-group-text">HEX</span>
                        <input
                          type="text"
                          className="form-control"
                          name="color_code"
                          value={editForm.color_code}
                          onChange={handleEditFormChange}
                          placeholder="#RRGGBB"
                        />
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={editForm.color_code}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              color_code: e.target.value,
                            }))
                          }
                          title="Выберите цвет"
                          style={{ maxWidth: 60 }}
                        />
                      </div>

                      <div className="mt-2 d-flex align-items-center">
                        <span className="me-2">Текущий выбор:</span>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            backgroundColor: editForm.color_code || '#ffffff',
                          }}
                        />
                        <span className="ms-2">{editForm.color_code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseEditModal}
                      disabled={savingEdit}
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={savingEdit}
                    >
                      {savingEdit ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно удаления */}
        {showDeleteModal && colorToDelete && (
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
                  <h5 className="modal-title">Удалить цвет?</h5>
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
                    Вы действительно хотите удалить цвет "
                    {colorToDelete.color_name}"?
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
  );
}

export default EditColor;