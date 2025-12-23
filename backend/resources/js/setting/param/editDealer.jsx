import React, { useState, useEffect, useCallback } from 'react';
import Modaladddealer from './modaladddealer.jsx';
import Modaleditdealer from './modaleditdealer.jsx';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

function EditDealer() {
  const [showAddDealerModal, setShowAddDealerModal] = useState(false);
  const [showEditDealerModal, setShowEditDealerModal] = useState(false);
  const [dealerToEdit, setDealerToEdit] = useState(null);

  const handleOpenAddDealerModal = () => setShowAddDealerModal(true);
  const handleCloseAddDealerModal = () => setShowAddDealerModal(false);

  const handleOpenEditDealerModal = (dealer) => {
    setDealerToEdit(dealer);     // запоминаем, кого редактируем
    setShowEditDealerModal(true);
  };
  const handleCloseEditDealerModal = () => {
    setShowEditDealerModal(false);
    setDealerToEdit(null);
  };

  // ------------ ГОРОДА ДЛЯ СЕЛЕКТА ------------
  const [city, setItems1] = useState([]);

  useEffect(() => {
    fetch('/api/city')
      .then((res) => res.json())
      .then((data) => {
        setItems1(data);
      })
      .catch(console.error);
  }, []);

  // ------------ ДИЛЕРЫ ------------
  const [startdealers, setItems2] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(0);
  const [filteredDealers, setFilteredDealers] = useState([]);

  // функция загрузки дилеров (чтобы можно было вызывать после добавления)
  const loadDealers = useCallback(async () => {
    try {
      const res = await fetch('/api/dealers');
      const data = await res.json();
      setItems2(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // начальная загрузка дилеров
  useEffect(() => {
    loadDealers();
  }, [loadDealers]);

  // установка первого города по умолчанию
  useEffect(() => {
    if (city.length > 0 && selectedCityId === 0) {
      const firstCity = city[0];
      setSelectedCityId(firstCity.id);
    }
  }, [city, selectedCityId]);

  // смена города пользователем
  const handleCityChange = (event) => {
    const cityID = parseInt(event.target.value, 10);
    setSelectedCityId(cityID);
  };

  // фильтрация дилеров по выбранному городу
  useEffect(() => {
    const filtered = startdealers.filter(
      (dealer) => Number(dealer.city) === Number(selectedCityId)
    );
    setFilteredDealers(filtered);
  }, [selectedCityId, startdealers]);

  // добавление дилера из модалки
  const handleCreateDealer = async (form) => {
    const fd = new FormData();
    fd.append('city', form.city);
    fd.append('city_name', form.city_name);
    fd.append('street', form.street);
    fd.append('home', form.home);
    fd.append('name', form.name);
    fd.append('open', form.open);
    fd.append('closed', form.closed);
    fd.append('timezone', form.timezone);
    fd.append('phone', form.phone);
    fd.append('coord_x', form.coord_x);
    fd.append('coord_y', form.coord_y);

    const res = await fetch('/api/dealers', {
      method: 'POST',
      body: fd,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Ошибка сохранения дилерского центра');
    }

    await loadDealers();

  };

  // РЕДАКТИРОВАНИЕ дилера
  const handleEditDealer = async (form) => {
    if (!form.id) {
      throw new Error('Не указан ID дилерского центра');
    }

    const fd = new FormData();
    fd.append('city', form.city);
    fd.append('city_name', form.city_name);
    fd.append('street', form.street);
    fd.append('home', form.home);
    fd.append('name', form.name);
    fd.append('open', form.open);
    fd.append('closed', form.closed);
    fd.append('timezone', form.timezone);
    fd.append('phone', form.phone);
    fd.append('coord_x', form.coord_x);
    fd.append('coord_y', form.coord_y);

    const res = await fetch(`/api/dealers/${form.id}`, {
      method: 'PUT', 
      body: fd,
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || 'Ошибка сохранения дилерского центра');
    }

    await loadDealers();
    handleCloseEditDealerModal();
  };

  // дальше ваш код со slides/удалением — не трогаю

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ city: '' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

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
      const res = await fetch(`/api/dealers/${slideToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления дилерского центра');
      }

      // Убираем дилера из общего списка дилеров
      setItems2(prev => prev.filter(d => d.id !== slideToDelete.id));

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


  // смена пароля

  const [dealerForCreateLogin, setDealerForCreateLogin] = useState(null);
  const [dealerForChangePassword, setDealerForChangePassword] = useState(null);

  // формы
  const [createForm, setCreateForm] = useState({ login: '', password: '' });
  const [changeForm, setChangeForm] = useState({ password: '' });

  const [savingCreate, setSavingCreate] = useState(false);
  const [savingChange, setSavingChange] = useState(false);
  const [errorCreate, setErrorCreate] = useState(null);
  const [errorChange, setErrorChange] = useState(null);

  const handleOpenCreateLoginModal = (dealer) => {
    setDealerForCreateLogin(dealer);
    setCreateForm({ login: '', password: '' });
    setErrorCreate(null);
  };

  const handleCloseCreateLoginModal = () => {
    if (savingCreate) return;
    setDealerForCreateLogin(null);
  };

  const handleOpenChangePasswordModal = (dealer) => {
    setDealerForChangePassword(dealer);
    setChangeForm({ password: '' });
    setErrorChange(null);
  };

  const handleCloseChangePasswordModal = () => {
    if (savingChange) return;
    setDealerForChangePassword(null);
  };

  return (
    <>
      <div style={descst} className="p-3">
        <h4>Список городов</h4>
        <br />

        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}

        {!loading && !error && (
          <>
            <select
              className="form-select mb-3 w-100 p-2"
              style={descst}
              value={selectedCityId}
              onChange={handleCityChange}
            >
              {city.map((item) => (
                <option className="text-dark" value={item.id} key={item.id}>
                  {item.city}
                </option>
              ))}
            </select>

            <h4>Список дилеров</h4>
            <br />
            <table style={tab} className="table table-striped">
              <thead>
                <tr className="table-dark">
                  <td style={{ width: '20%' }}>Название</td>
                  <td style={{ width: '20%' }}>Адрес</td>
                  <td style={{ width: '10%' }}></td>
                  <td style={{ width: '10%' }}>График</td>
                  <td style={{ width: '10%' }}></td>
                  <td style={{ width: '15%' }}>Телефон</td>
                  <td style={{ width: '10%' }}></td>
                </tr>
              </thead>

              <tbody>
                {filteredDealers.length > 0 ? (
                  filteredDealers.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.street}</td>
                      <td>{item.home}</td>
                      <td>{item.open}</td>
                      <td>{item.closed}</td>
                      <td>{item.phone}</td>
                      <td className="text-end">
                        {
                          item.login == 1
                            ? (
                              // логин уже есть → смена пароля
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => handleOpenChangePasswordModal(item)}
                              >
                                <i className="bi bi-shield-fill"></i>
                              </button>
                            )
                            : (
                              // логина нет → создать логин/пароль
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => handleOpenCreateLoginModal(item)}
                              >
                                <i className="bi bi-shield"></i>
                              </button>
                            )
                        }
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => handleOpenEditDealerModal(item)}
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
                  <></>
                )}
              </tbody>
            </table>

            <div className="row">
              <div className="col-9"></div>
              <div className="col-3">
                <button
                  style={tab}
                  type="button"
                  className="w-100 btn btn-sm btn-dark rounded-0"
                  onClick={handleOpenAddDealerModal}
                >
                  Добавить
                </button>

                <Modaladddealer
                  show={showAddDealerModal}
                  onClose={handleCloseAddDealerModal}
                  onCreate={handleCreateDealer}
                />

                <Modaleditdealer
                  show={showEditDealerModal}
                  onClose={handleCloseEditDealerModal}
                  onSave={handleEditDealer}
                  dealer={dealerToEdit}
                />
              </div>
            </div>
          </>
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
                  <h5 className="modal-title">Удалить дилерский центр?</h5>
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

                  <p>Вы действительно хотите удалить дилерский центр?</p>
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

        {dealerForCreateLogin && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          onClick={handleCloseCreateLoginModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Добавить логин и пароль дилеру "{dealerForCreateLogin.name}"
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseCreateLoginModal}
                  disabled={savingCreate}
                />
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSavingCreate(true);
                setErrorCreate(null);

                try {
                  if (!createForm.login.trim() || !createForm.password.trim()) {
                    throw new Error('Укажите логин и пароль');
                  }

                  const res = await fetch(`/api/dealers/${dealerForCreateLogin.id}/credentials`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      login: createForm.login,
                      password: createForm.password,
                    }),
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    throw new Error(data.message || 'Ошибка сохранения данных');
                  }

                  await loadDealers();

                  handleCloseCreateLoginModal();
                } catch (err) {
                  console.error(err);
                  setErrorCreate(err.message);
                } finally {
                  setSavingCreate(false);
                }
              }}>
                <div className="modal-body">
                  {errorCreate && <div className="text-danger mb-2">{errorCreate}</div>}

                  <div className="mb-3">
                    <label className="form-label">Логин</label>
                    <input
                      type="text"
                      className="form-control"
                      value={createForm.login}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, login: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      value={createForm.password}
                      onChange={(e) =>
                        setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseCreateLoginModal}
                    disabled={savingCreate}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingCreate}
                  >
                    {savingCreate ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {dealerForChangePassword && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          onClick={handleCloseChangePasswordModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Смена пароля дилера "{dealerForChangePassword.name}"
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseChangePasswordModal}
                  disabled={savingChange}
                />
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSavingChange(true);
                setErrorChange(null);

                try {
                  if (!changeForm.password.trim()) {
                    throw new Error('Введите новый пароль');
                  }

                  const res = await fetch(`/api/dealers/${dealerForChangePassword.id}/password`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      password: changeForm.password,
                    }),
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    throw new Error(data.message || 'Ошибка смены пароля');
                  }

                  handleCloseChangePasswordModal();
                } catch (err) {
                  console.error(err);
                  setErrorChange(err.message);
                } finally {
                  setSavingChange(false);
                }
              }}>
                <div className="modal-body">
                  {errorChange && <div className="text-danger mb-2">{errorChange}</div>}

                  <div className="mb-3">
                    <label className="form-label">Новый пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      value={changeForm.password}
                      onChange={(e) =>
                        setChangeForm({ password: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseChangePasswordModal}
                    disabled={savingChange}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={savingChange}
                  >
                    {savingChange ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  );
}

export default EditDealer;