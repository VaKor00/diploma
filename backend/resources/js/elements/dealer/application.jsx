import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

const descst = { fontFamily: 'TT Supermolot Neue Trial Medium' };
const tab = { fontSize: '20px', width: '100%' };

function Applications() {
  const { props } = usePage();
  const dealerId = props.dealerId;

  const [clients, setClients] = useState([]);
  const [carsByVin, setCarsByVin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Записи на ТО
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  const [servicesSavingId, setServicesSavingId] = useState(null);

  // модалки по броням/продажам
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [clientToDelete1, setClientToDelete1] = useState(null);
  const [showDeleteModal1, setShowDeleteModal1] = useState(false);
  const [deleteSaving1, setDeleteSaving1] = useState(false);
  const [deleteError1, setDeleteError1] = useState(null);

  const handleOpenDeleteModal = (client) => {
    setClientToDelete(client);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteSaving) return;
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    setDeleteSaving(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления заявки');
      }

      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (err) {
      console.error(err);
      setDeleteError(err.message);
    } finally {
      setDeleteSaving(false);
    }
  };

  const handleOpenDeleteModal1 = (client) => {
    setClientToDelete1(client);
    setDeleteError1(null);
    setShowDeleteModal1(true);
  };

  const handleCloseDeleteModal1 = () => {
    if (deleteSaving1) return;
    setShowDeleteModal1(false);
    setClientToDelete1(null);
  };

  const handleConfirmDelete1 = async () => {
    if (!clientToDelete1) return;

    setDeleteSaving1(true);
    setDeleteError1(null);

    try {
      const res = await fetch(`/api/clients/sale/${clientToDelete1.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления заявки');
      }

      setClients((prev) => prev.filter((c) => c.id !== clientToDelete1.id));
      setShowDeleteModal1(false);
      setClientToDelete1(null);
    } catch (err) {
      console.error(err);
      setDeleteError1(err.message);
    } finally {
      setDeleteSaving1(false);
    }
  };

  useEffect(() => {
    if (!dealerId) {
      setError('Не задан dealerId');
      setLoading(false);
      setServicesLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const carsRes = await fetch('/api/cars');
        if (!carsRes.ok) throw new Error('Ошибка загрузки автомобилей');
        const carsData = await carsRes.json();

        const dealerCars = carsData.filter(
          (car) => Number(car.dealer_id) === dealerId
        );

        const vinMap = {};
        dealerCars.forEach((car) => {
          if (car.vin) {
            vinMap[car.vin] = car;
          }
        });
        setCarsByVin(vinMap);

        const dealerVins = Object.keys(vinMap);
        if (dealerVins.length === 0) {
          setClients([]);
          setLoading(false);
        } else {
          const clientsRes = await fetch('/api/clients');
          if (!clientsRes.ok) throw new Error('Ошибка загрузки заявок');
          const clientsData = await clientsRes.json();

          const filteredClients = clientsData
            .filter((cl) => dealerVins.includes(cl.vin_car))
            .map((cl) => ({
              ...cl,
              carId: vinMap[cl.vin_car]?.id ?? null,
            }));

          setClients(filteredClients);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    const loadServices = async () => {
      try {
        const res = await fetch(`/api/technical-service/dealer/${dealerId}`);
        if (!res.ok) throw new Error('Ошибка загрузки записей на ТО');
        const data = await res.json();
        setServices(data);
        setServicesLoading(false);
      } catch (err) {
        console.error(err);
        setServicesError(err.message);
        setServicesLoading(false);
      }
    };

    loadData();
    loadServices();
  }, [dealerId]);

  const goToCar = (carId) => {
    if (!carId) return;
    window.open(`/carinfo/${carId}`, '_blank', 'noopener,noreferrer');
  };

  const getStatusText = (status) => {
    switch (Number(status)) {
      case 1:
        return 'Ожидает подтверждения';
      case 2:
        return 'Подтверждено, ожидает приезда';
      case 3:
        return 'Авто на СТО';
      case 4:
        return 'Завершено';
      default:
        return 'Неизвестный статус';
    }
  };

  // Получаем подпись кнопки статуса по status_ts
  const getStatusButtonLabel = (status) => {
    if (status === 1) return 'Подтвердить';
    if (status === 2) return 'Прибыл на ТО';
    if (status === 3) return 'Завершить';
    if (status === 4) return null; // или 'Завершено' и кнопку не показывать
    return null;
  };


  // Клик по кнопке статуса
  const handleStatusClick = async (service) => {
    const current = Number(service.status_ts);

    // если уже 4 — ничего не делаем
    if (current >= 4) return;

    let newStatus = current;
    if (current === 1) newStatus = 2;
    else if (current === 2) newStatus = 3;
    else if (current === 3) newStatus = 4;

    setServicesSavingId(service.id);
    try {
      const tokenTag = document.querySelector('meta[name="csrf-token"]');

      const res = await fetch(`/api/technical-service/${service.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenTag ? { 'X-CSRF-TOKEN': tokenTag.content } : {}),
        },
        body: JSON.stringify({ status_ts: newStatus }),
        credentials: 'same-origin',
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Ошибка смены статуса');
      }

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? data.service : s))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setServicesSavingId(null);
    }
  };

  // Крестик — отмена записи (DELETE)
  const handleDeleteService = async (service) => {
    if (!window.confirm('Отменить запись на ТО?')) return;

    setServicesSavingId(service.id);
    try {
      const res = await fetch(`/api/technical-service/${service.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Ошибка удаления записи на ТО');
      }

      setServices((prev) => prev.filter((s) => s.id !== service.id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setServicesSavingId(null);
    }
  };

  return (
    <div style={descst} className="p-3">
      <h4>Заявки по автомобилям дилера</h4>
      <br />

      {loading && <div>Загрузка...</div>}
      {error && <div className="text-danger">{error}</div>}

      {!loading && !error && (
        <>
          <table style={tab} className="table table-striped">
            <thead>
              <tr className="table-dark">
                <td style={{ width: '20%' }}>Имя</td>
                <td style={{ width: '20%' }}>Телефон</td>
                <td style={{ width: '20%' }}>VIN автомобиля</td>
                <td style={{ width: '15%' }}>Авто</td>
                <td style={{ width: '25%' }}></td>
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Заявок не найдено
                  </td>
                </tr>
              )}

              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>
                    <a
                      style={{ textDecoration: 'none' }}
                      href={'tel:' + client.phone}
                    >
                      {client.phone}
                    </a>
                  </td>
                  <td>{client.vin_car}</td>
                  <td>
                    {client.carId ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => goToCar(client.carId)}
                      >
                        Показать авто
                      </button>
                    ) : (
                      <span className="text-muted">Авто не найдено</span>
                    )}
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => handleOpenDeleteModal1(client)}
                    >
                      Продажа
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => handleOpenDeleteModal(client)}
                    >
                      Снять бронь
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <hr />

      {/* Записи на ТО */}
      <h4>Записи на ТО</h4>
      <br />

      {servicesLoading && <div>Загрузка записей на ТО...</div>}
      {servicesError && <div className="text-danger">{servicesError}</div>}

      {!servicesLoading && !servicesError && (
        <table style={tab} className="table table-striped">
          <thead>
            <tr className="table-dark">
              <td style={{ width: '15%' }}>Дата</td>
              <td style={{ width: '15%' }}>Время</td>
              <td style={{ width: '20%' }}>VIN</td>
              <td style={{ width: '15%' }}>ID клиента</td>
              <td style={{ width: '15%' }}>Статус</td>
              <td style={{ width: '20%' }}>Действия</td>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  Записавшихся на ТО нет
                </td>
              </tr>
            )}

            {services.map((s) => {
              const label = getStatusButtonLabel(Number(s.status_ts));
              return (
                <tr key={s.id}>
                  <td>{s.date_service}</td>
                  <td>{s.time_service}</td>
                  <td>{s.vin}</td>
                  <td>{s.client_id}</td>
                  <td>{getStatusText(s.status_ts)}</td>
                  <td>
                    {/* Кнопка смены статуса */}
                    {label && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => handleStatusClick(s)}
                        disabled={servicesSavingId === s.id}
                      >
                        {servicesSavingId === s.id ? 'Сохранение...' : label}
                      </button>
                    )}

                    {/* Крестик — отмена записи */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteService(s)}
                      disabled={servicesSavingId === s.id}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Модальные окна по заявкам (бронь/продажа) — без изменений */}
      {showDeleteModal && clientToDelete && (
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
                <h5 className="modal-title">Снять бронь?</h5>
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
                  Вы действительно хотите снять бронь на VIN{' '}
                  <strong>{clientToDelete.vin_car}</strong>?
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

      {showDeleteModal1 && clientToDelete1 && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          onClick={handleCloseDeleteModal1}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Снять бронь?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDeleteModal1}
                  disabled={deleteSaving1}
                />
              </div>

              <div className="modal-body">
                {deleteError1 && (
                  <div className="text-danger mb-2">{deleteError1}</div>
                )}

                <p>
                  Вы подтверждаете продажу авто с VIN{' '}
                  <strong>{clientToDelete1.vin_car}</strong>?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDeleteModal1}
                  disabled={deleteSaving1}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete1}
                  disabled={deleteSaving1}
                >
                  {deleteSaving1 ? 'Продажа...' : 'Продать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applications;