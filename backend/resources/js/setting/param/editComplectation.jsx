import React, { useState, useEffect, useCallback } from 'react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

function EditComplectation() {
  // ---------- МОДЕЛИ ----------
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(0);

  useEffect(() => {
    fetch('/api/models')
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки моделей');
        return res.json();
      })
      .then((data) => {
        setModels(data);
        if (data.length > 0) {
          setSelectedModelId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleModelChange = (event) => {
    const modelID = parseInt(event.target.value, 10);
    setSelectedModelId(modelID);
  };

  // ---------- КОМПЛЕКТАЦИИ ----------
  const [complectations, setComplectations] = useState([]);
  const [filteredComplectations, setFilteredComplectations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadComplectations = useCallback(async () => {
    try {
      const res = await fetch('/api/complectation');
      if (!res.ok) throw new Error('Ошибка загрузки комплектаций');
      const data = await res.json();
      setComplectations(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplectations();
  }, [loadComplectations]);

  useEffect(() => {
    const filtered = complectations.filter(
      (item) => Number(item.model_id) === Number(selectedModelId)
    );
    setFilteredComplectations(filtered);
  }, [selectedModelId, complectations]);

  // ---------- ФОРМА (общий initial) ----------
  const initialForm = {
    complectation_name: '',
    price: 1,

    engine: 1,
    track_fuel: 0.1,
    city_fuel: 0.1,

    transmission: 'Механическая',
    brakes: 'Барабанные и дисковые',
    wheel_drive: 'Передний',

    weight: 1,
    headlights: 'Галогеновые',

    hatch: 0,
    tinting: 0,

    airbag: 1,

    heated_front_seats: 0,
    heated_rear_seats: 0,

    salon: 'Пластик',
    seats: 'Тканевые',

    conditions: 0,
    cruise_control: 0,
    apple_carplay_android_auto: 0,

    audio_speakers: 1,
    usb: 1,
  };

  // ---------- ДОБАВЛЕНИЕ КОМПЛЕКТАЦИИ ----------
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleOpenAddModal = () => {
    setSaveError(null);
    setAddForm(initialForm);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    if (saving) return;
    setShowAddModal(false);
  };

  const handleAddFormChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === 'checkbox') {
      setAddForm((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    } else {
      setAddForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCreateComplectation = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      if (!selectedModelId) {
        throw new Error('Не выбрана модель');
      }
      if (!addForm.complectation_name.trim()) {
        throw new Error('Укажите название комплектации');
      }
      if (!addForm.price) {
        throw new Error('Укажите цену');
      }

      const fd = new FormData();
      fd.append('model_id', selectedModelId);
      fd.append('complectation_name', addForm.complectation_name);
      fd.append('price', addForm.price);
      fd.append('engine', addForm.engine);
      fd.append('track_fuel', addForm.track_fuel);
      fd.append('city_fuel', addForm.city_fuel);
      fd.append('transmission', addForm.transmission);
      fd.append('brakes', addForm.brakes);
      fd.append('wheel_drive', addForm.wheel_drive);
      fd.append('weight', addForm.weight);
      fd.append('headlights', addForm.headlights);
      fd.append('hatch', addForm.hatch);
      fd.append('tinting', addForm.tinting);
      fd.append('airbag', addForm.airbag);
      fd.append('heated_front_seats', addForm.heated_front_seats);
      fd.append('heated_rear_seats', addForm.heated_rear_seats);
      fd.append('salon', addForm.salon);
      fd.append('seats', addForm.seats);
      fd.append('conditions', addForm.conditions);
      fd.append('cruise_control', addForm.cruise_control);
      fd.append(
        'apple_carplay_android_auto',
        addForm.apple_carplay_android_auto
      );
      fd.append('audio_speakers', addForm.audio_speakers);
      fd.append('usb', addForm.usb);

      const res = await fetch('/api/complectation', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error('Back error:', data);
        throw new Error(data.message || 'Ошибка сохранения комплектации');
      }

      await loadComplectations();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ---------- РЕДАКТИРОВАНИЕ КОМПЛЕКТАЦИИ ----------
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(initialForm);
  const [editingComplect, setEditingComplect] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  const handleOpenEditModal = (complect) => {
    setEditError(null);
    setEditingComplect(complect);

    setEditForm({
      complectation_name: complect.complectation_name || '',
      price: Number(complect.price) || 1,

      engine: Number(complect.engine) || 1,
      track_fuel: Number(complect.track_fuel) || 0.1,
      city_fuel: Number(complect.city_fuel) || 0.1,

      transmission: complect.transmission || 'Механическая',
      brakes: complect.brakes || 'Барабанные и дисковые',
      wheel_drive: complect.wheel_drive || 'Передний',

      weight: Number(complect.weight) || 1,
      headlights: complect.headlights || 'Галогеновые',

      hatch: Number(complect.hatch) || 0,
      tinting: Number(complect.tinting) || 0,

      airbag: Number(complect.airbag) || 1,

      heated_front_seats: Number(complect.heated_front_seats) || 0,
      heated_rear_seats: Number(complect.heated_rear_seats) || 0,

      salon: complect.salon || 'Пластик',
      seats: complect.seats || 'Тканевые',

      conditions: Number(complect.conditions) || 0,
      cruise_control: Number(complect.cruise_control) || 0,
      apple_carplay_android_auto:
        Number(complect.apple_carplay_android_auto) || 0,

      audio_speakers: Number(complect.audio_speakers) || 1,
      usb: Number(complect.usb) || 1,
    });

    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    if (editSaving) return;
    setShowEditModal(false);
    setEditingComplect(null);
  };

  const handleEditFormChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === 'checkbox') {
      setEditForm((prev) => ({
        ...prev,
        [name]: checked ? 1 : 0,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateComplectation = async (e) => {
    e.preventDefault();
    if (!editingComplect) return;

    setEditSaving(true);
    setEditError(null);

    try {
      if (!selectedModelId) throw new Error('Не выбрана модель');
      if (!editForm.complectation_name.trim())
        throw new Error('Укажите название комплектации');
      if (!editForm.price) throw new Error('Укажите цену');

      // отправляем JSON через PUT
      const payload = {
        model_id: selectedModelId,
        ...editForm,
      };

      const res = await fetch(`/api/complectation/${editingComplect.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      console.log('update response', res.status, data);

      await loadComplectations();
      setShowEditModal(false);
      setEditingComplect(null);
    } catch (err) {
      console.error(err);
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // ---------- УДАЛЕНИЕ КОМПЛЕКТАЦИИ ----------
  const [complectToDelete, setComplectToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleOpenDeleteModal = (complect) => {
    setComplectToDelete(complect);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteSaving) return;
    setShowDeleteModal(false);
    setComplectToDelete(null);
  };

 const handleConfirmDelete = async () => {
    if (!complectToDelete) return;

    setDeleteSaving(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/complectation/${complectToDelete.id}`, {
        method: 'DELETE',
      });

      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        // если сервер не вернул JSON
        console.warn('No JSON in delete response', e);
      }
      console.log('delete response', res.status, data);

      if (!res.ok) {
        throw new Error(data.message || 'Ошибка удаления комплектации');
      }

      setComplectations((prev) =>
        prev.filter((c) => c.id !== complectToDelete.id)
      );

      setShowDeleteModal(false);
      setComplectToDelete(null);
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
        <h4>Комплектации моделей</h4>
        <br />

        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            {/* Выбор модели */}
            <label className="form-label">Модель</label>
            <select
              className="form-select mb-3 w-100 p-2"
              style={descst}
              value={selectedModelId}
              onChange={handleModelChange}
            >
              {models.map((m) => (
                <option className="text-dark" value={m.id} key={m.id}>
                  {m.model_name}
                </option>
              ))}
            </select>

            {/* Таблица комплектаций */}
            <h4>Список комплектаций</h4>
            <br />
            <table style={tab} className="table table-striped">
              <thead>
                <tr className="table-dark">
                  <td style={{ width: '70%' }}>Комплектация</td>
                  <td style={{ width: '20%' }}>Цена</td>
                  <td style={{ width: '10%' }}></td>
                </tr>
              </thead>

              <tbody>
                {filteredComplectations.length > 0 ? (
                  filteredComplectations.map((item) => (
                    <tr key={item.id}>
                      <td>{item.complectation_name}</td>
                      <td>{item.price}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => handleOpenDeleteModal(item)}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Для этой модели нет комплектаций</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Кнопка "Добавить комплектацию" */}
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

        {/* Модальное окно добавления комплектации */}
        {showAddModal && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={handleCloseAddModal}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <form onSubmit={handleCreateComplectation}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Добавить комплектацию для модели
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseAddModal}
                      disabled={saving}
                    />
                  </div>

                  <div className="modal-body">
                    {saveError && (
                      <div className="text-danger mb-2">{saveError}</div>
                    )}

                    {/* БАЗОВОЕ */}
                    <div className="mb-3">
                      <label className="form-label">Название комплектации</label>
                      <input
                        type="text"
                        name="complectation_name"
                        className="form-control"
                        value={addForm.complectation_name}
                        onChange={handleAddFormChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Цена</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={addForm.price}
                        onChange={handleAddFormChange}
                      />
                    </div>

                    {/* ДВИГАТЕЛЬ / РАСХОД */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Мощность / объём двигателя
                        </label>
                        <input
                          min="1"
                          type="number"
                          name="engine"
                          className="form-control"
                          value={addForm.engine}
                          onChange={handleAddFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Расход по трассе</label>
                        <input
                          min="0.1"
                          type="number"
                          step="0.1"
                          name="track_fuel"
                          className="form-control"
                          value={addForm.track_fuel}
                          onChange={handleAddFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Расход в городе</label>
                        <input
                          min="0.1"
                          type="number"
                          step="0.1"
                          name="city_fuel"
                          className="form-control"
                          value={addForm.city_fuel}
                          onChange={handleAddFormChange}
                        />
                      </div>
                    </div>

                    {/* ТРАНСМИССИЯ / ТОРМОЗА / ПРИВОД */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Трансмиссия</label>
                        <select
                          id="transmission"
                          name="transmission"
                          className="form-select"
                          value={addForm.transmission}
                          onChange={handleAddFormChange}
                        >
                          <option value="Механическая">Механическая</option>
                          <option value="Вариатор">Вариатор</option>
                          <option value="Роботизированная">
                            Роботизированная
                          </option>
                          <option value="Автоматическая">Автоматическая</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Тормоза</label>
                        <select
                          id="brakes"
                          name="brakes"
                          className="form-select"
                          value={addForm.brakes}
                          onChange={handleAddFormChange}
                        >
                          <option value="Барабанные и дисковые">
                            Барабанные и дисковые
                          </option>
                          <option value="Дисковые">Дисковые</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Привод</label>
                        <select
                          id="wheel_drive"
                          name="wheel_drive"
                          className="form-select"
                          value={addForm.wheel_drive}
                          onChange={handleAddFormChange}
                        >
                          <option value="Передний">Передний</option>
                          <option value="Полный">Полный</option>
                        </select>
                      </div>
                    </div>

                    {/* ВЕС / ФАРЫ */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Масса</label>
                        <input
                          min="1"
                          type="number"
                          name="weight"
                          className="form-control"
                          value={addForm.weight}
                          onChange={handleAddFormChange}
                        />
                      </div>
                      <div className="col-md-8 mb-3">
                        <label className="form-label">Фары</label>
                        <select
                          id="headlights"
                          name="headlights"
                          className="form-select"
                          value={addForm.headlights}
                          onChange={handleAddFormChange}
                        >
                          <option value="Галогеновые">Галогеновые</option>
                          <option value="Светодиодные">Светодиодные</option>
                        </select>
                      </div>
                    </div>

                    {/* ЧЕКБОКСЫ ЭКСТЕРЬЕРА */}
                    <div className="row mb-3">
                      <div className="col-md-3 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="hatch"
                          name="hatch"
                          checked={addForm.hatch === 1}
                          onChange={handleAddFormChange}
                        />
                        <label className="form-check-label" htmlFor="hatch">
                          Люк
                        </label>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label" htmlFor="tinting">
                          Тонировка
                        </label>
                        <select
                          id="tinting"
                          name="tinting"
                          className="form-select"
                          value={addForm.tinting}
                          onChange={handleAddFormChange}
                        >
                          <option value={0}>Отсутствует</option>
                          <option value={1}>Частичная</option>
                          <option value={2}>Полная</option>
                        </select>
                      </div>
                    </div>

                    {/* БЕЗОПАСНОСТЬ / САЛОН */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Подушки безопасности
                        </label>
                        <input
                          min="1"
                          type="number"
                          name="airbag"
                          className="form-control"
                          value={addForm.airbag}
                          onChange={handleAddFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="salon">
                          Салон
                        </label>
                        <select
                          id="salon"
                          name="salon"
                          className="form-select"
                          value={addForm.salon}
                          onChange={handleAddFormChange}
                        >
                          <option value="Пластик">Пластик</option>
                          <option value="Кожаный с элементом пластика">
                            Кожаный с элементом пластика
                          </option>
                          <option value="Кожаный">Кожаный</option>
                        </select>
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="seats">
                          Сиденья
                        </label>
                        <select
                          id="seats"
                          name="seats"
                          className="form-select"
                          value={addForm.seats}
                          onChange={handleAddFormChange}
                        >
                          <option value="Тканевые">Тканевые</option>
                          <option value="Кожаные">Кожаные</option>
                        </select>
                      </div>
                    </div>

                    {/* ЧЕКБОКСЫ ОБОГРЕВОВ */}
                    <div className="row mb-3">
                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="heated_front_seats"
                          name="heated_front_seats"
                          checked={addForm.heated_front_seats === 1}
                          onChange={handleAddFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="heated_front_seats"
                        >
                          Подогрев передних сидений
                        </label>
                      </div>

                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="heated_rear_seats"
                          name="heated_rear_seats"
                          checked={addForm.heated_rear_seats === 1}
                          onChange={handleAddFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="heated_rear_seats"
                        >
                          Подогрев задних сидений
                        </label>
                      </div>
                    </div>

                    {/* КЛИМАТ И КРУИЗ */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="conditions">
                          Кондиционер / климат
                        </label>
                        <select
                          id="conditions"
                          name="conditions"
                          className="form-select"
                          value={addForm.conditions}
                          onChange={handleAddFormChange}
                        >
                          <option value={0}>Отсутствует</option>
                          <option value={1}>Кондиционер</option>
                          <option value={2}>
                            Климат-контроль однозонный
                          </option>
                          <option value={3}>
                            Климат-контроль двухзонный
                          </option>
                        </select>
                      </div>

                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cruise_control"
                          name="cruise_control"
                          checked={addForm.cruise_control === 1}
                          onChange={handleAddFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="cruise_control"
                        >
                          Круиз-контроль
                        </label>
                      </div>

                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="apple_carplay_android_auto"
                          name="apple_carplay_android_auto"
                          checked={addForm.apple_carplay_android_auto === 1}
                          onChange={handleAddFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="apple_carplay_android_auto"
                        >
                          Apple CarPlay и Android Auto
                        </label>
                      </div>
                    </div>

                    {/* МУЛЬТИМЕДИА */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Кол-во динамиков
                        </label>
                        <input
                          min="1"
                          type="number"
                          name="audio_speakers"
                          className="form-control"
                          value={addForm.audio_speakers}
                          onChange={handleAddFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Кол-во USB</label>
                        <input
                          min="1"
                          type="number"
                          name="usb"
                          className="form-control"
                          value={addForm.usb}
                          onChange={handleAddFormChange}
                        />
                      </div>
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

        {/* Модальное окно редактирования комплектации */}
        {showEditModal && editingComplect && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            onClick={handleCloseEditModal}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <form onSubmit={handleUpdateComplectation}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Редактировать комплектацию
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseEditModal}
                      disabled={editSaving}
                    />
                  </div>

                  <div className="modal-body">
                    {editError && (
                      <div className="text-danger mb-2">{editError}</div>
                    )}

                    {/* БАЗОВОЕ */}
                    <div className="mb-3">
                      <label className="form-label">Название комплектации</label>
                      <input
                        type="text"
                        name="complectation_name"
                        className="form-control"
                        value={editForm.complectation_name}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Цена</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={editForm.price}
                        onChange={handleEditFormChange}
                      />
                    </div>

                    {/* ДВИГАТЕЛЬ / РАСХОД */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Мощность / объём двигателя
                        </label>
                        <input
                          min="1"
                          type="number"
                          name="engine"
                          className="form-control"
                          value={editForm.engine}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Расход по трассе</label>
                        <input
                          min="0.1"
                          type="number"
                          step="0.1"
                          name="track_fuel"
                          className="form-control"
                          value={editForm.track_fuel}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Расход в городе</label>
                        <input
                          min="0.1"
                          type="number"
                          step="0.1"
                          name="city_fuel"
                          className="form-control"
                          value={editForm.city_fuel}
                          onChange={handleEditFormChange}
                        />
                      </div>
                    </div>

                    {/* ТРАНСМИССИЯ / ТОРМОЗА / ПРИВОД */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Трансмиссия</label>
                        <select
                          id="transmission_edit"
                          name="transmission"
                          className="form-select"
                          value={editForm.transmission}
                          onChange={handleEditFormChange}
                        >
                          <option value="Механическая">Механическая</option>
                          <option value="Вариатор">Вариатор</option>
                          <option value="Роботизированная">
                            Роботизированная
                          </option>
                          <option value="Автоматическая">Автоматическая</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Тормоза</label>
                        <select
                          id="brakes_edit"
                          name="brakes"
                          className="form-select"
                          value={editForm.brakes}
                          onChange={handleEditFormChange}
                        >
                          <option value="Барабанные и дисковые">
                            Барабанные и дисковые
                          </option>
                          <option value="Дисковые">Дисковые</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Привод</label>
                        <select
                          id="wheel_drive_edit"
                          name="wheel_drive"
                          className="form-select"
                          value={editForm.wheel_drive}
                          onChange={handleEditFormChange}
                        >
                          <option value="Передний">Передний</option>
                          <option value="Полный">Полный</option>
                        </select>
                      </div>
                    </div>

                    {/* ВЕС / ФАРЫ */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Масса</label>
                        <input
                          min="1"
                          type="number"
                          name="weight"
                          className="form-control"
                          value={editForm.weight}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="col-md-8 mb-3">
                        <label className="form-label">Фары</label>
                        <select
                          id="headlights_edit"
                          name="headlights"
                          className="form-select"
                          value={editForm.headlights}
                          onChange={handleEditFormChange}
                        >
                          <option value="Галогеновые">Галогеновые</option>
                          <option value="Светодиодные">Светодиодные</option>
                        </select>
                      </div>
                    </div>

                    {/* ЧЕКБОКСЫ ЭКСТЕРЬЕРА */}
                    <div className="row mb-3">
                      <div className="col-md-3 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="hatch_edit"
                          name="hatch"
                          checked={editForm.hatch === 1}
                          onChange={handleEditFormChange}
                        />
                        <label className="form-check-label" htmlFor="hatch_edit">
                          Люк
                        </label>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label" htmlFor="tinting_edit">
                          Тонировка
                        </label>
                        <select
                          id="tinting_edit"
                          name="tinting"
                          className="form-select"
                          value={editForm.tinting}
                          onChange={handleEditFormChange}
                        >
                          <option value={0}>Отсутствует</option>
                          <option value={1}>Частичная</option>
                          <option value={2}>Полная</option>
                        </select>
                      </div>
                    </div>

                    {/* БЕЗОПАСНОСТЬ / САЛОН */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Подушки безопасности
                        </label>
                        <input
                          min="1"
                          type="number"
                          name="airbag"
                          className="form-control"
                          value={editForm.airbag}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="salon_edit">
                          Салон
                        </label>
                        <select
                          id="salon_edit"
                          name="salon"
                          className="form-select"
                          value={editForm.salon}
                          onChange={handleEditFormChange}
                        >
                          <option value="Пластик">Пластик</option>
                          <option value="Кожаный с элементом пластика">
                            Кожаный с элементом пластика
                          </option>
                          <option value="Кожаный">Кожаный</option>
                        </select>
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label" htmlFor="seats_edit">
                          Сиденья
                        </label>
                        <select
                          id="seats_edit"
                          name="seats"
                          className="form-select"
                          value={editForm.seats}
                          onChange={handleEditFormChange}
                        >
                          <option value="Тканевые">Тканевые</option>
                          <option value="Кожаные">Кожаные</option>
                        </select>
                      </div>
                    </div>

                    {/* ЧЕКБОКСЫ ОБОГРЕВОВ */}
                    <div className="row mb-3">
                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="heated_front_seats_edit"
                          name="heated_front_seats"
                          checked={editForm.heated_front_seats === 1}
                          onChange={handleEditFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="heated_front_seats_edit"
                        >
                          Подогрев передних сидений
                        </label>
                      </div>

                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="heated_rear_seats_edit"
                          name="heated_rear_seats"
                          checked={editForm.heated_rear_seats === 1}
                          onChange={handleEditFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="heated_rear_seats_edit"
                        >
                          Подогрев задних сидений
                        </label>
                      </div>
                    </div>

                    {/* КЛИМАТ И КРУИЗ */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="conditions_edit">
                          Кондиционер / климат
                        </label>
                        <select
                          id="conditions_edit"
                          name="conditions"
                          className="form-select"
                          value={editForm.conditions}
                          onChange={handleEditFormChange}
                        >
                          <option value={0}>Отсутствует</option>
                          <option value={1}>Кондиционер</option>
                          <option value={2}>
                            Климат-контроль однозонный
                          </option>
                          <option value={3}>
                            Климат-контроль двухзонный
                          </option>
                        </select>
                      </div>

                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="cruise_control_edit"
                          name="cruise_control"
                          checked={editForm.cruise_control === 1}
                          onChange={handleEditFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="cruise_control_edit"
                        >
                          Круиз-контроль
                        </label>
                      </div>

                      <div className="col-md-4 form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="apple_carplay_android_auto_edit"
                          name="apple_carplay_android_auto"
                          checked={editForm.apple_carplay_android_auto === 1}
                          onChange={handleEditFormChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="apple_carplay_android_auto_edit"
                        >
                          Apple CarPlay и Android Auto
                        </label>
                      </div>
                    </div>

                    {/* МУЛЬТИМЕДИА */}
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">
                          Кол-во динамиков
                        </label>
                        <input
                          min="1"
                          type="number"
                          name="audio_speakers"
                          className="form-control"
                          value={editForm.audio_speakers}
                          onChange={handleEditFormChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Кол-во USB</label>
                        <input
                          min="1"
                          type="number"
                          name="usb"
                          className="form-control"
                          value={editForm.usb}
                          onChange={handleEditFormChange}
                        />
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

        {/* Модальное окно удаления комплектации */}
        {showDeleteModal && complectToDelete && (
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
                  <h5 className="modal-title">Удалить комплектацию?</h5>
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
                    Вы действительно хотите удалить комплектацию "
                    {complectToDelete.complectation_name}"?
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

export default EditComplectation;