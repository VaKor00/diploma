import React, { Component} from "react";

const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px", backgroundColor: "white", marginBottom: "10px", border: "none", color: "#4b4b4b"}   
const descst1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "30px"} 
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px"}   

// import { Link } from '@inertiajs/react';

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

class Complectation extends Component { 
    
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
        
    };

    render() {

    const { id , complectation_name, price, engine, track_fuel, city_fuel, 
            transmission, brakes, wheel_drive, weight, headlights, hatch,
            tinting, airbag, heated_front_seats, heated_rear_seats, salon,
            seats, conditions, Cruise_control, apple_Carplay_android_auto,
            audio_speakers, usb} = this.props;
   
    const { isOpen } = this.state;

    
    // Алгоритм с определением отсутствует/частичная/полная 0/1/2 
    let tint = "";

    if (tinting == 0) 
      {
      tint = "Отсутствует";
      } 
    else if (tinting == 1) 
      {
      tint = "Частичная";
      } 
    else if (tinting == 2) {
      tint = "Полная";
      }

    // Алгоритм с определением отсутствует/только передние/для всего салона 0/1/2 
    let seats_heated = "";

    if (heated_front_seats == 0 && heated_rear_seats == 0) 
      {
      seats_heated = "Отсутствует";
      } 
    else if (heated_front_seats == 1 && heated_rear_seats == 0) 
      {
      seats_heated = "Только передние";
      } 
    else if (heated_front_seats == 1 && heated_rear_seats == 1) 
      {
      seats_heated = "Присутствует для всех сидений";
      }

    //* Отсутствует/Кодиционер/Климат-контроль однозонный//Климат-контроль двухзонный 0/1/2/3

    let climat = "";

    if (conditions == 0) 
      {
      climat = "Отсутствует";
      } 
    else if (conditions == 1) 
      {
      climat = "Кодиционер";
      } 
    else if (conditions == 2) 
      {
      climat = "Климат-контроль однозонный";
      }
    else if (conditions == 3) 
      {
      climat = "Климат-контроль двухзонный";
      }

    return (
      <>
        <div className="row" style={{ cursor: 'pointer' }} onClick={this.toggleOpen}>
        <div className="col-8">
          <h2 className="text-secondary">{complectation_name}</h2>
        </div>
        <div className="col-4 text-end">
          <h2 className="text-secondary">
          {isOpen == false ? (
            <i className="bi bi-chevron-down"></i>
          ) : (
            <i className="bi bi-chevron-up"></i>
          )}
          </h2>
        </div>
      </div>
        
        <div className={`content ${isOpen ? 'open' : ''}`} style={{height: "auto", backgroundColor: "white"}}>
          <br></br>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6">
                <h2>Технические характеристики</h2>
            
                <h3 className="text-dark">Мощность двигателя</h3>
                <p className="text-secondary"><span>{engine} л.с.</span></p>

                <h3 className="text-dark">Расход топлива</h3>
                <p className="text-secondary">Городской режим: <span>{city_fuel} л./100 км.</span></p>
                <p className="text-secondary">На трассе: <span>{track_fuel} л./100 км.</span></p>

                <h3 className="text-dark">Трансмиссия</h3>
                <p className="text-secondary"><span>{transmission}</span></p>

                <h3 className="text-dark">Тормоза</h3>
                <p className="text-secondary"><span>{brakes}</span></p>

                <h3 className="text-dark">Привод</h3>
                <p className="text-secondary"><span>{wheel_drive}</span></p>

                <h3 className="text-dark">Освещение</h3>
                <p className="text-secondary"><span>{headlights}</span></p>

                <h3 className="text-dark">Вес авто</h3>
                <p className="text-secondary"><span>{weight}</span></p>
              </div>
              <div className="col-12 col-md-6">
                <h2>Комфорт</h2>

                <h3 className="text-dark">Люк</h3>
                <p className="text-secondary"><span>{{hatch} == 1 ? "Отсутствует" : "Присутстсвует"}</span></p>

                <h3 className="text-dark">Круиз-контроль</h3>
                <p className="text-secondary"><span>{{Cruise_control} == 1 ? "Отсутствует" : "Присутстсвует"}</span></p>

                <h3 className="text-dark">Тонировка</h3>
                <p className="text-secondary"><span>{tint}</span></p>

                <h3 className="text-dark">Количество подушек безопасности</h3>
                <p className="text-secondary"><span>{airbag}</span></p>

                <h3 className="text-dark">Подогрев сидений</h3>
                {/* Алгоритм с определением отсутствует/только передние/для всего салона 0/1/2 */}
                <p className="text-secondary"><span>{seats_heated}</span></p>

                <h3 className="text-dark">Обшивка салона</h3>
                <p className="text-secondary"><span>{salon}</span></p>

                <h3 className="text-dark">Материал сидений</h3>
                <p className="text-secondary"><span>{seats}</span></p>
                
                <h3 className="text-dark">Климат авто</h3>
                {/* Отсутствует/Кодиционер/Климат-контроль однозонный//Климат-контроль двухзонный 0/1/2/3 */}
                <p className="text-secondary"><span>{climat}</span></p>
              </div>
              <div className="col-12 col-md-6">
                <h2>Мультимедиа</h2>

                <h3 className="text-dark">Aplle CarPlay и Android Auto</h3>
                <p className="text-secondary"><span>{{apple_Carplay_android_auto} == 1 ? "Отсутствует" : "Присутстсвует"}</span></p>

                <h3 className="text-dark">Количество аудиодинамиков</h3>
                <p className="text-secondary"><span>{audio_speakers}</span></p>

                <h3 className="text-dark">Количество USB разъемов</h3>
                <p className="text-secondary"><span>{usb}</span></p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-6">
                    
              </div>
              <div className="col-2">
              </div>
              <div className="col-4">
                    <p style={descst1}>от {numberWithSpaces(price)} ₽</p>
              </div>
            </div>
          </div>
        </div>
        <hr className="text-secondary"></hr>
        <br></br>
      </>
    );
  }
}

export default Complectation;