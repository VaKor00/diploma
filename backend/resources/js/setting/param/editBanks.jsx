import React, { useEffect, useState } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

const bankNameRegex =
  /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9.&]*(?:[ -][A-Za-zА-Яа-яЁё0-9.&]+)*$/;

// >>> хелпер для нормализации числовых значений
const toNumber = (val) => {
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
};

function EditBanks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----- Добавление -----
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    deposit_min: 0,
    min_percent: 0,
    max_percent: 0,
    min_month: 12,  // >>> по умолчанию 12
    max_month: 12,
  });
  const [addLogoFile, setAddLogoFile] = useState(null);
  const [savingAdd, setSavingAdd] = useState(false);
  const [saveAddError, setSaveAddError] = useState(null);
  const [addNameError, setAddNameError] = useState('');

  // >>> ошибки числовых полей (добавление)
  const [addNumberErrors, setAddNumberErrors] = useState({
    percent: '',
    month: '',
  });

  // ----- Редактирование -----
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    deposit_min: 0,
    min_percent: 0,
    max_percent: 0,
    min_month: 12,
    max_month: 12,
  });
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editingBank, setEditingBank] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveEditError, setSaveEditError] = useState(null);
  const [editNameError, setEditNameError] = useState('');

  // >>> ошибки числовых полей (редактирование)
  const [editNumberErrors, setEditNumberErrors] = useState({
    percent: '',
    month: '',
  });

  // ----- Удаление -----
  const [bankToDelete, setBankToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Загрузка списка банков
  useEffect(() => {
    fetch('/api/banks')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки банков');
        return res.json();
      })
      .then((data) => {
        setBanks(data);
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
      name: '',
      deposit_min: 0,
      min_percent: 0,
      max_percent: 0,
      min_month: 12, // >>> 12
      max_month: 12,
    });
    setAddLogoFile(null);
    setSaveAddError(null);
    setAddNameError('');
    setAddNumberErrors({ percent: '', month: '' }); // >>>
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (savingAdd) return;
    setShowAddModal(false);
  };

  const validateAddNumbers = (nextForm) => {
    const minP = toNumber(nextForm.min_percent);
    const maxP = toNumber(nextForm.max_percent);
    const minM = toNumber(nextForm.min_month);
    const maxM = toNumber(nextForm.max_month);

    const errors = { percent: '', month: '' };

    if (minP && maxP && minP >= maxP) {
      errors.percent = 'Минимальный процент должен быть меньше максимального';
    }

    // кратность 12 + сравнение
    if (minM && minM % 12 !== 0) {
      errors.month = 'Минимальное количество месяцев должно быть кратно 12';
    } else if (maxM && maxM % 12 !== 0) {
      errors.month = 'Максимальное количество месяцев должно быть кратно 12';
    } else if (minM && maxM && minM >= maxM) {
      errors.month =
        'Минимальное количество месяцев должно быть меньше максимального';
    }

    setAddNumberErrors(errors);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;

    const nextForm = {
      ...addForm,
      [name]:
        name === 'deposit_min' ||
        name === 'min_percent' ||
        name === 'max_percent' ||
        name === 'min_month' ||
        name === 'max_month'
          ? value === '' ? '' : toNumber(value)
          : value,
    };

    setAddForm(nextForm);

    if (name === 'name') {
      const val = value.trim();
      if (!val) {
        setAddNameError('Укажите название банка');
      } else if (!bankNameRegex.test(val)) {
        setAddNameError(
          'Неверный формат. Первая буква заглавная, без пробелов/дефисов в начале и конце.',
        );
      } else {
        setAddNameError('');
      }
    } else {
      // >>> валидация числовых полей
      validateAddNumbers(nextForm);
    }
  };

  const handleAddLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setAddLogoFile(file || null);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    setSavingAdd(true);
    setSaveAddError(null);

    try {
      const trimmedName = addForm.name.trim();

      if (!trimmedName) {
        throw new Error('Укажите название банка');
      }

      if (!bankNameRegex.test(trimmedName)) {
        throw new Error(
          'Неверный формат названия банка. Первая буква заглавная, без пробелов/дефисов в начале и конце.',
        );
      }

      // >>> финальная проверка чисел перед отправкой
      validateAddNumbers(addForm);
      if (addNumberErrors.percent || addNumberErrors.month) {
        throw new Error('Исправьте ошибки в числовых полях');
      }

      const fd = new FormData();
      fd.append('name', trimmedName);
      fd.append('deposit_min', addForm.deposit_min || 0);
      fd.append('min_percent', addForm.min_percent || 0);
      fd.append('max_percent', addForm.max_percent || 0);
      fd.append('min_month', addForm.min_month || 0);
      fd.append('max_month', addForm.max_month || 0);

      if (addLogoFile) {
        fd.append('logo', addLogoFile);
      }

      const res = await fetch('/api/banks', {
        method: 'POST',
        body: fd,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      console.log('CREATE BANK RESPONSE:', res.status, data);

      if (!res.ok) {
        if (res.status === 409 || data.code === 'BANK_ALREADY_EXISTS') {
          throw new Error('Банк с таким названием уже существует');
        }
        throw new Error(
          data.message || JSON.stringify(data) || 'Ошибка сохранения банка',
        );
      }

      setBanks((prev) => [...prev, data]);
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
  const handleOpenEditModal = (bank) => {
    setEditingBank(bank);
    setEditForm({
      name: bank.name || '',
      deposit_min: bank.deposit_min || 0,
      min_percent: bank.min_percent || 0,
      max_percent: bank.max_percent || 0,
      min_month: bank.min_month || 12,
      max_month: bank.max_month || 12,
    });
    setEditLogoFile(null);
    setSaveEditError(null);
    setEditNameError('');
    setEditNumberErrors({ percent: '', month: '' }); // >>>
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (savingEdit) return;
    setShowEditModal(false);
    setEditingBank(null);
  };

  const validateEditNumbers = (nextForm) => {
    const minP = toNumber(nextForm.min_percent);
    const maxP = toNumber(nextForm.max_percent);
    const minM = toNumber(nextForm.min_month);
    const maxM = toNumber(nextForm.max_month);

    const errors = { percent: '', month: '' };

    if (minP && maxP && minP >= maxP) {
      errors.percent = 'Минимальный процент должен быть меньше максимального';
    }

    if (minM && minM % 12 !== 0) {
      errors.month = 'Минимальное количество месяцев должно быть кратно 12';
    } else if (maxM && maxM % 12 !== 0) {
      errors.month = 'Максимальное количество месяцев должно быть кратно 12';
    } else if (minM && maxM && minM >= maxM) {
      errors.month =
        'Минимальное количество месяцев должно быть меньше максимального';
    }

    setEditNumberErrors(errors);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    const nextForm = {
      ...editForm,
      [name]:
        name === 'deposit_min' ||
        name === 'min_percent' ||
        name === 'max_percent' ||
        name === 'min_month' ||
        name === 'max_month'
          ? value === '' ? '' : toNumber(value)
          : value,
    };

    setEditForm(nextForm);

    if (name === 'name') {
      const val = value.trim();
      if (!val) {
        setEditNameError('Укажите название банка');
      } else if (!bankNameRegex.test(val)) {
        setEditNameError(
          'Неверный формат. Первая буква заглавная, без пробелов/дефисов в начале и конце.',
        );
      } else {
        setEditNameError('');
      }
    } else {
      // >>> валидация числовых полей
      validateEditNumbers(nextForm);
    }
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setEditLogoFile(file || null);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editingBank) return;

    setSavingEdit(true);
    setSaveEditError(null);

    try {
      const trimmedName = editForm.name.trim();

      if (!trimmedName) {
        throw new Error('Укажите название банка');
      }

      if (!bankNameRegex.test(trimmedName)) {
        throw new Error(
          'Неверный формат названия банка. Первая буква заглавная, без пробелов/дефисов в начале и конце.',
        );
      }

      // >>> финальная проверка чисел
      validateEditNumbers(editForm);
      if (editNumberErrors.percent || editNumberErrors.month) {
        throw new Error('Исправьте ошибки в числовых полях');
      }

      const fd = new FormData();
      fd.append('name', trimmedName);
      fd.append('deposit_min', editForm.deposit_min || 0);
      fd.append('min_percent', editForm.min_percent || 0);
      fd.append('max_percent', editForm.max_percent || 0);
      fd.append('min_month', editForm.min_month || 0);
      fd.append('max_month', editForm.max_month || 0);

      if (editLogoFile) {
        fd.append('logo', editLogoFile);
      }

      const res = await fetch(`/api/banks/${editingBank.id}`, {
        method: 'PUT',
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409 || data.code === 'BANK_ALREADY_EXISTS') {
          throw new Error('Банк с таким названием уже существует');
        }
        throw new Error(data.message || 'Ошибка обновления банка');
      }

      const updated = data;

      setBanks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));

      setShowEditModal(false);
      setEditingBank(null);
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
  const handleOpenDeleteModal = (bank) => {
    setBankToDelete(bank);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteSaving) return;
    setShowDeleteModal(false);
    setBankToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!bankToDelete) return;

    setDeleteSaving(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/banks/${bankToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления банка');
      }

      setBanks((prev) => prev.filter((b) => b.id !== bankToDelete.id));
      setShowDeleteModal(false);
      setBankToDelete(null);
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
    !addForm.name.trim() ||
    !!addNumberErrors.percent || // >>>
    !!addNumberErrors.month;

  const isEditSubmitDisabled =
    savingEdit ||
    !!editNameError ||
    !editForm.name.trim() ||
    !!editNumberErrors.percent || // >>>
    !!editNumberErrors.month;

  return (
    <>
      <div style={descst} className="p-3">
        <h4>Банки</h4>
        <br />

        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <table style={tab} className="table table-striped">
              <thead>
                <tr className="table-dark">
                  <td style={{ width: '25%' }}>Название</td>
                  <td style={{ width: '15%' }}>Логотип</td>
                  <td style={{ width: '10%' }}>Мин. взнос</td>
                  <td style={{ width: '10%' }}>Мин. %</td>
                  <td style={{ width: '10%' }}>Макс. %</td>
                  <td style={{ width: '10%' }}>Мин. мес.</td>
                  <td style={{ width: '10%' }}>Макс. мес.</td>
                  <td style={{ width: '10%' }}></td>
                </tr>
              </thead>

              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.id}>
                    <td>{bank.name}</td>
                    <td>
                      {bank.logo && (
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          style={{ maxHeight: 40 }}
                        />
                      )}
                    </td>
                    <td>{bank.deposit_min}</td>
                    <td>{bank.min_percent}</td>
                    <td>{bank.max_percent}</td>
                    <td>{bank.min_month}</td>
                    <td>{bank.max_month}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => handleOpenEditModal(bank)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleOpenDeleteModal(bank)}
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
                  Добавить банк
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
                  <h5 className="modal-title">Добавить банк</h5>
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
                      <label className="form-label">Название банка</label>
                      <input
                        type="text"
                        className={`form-control ${
                          addNameError ? 'is-invalid' : ''
                        }`}
                        name="name"
                        value={addForm.name}
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
                      <label className="form-label">Логотип (файл)</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleAddLogoChange}
                        required
                      />
                      <div className="form-text">
                        Файл будет сохранён в папку img/banks
                      </div>
                    </div>

                    {/* Числовые поля */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Мин. взнос</label>
                        <input
                          type="number"
                          className="form-control"
                          name="deposit_min"
                          value={addForm.deposit_min}
                          onChange={handleAddFormChange}
                          min="0"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Мин. процент</label>
                        <input
                          type="number"
                          className={`form-control ${
                            addNumberErrors.percent ? 'is-invalid' : ''
                          }`}
                          name="min_percent"
                          value={addForm.min_percent}
                          onChange={handleAddFormChange}
                          min="0"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Макс. процент</label>
                        <input
                          type="number"
                          className={`form-control ${
                            addNumberErrors.percent ? 'is-invalid' : ''
                          }`}
                          name="max_percent"
                          value={addForm.max_percent}
                          onChange={handleAddFormChange}
                          min="0"
                        />
                        {addNumberErrors.percent && (
                          <div className="invalid-feedback">
                            {addNumberErrors.percent}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Мин. месяцев</label>
                        <input
                          type="number"
                          className={`form-control ${
                            addNumberErrors.month ? 'is-invalid' : ''
                          }`}
                          name="min_month"
                          value={addForm.min_month}
                          onChange={handleAddFormChange}
                          min="12"
                          step="12" // >>> 12/24/36/…
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Макс. месяцев</label>
                        <input
                          type="number"
                          className={`form-control ${
                            addNumberErrors.month ? 'is-invalid' : ''
                          }`}
                          name="max_month"
                          value={addForm.max_month}
                          onChange={handleAddFormChange}
                          min="12"
                          step="12"
                        />
                        {addNumberErrors.month && (
                          <div className="invalid-feedback">
                            {addNumberErrors.month}
                          </div>
                        )}
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
        {showEditModal && editingBank && (
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
                  <h5 className="modal-title">Редактировать банк</h5>
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
                      <label className="form-label">Название банка</label>
                      <input
                        type="text"
                        className={`form-control ${
                          editNameError ? 'is-invalid' : ''
                        }`}
                        name="name"
                        value={editForm.name}
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
                        Логотип (оставьте пустым, чтобы не менять)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleEditLogoChange}
                      />
                      {editingBank.logo && (
                        <div className="mt-2">
                          <span className="me-2">Текущий логотип:</span>
                          <img
                            src={editingBank.logo}
                            alt={editingBank.name}
                            style={{ maxHeight: 40 }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Числовые поля */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Мин. взнос</label>
                        <input
                          type="number"
                          className="form-control"
                          name="deposit_min"
                          value={editForm.deposit_min}
                          onChange={handleEditFormChange}
                          min="0"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Мин. процент</label>
                        <input
                          type="number"
                          className={`form-control ${
                            editNumberErrors.percent ? 'is-invalid' : ''
                          }`}
                          name="min_percent"
                          value={editForm.min_percent}
                          onChange={handleEditFormChange}
                          min="0"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Макс. процент</label>
                        <input
                          type="number"
                          className={`form-control ${
                            editNumberErrors.percent ? 'is-invalid' : ''
                          }`}
                          name="max_percent"
                          value={editForm.max_percent}
                          onChange={handleEditFormChange}
                          min="0"
                        />
                        {editNumberErrors.percent && (
                          <div className="invalid-feedback">
                            {editNumberErrors.percent}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Мин. месяцев</label>
                        <input
                          type="number"
                          className={`form-control ${
                            editNumberErrors.month ? 'is-invalid' : ''
                          }`}
                          name="min_month"
                          value={editForm.min_month}
                          onChange={handleEditFormChange}
                          min="12"
                          step="12"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Макс. месяцев</label>
                        <input
                          type="number"
                          className={`form-control ${
                            editNumberErrors.month ? 'is-invalid' : ''
                          }`}
                          name="max_month"
                          value={editForm.max_month}
                          onChange={handleEditFormChange}
                          min="12"
                          step="12"
                        />
                        {editNumberErrors.month && (
                          <div className="invalid-feedback">
                            {editNumberErrors.month}
                          </div>
                        )}
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
        {showDeleteModal && bankToDelete && (
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
                  <h5 className="modal-title">Удалить банк?</h5>
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
                    Вы действительно хотите удалить банк "
                    {bankToDelete.name}"?
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

export default EditBanks;