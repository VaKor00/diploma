import React, {act, Component} from "react";

const startText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"}; const text = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "20px"}

const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "16px"}

// получение данных о времени

class DealerStart extends Component { render() {

    const { id, city_name, street, home, name, open, closed, timezone, phone } = this.props;

    // текущее время пользователя

    const date = new Date();
    const h = (date.getHours())
    const m = (date.getMinutes())
    const actH = date.getTimezoneOffset();
    const allMin = (((h * 60) + m) + actH)
    var tz;

    // перевод часового пояса для вычисления времени в минуты (отличие от Гринвича)

    if (timezone >= 0)
        {
            tz = -Math.abs(timezone) / 60
        }
    else if (timezone < 0)
        {
            tz = Math.abs(timezone) / 60
        }
    
    // время открытия и закрытия салона (01-01-2025 выбрано условно)
    
    const o = "01-01-2025 " + open;
    const c = "01-01-2025 " + closed;

    const op = new Date(o)
    const cl = new Date(c)

    const openMinutes = (op.getHours() * 60) + op.getMinutes() + tz;
    const closeMinutes = (cl.getHours() * 60) + cl.getMinutes() + tz;

    let opn = ""; // смена стиля
    if (allMin >= openMinutes && allMin <= closeMinutes) {
        // Время внутри интервала — салон открыт
        opn = "text-success";

        if ((closeMinutes - allMin) <= 60) {
            // Осталось менее часа до закрытия
            opn = "text-warning";
        }
    } else {
        // Время вне интервала — салон закрыт
        opn = "text-danger";
    }

    return (
        <>
            <h4 class="text-dark" style={startText}>{name}</h4>
            <span className="text-dark" style={text}>{city_name}, {street}, {home}</span><br></br>
            <span className={opn} style={text}><i class="bi bi-clock"></i> {open} - {closed}</span>
            <br></br><br></br>
            <div class="row">
                <div class="col-7 col-md-6">
                    <span className="text-secondary" style={text}><i class="bi bi-telephone"></i> <a class="text-decoration-none text-secondary" href={"tel:" + phone}>{phone}</a></span>
                </div>
                <div class="col-5 col-md-6 text-end">
                    <a style={buttons} type="button" className="btn btn-sm btn-dark mb-1 rounded-0" href={`/dealer/${id}`}>
                    Перейти <i className="bi bi-chevron-right"></i>
                    </a>
                </div>
            </div>
            
        </>
    );
    
}
}

export default DealerStart;