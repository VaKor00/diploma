import React, {act, Component} from "react";

const startText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"};
const text = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "20px"}   

const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "16px"}    

// получение данных о времени


class DealerStart extends Component {
    render() {

        const { city_name, street, home, name, open, closed, time_zone, phone } = this.props;

        // текущее время пользователя

        const date = new Date();
        const h = (date.getHours())
        const m = (date.getMinutes())
        const actH = date.getTimezoneOffset();
        const allMin = (((h * 60) + m) + actH)
        var tz;

        // перевод часового пояса для вычисления времени в минуты (отличие от Гринвича)

        if (time_zone >= 0)
            {
                tz = -Math.abs(time_zone) * 60
            }
        else if (time_zone < 0)
            {
                tz = Math.abs(time_zone) * 60
            }
        
        // время открытия и закрытия салона (01-01-2025 выбрано условно)
        
        const o = "01-01-2025 " + open;
        const с = "01-01-2025 " + closed;

        const op = new Date(o)
        const cl = new Date(с)

        var opn = "" // смена стиля

        if (allMin > ((cl.getHours() * 60) + cl.getMinutes() + tz) || allMin < ((op.getHours() * 60) + op.getMinutes() + tz))
            {
                opn = "text-danger"
            }
        else if (allMin < ((cl.getHours() * 60) + cl.getMinutes() + tz) || allMin > ((op.getHours() * 60) + op.getMinutes() + tz))
            {
                opn = "text-success"

                if ((((cl.getHours() * 60) + cl.getMinutes() + tz) - allMin) <= 60)
                {
                    opn = "text-warning"
                }
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
                        <button style={buttons} type="button" className="btn btn-sm btn-dark mb-1">
                        Перейти <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
            </>
        );
        
    }
}

export default DealerStart;