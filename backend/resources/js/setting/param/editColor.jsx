import React, { useEffect, useState } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

// Регулярка для названия цвета:
// - первая буква заглавная (латиница/кириллица)
// - нельзя пробел/дефис в начале и в конце
// - в середине можно буквы/цифры/пробелы/дефисы
const colorNameRegex =
  /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9]*(?:[ -][A-Za-zА-Яа-яЁё0-9]+)*$/;

// Проверка HEX (#RRGGBB)
const isValidHex = (value) => /^#([0-9A-Fa-f]{6})$/.test(value.trim());

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
  const [addNameError, setAddNameError] = useState('');
  const [addHexError, setAddHexError] = useState('');

  // ----- Редактирование -----
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    color_name: '',
    color_code: '#FFFFFF',
  });
  const [editingColor, setEditingColor] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveEditError, setSaveEditError] = useState(null);
  const [editNameError, setEditNameError] = useState('');
  const [editHexError, setEditHexError] = useState('');

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

  // =======================
  //       ДОБАВЛЕНИЕ
  // =======================
  const handleOpenAddModal = () => {
    setAddForm({
      color_name: '',
      color_code: '#FFFFFF',
    });
    setSaveAddError(null);
    setAddNameError('');
    setAddHexError('');
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

    if (name === 'color_name') {
      const val = value.trim();
      if (!val) {
        setAddNameError('Заполните название цвета');
      } else if (!colorNameRegex.test(val)) {
        setAddNameError(
          'Неверный формат. Первая буква заглавная, без пробелов/дефисов в начале и конце.'
        );
      } else {
        setAddNameError('');
      }
    }

    if (name === 'color_code') {
      const val = value.trim();
      if (!val) {
        setAddHexError('Выберите/введите цвет');
      } else if (!isValidHex(val)) {
        setAddHexError('Некорректный HEX-код цвета (формат #RRGGBB)');
      } else {
        setAddHexError('');
      }
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setSavingAdd(true);
    setSaveAddError(null);

    try {
      const name = addForm.color_name.trim();
      const code = addForm.color_code.trim();

      if (!name) {
        throw new Error('Заполните название цвета');
      }
      if (!colorNameRegex.test(name)) {
        throw new Error(
          'Неверный формат названия. Первая буква заглавная, без пробелов/дефисов в начале и конце.'
        );
      }

      if (!code) {
        throw new Error('Выберите/введите цвет');
      }
      if (!isValidHex(code)) {
        throw new Error('Некорректный HEX-код цвета (формат #RRGGBB)');
      }

      // Локальная проверка дублей по имени (без учёта регистра)
      const nameExists = colors.some(
        (c) => c.color_name.toLowerCase() === name.toLowerCase()
      );
      if (nameExists) {
        throw new Error('Цвет с таким названием уже существует');
      }

      // Локальная проверка дублей по коду (без учёта регистра)
      const codeExists = colors.some(
        (c) => c.color_code.toLowerCase() === code.toLowerCase()
      );
      if (codeExists) {
        throw new Error('Цвет с таким HEX-кодом уже существует');
      }

      const fd = new FormData();
      fd.append('color_name', name);
      fd.append('color_code', code);

      const res = await fetch('/api/colors', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Обработка Laravel-валидации (422)
        if (res.status === 422 && data.errors) {
          if (data.errors.color_name?.length) {
            throw new Error(data.errors.color_name[0]);
          }
          if (data.errors.color_code?.length) {
            throw new Error(data.errors.color_code[0]);
          }
        }
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
    setEditNameError('');
    setEditHexError('');
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

    if (name === 'color_name') {
      const val = value.trim();
      if (!val) {
        setEditNameError('Заполните название цвета');
      } else if (!colorNameRegex.test(val)) {
        setEditNameError(
          'Неверный формат. Первая буква заглавная, без пробелов/дефисов в начале и конце.'
        );
      } else {
        setEditNameError('');
      }
    }

    if (name === 'color_code') {
      const val = value.trim();
      if (!val) {
        setEditHexError('Выберите/введите цвет');
      } else if (!isValidHex(val)) {
        setEditHexError('Некорректный HEX-код цвета (формат #RRGGBB)');
      } else {
        setEditHexError('');
      }
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editingColor) return;

    setSavingEdit(true);
    setSaveEditError(null);

    try {
      const name = editForm.color_name.trim();
      const code = editForm.color_code.trim();

      if (!name) {
        throw new Error('Заполните название цвета');
      }
      if (!colorNameRegex.test(name)) {
        throw new Error(
          'Неверный формат названия. Первая буква заглавная, без пробелов/дефисов в начале и конце.'
        );
      }

      if (!code) {
        throw new Error('Выберите/введите цвет');
      }
      if (!isValidHex(code)) {
        throw new Error('Некорректный HEX-код цвета (формат #RRGGBB)');
      }

      // Локальная проверка дублей по имени (исключаем текущий id)
      const nameExists = colors.some(
        (c) =>
          c.id !== editingColor.id &&
          c.color_name.toLowerCase() === name.toLowerCase()
      );
      if (nameExists) {
        throw new Error('Цвет с таким названием уже существует');
      }

      // Локальная проверка дублей по коду (исключаем текущий id)
      const codeExists = colors.some(
        (c) =>
          c.id !== editingColor.id &&
          c.color_code.toLowerCase() === code.toLowerCase()
      );
      if (codeExists) {
        throw new Error('Цвет с таким HEX-кодом уже существует');
      }

      const payload = {
        color_name: name,
        color_code: code,
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
        if (res.status === 422 && data.errors) {
          if (data.errors.color_name?.length) {
            throw new Error(data.errors.color_name[0]);
          }
          if (data.errors.color_code?.length) {
            throw new Error(data.errors.color_code[0]);
          }
        }
        throw new Error(data.message || 'Ошибка обновления цвета');
      }

      const updated = data;

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

  const isAddSubmitDisabled =
    savingAdd ||
    !!addNameError ||
    !!addHexError ||
    !addForm.color_name.trim() ||
    !addForm.color_code.trim();

  const isEditSubmitDisabled =
    savingEdit ||
    !!editNameError ||
    !!editHexError ||
    !editForm.color_name.trim() ||
    !editForm.color_code.trim();

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
                        className={`form-control ${
                          addNameError ? 'is-invalid' : ''
                        }`}
                        name="color_name"
                        value={addForm.color_name}
                        onChange={handleAddFormChange}
                        required
                      />
                      {addNameError && (
                        <div className="invalid-feedback">
                          {addNameError}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Цвет (HEX) / палитра
                      </label>

                      <div className="input-group mb-2">
                        <span className="input-group-text">HEX</span>
                        <input
                          type="text"
                          className={`form-control ${
                            addHexError ? 'is-invalid' : ''
                          }`}
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
                      {addHexError && (
                        <div className="invalid-feedback d-block">
                          {addHexError}
                        </div>
                      )}
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
                      disabled={isAddSubmitDisabled}
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
                        className={`form-control ${
                          editNameError ? 'is-invalid' : ''
                        }`}
                        name="color_name"
                        value={editForm.color_name}
                        onChange={handleEditFormChange}
                        required
                      />
                      {editNameError && (
                        <div className="invalid-feedback">
                          {editNameError}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Цвет (HEX) / палитра
                      </label>

                      <div className="input-group mb-2">
                        <span className="input-group-text">HEX</span>
                        <input
                          type="text"
                          className={`form-control ${
                            editHexError ? 'is-invalid' : ''
                          }`}
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
                      {editHexError && (
                        <div className="invalid-feedback d-block">
                          {editHexError}
                        </div>
                      )}

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
                      disabled={isEditSubmitDisabled}
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