import React, { useState, useEffect, useCallback, useMemo} from "react";
import InnerCity from "../innerCity";
import DealerStart from "./dealerstart";
import { YMapComponentsProvider, YMapClusterer, YMap, YMapFeatureDataSource, YMapDefaultSchemeLayer, YMapLayer, YMapMarker } from 'ymap3-components';
import { clusterByGrid} from '@yandex/ymaps3-clusterer';
import custom from "../../customization.json";
import "../../mapscircle.css"

import markeri from "../../assets/marker.svg";

const block = { height: "auto" };
const descst = { fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px" };
const hover = {
    backgroundColor: "#ffffff",
    width: "250px",
    height: "auto",
    marginLeft: "30px",
    marginTop: "-125px",
    padding: "5px 10px",
    fontFamily: "TT Supermolot Neue Trial Medium",
    border: "1px solid #c7c7c7",
    borderRadius: "10px",
}


// API Яндекс карты
const apiKey = "8735c427-2256-459f-9e73-3373945da236"; //

const maps = { width: "100%", height: "454px" };


function DStart() {

    const [city, setItems1] = useState([]);

    // Первый запрос (список городов)
          useEffect(() => {
            fetch('/api/city')
              .then(res => res.json())
              .then(data => {
                setItems1(data);
              })
              .catch(console.error);
          }, []);

    const [startdealers, setItems2] = useState([]);

    // Первый запрос (список городов)
          useEffect(() => {
            fetch('/api/dealers')
              .then(res => res.json())
              .then(data => {
                setItems2(data);
              })
              .catch(console.error);
          }, []);
    
    const gridSizedMethod = useMemo(() => clusterByGrid({ gridSize: 60 }), []);

    const points = useMemo(() => {
        return startdealers.map((dealer) => ({
        type: "Feature",
        id: dealer.id,
        geometry: { coordinates: [dealer.coord_x, dealer.coord_y] },
        properties: {
            name: dealer.name,
            city: dealer.city_name,
            street: dealer.street,
            home: dealer.home,
            open: dealer.open,
            closed: dealer.closed,
            phone: dealer.phone,
        },
        }));
    }, [startdealers]);

     const areEqual = (prevProps, nextProps) => {
     // Сравниваем содержимое feature. Можно добавить больше полей для сравнения
     return prevProps.feature.geometry.coordinates[0] === nextProps.feature.geometry.coordinates[0] &&
           prevProps.feature.geometry.coordinates[1] === nextProps.feature.geometry.coordinates[1] &&
           prevProps.feature.properties.name === nextProps.feature.properties.name;
 };

   const MyMarker = React.memo(function MyMarker({ feature }) {
    
      const [isHovered, setIsHovered] = useState(false);

      return (
          <YMapMarker coordinates={feature.geometry.coordinates} source={'my-source'}>
              <img
                  src={markeri}
                  style={{ width: "40px", height: "60px", marginLeft: "-20px", marginTop: "-90px", cursor: 'pointer' }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  alt={feature.properties.name}
              />
              {isHovered && (
                  <div style={hover}>
                      <b>{feature.properties.name}</b>
                      <br />
                      <p>
                          {feature.properties.city}, {feature.properties.street}, {feature.properties.home}
                      </p>
                      <p>{feature.properties.phone}</p>
                  </div>
              )}
          </YMapMarker>
      );
    }, areEqual);

    const marker = useCallback((feature) => <MyMarker feature={feature} />, []);

    const cluster = useCallback(
    (coordinates, features) => (
       <YMapMarker coordinates={coordinates} source={'my-source'}>
        <div className="circle">
            <div className="circle-content">
            <span className="circle-text">{features.length}</span>
            </div>
        </div>
        </YMapMarker>
    ),
    []
    );

    const [selectedCityId, setSelectedCityId] = useState(0); // Состояние для хранения ID выбранного города
    const [filteredDealers, setFilteredDealers] = useState([]); // отфильтрованный список дилеров
    const [mapLocation, setMapLocation] = useState({ center: [63.293146, 55.837424], zoom: 4 }); // Состояние для хранения координат карты
    const [selectedDealerId, setSelectedDealerId] = useState(null);   // Для выделения
    const [selectedDealerData, setSelectedDealerData] = useState(null); // Для хранения данных выбранного дилера

    //  Обработчик изменения города
    const handleCityChange = (event) => {
        const cityID = parseInt(event.target.value, 10);
        setSelectedCityId(cityID);
        const selectedCity = city.find(c => c.id === cityID);
        if (selectedCity) {
            setCityCoordinates(selectedCity);
        }
        };
    
    useEffect(() => {
        if (city.length > 0) {
            const firstCity = city[0];
            setSelectedCityId(firstCity.id);
            setCityCoordinates(firstCity);
        }
    }, [city]);

    const setCityCoordinates = (cityID) => {
        if (!cityID || !cityID.city) return;
        fetch(`https://geocode-maps.yandex.ru/v1/?apikey=${apiKey}&geocode=${cityID.city}&format=json`)
            .then((res) => res.json())
            .then((data) => {
            const geo = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
            const [longitude, latitude] = geo.split(" ").map(Number);
            setMapLocation({ center: [longitude, latitude], zoom: 11 });
            })
            .catch((err) => {
            console.error("Ошибка при получении координат:", err.message);
            });
        };

    // useEffect для фильтрации дилеров при изменении выбранного города
    useEffect(() => {
        const filtered = startdealers.filter(
            dealer => Number(dealer.city) === Number(selectedCityId)
        );
        setFilteredDealers(filtered);
        }, [selectedCityId, startdealers]);

     // useEffect для установки координат при загрузке компонента
     useEffect(() => {
        setCityCoordinates(0);
    }, []);

    const handleClick = (dealer) => {
        setSelectedDealerId(dealer.id);        // Для выделения
        setSelectedDealerData(dealer);         // Для хранения данных выбранного

    // Получение координат дилерского центра из API Яндекс.Карт
    const address = `Россия, ${dealer.city_name}, ${dealer.street}, дом ${dealer.home}`;
    fetch(`https://geocode-maps.yandex.ru/v1/?apikey=${apiKey}&geocode=${address}&format=json`)
            .then((res) => res.json())
            .then((data) => {
                const geo = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                const [longitude, latitude] = geo.split(" ").map(Number); // Разделяем и преобразуем в числа

                // Обновляем состояние с новыми координатами
                setMapLocation({ center: [longitude, latitude], zoom: 19 });
            })
            .catch((err) => {
                console.error("Ошибка при получении координат:", err.message); // Используем console.error для ошибок
                // Можно добавить fallback координаты или сообщение пользователю
            });

    };

    return (
        <>
            <div className="row" style={block}>
                <div className="col-12 col-lg-5 col-xxl-4 d-block">
                    <select
                        className="form-select mb-3 w-100 p-2"
                        style={descst}
                        value={selectedCityId}
                        onChange={handleCityChange}
                    >   
                        {city.map((item) => (
                            <option className="text-dark" value={item.id} key={item.id}>
                                <InnerCity {...item} />
                            </option>
                        ))}
                    </select>
                    <div className="list-group border d-block" style={{ height: "385px", overflowY: "scroll" }}>
                        {filteredDealers.length > 0 ? (
                            filteredDealers.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleClick(item)}
                                    className={`list-group-item list-group-item-action ${selectedDealerId === item.id ? 'bg-primary' : ''
                                        }`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <DealerStart {...item} />
                                </div>
                            ))
                        ) : (
                            <div>Нет дилеров в выбранном городе</div>
                        )}
                    </div>
                    <br />
                </div>
                <div className="col-12 col-lg-7 col-xxl-8 d-block">
                    <div style={maps}>
                        <YMapComponentsProvider apiKey={apiKey}>
                            <YMap location={mapLocation} >
                                <YMapDefaultSchemeLayer customization={custom}/>
                                <YMapFeatureDataSource id="my-source"/>
                                <YMapLayer source="my-source" type="markers" zIndex={1800}/>
                                <YMapClusterer
                                    key={JSON.stringify(points)}
                                    marker={marker}
                                    cluster={cluster}
                                    method={gridSizedMethod}
                                    features={points}
                                    />
                            </YMap>
                        </YMapComponentsProvider>
                    </div>
                </div>
            </div>
            <br />
        </>
    );
}

export default DStart;
