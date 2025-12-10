import React, {Component} from "react";

const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "26px"} 
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px"}    

const h3 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "36px"}

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

class ModelsStart extends Component {
    render() {

        const { id, model_name, min_price, img } = this.props;

        return (
                <>
                    <div class="p-2">
                        <img src={img} alt={id} className="d-lg-block w-100"></img>
                        <br></br>
                        <h3 style={h3}>{model_name}</h3>
                        <p style={descst}>от {numberWithSpaces(min_price)} ₽</p>
                        <button style={buttons} type="button" className="btn btn-outline-dark btn-sm w-100">
                        Авто в наличии
                        </button>
                    </div>
                    <br></br>
               </>
          
        )
    }
}

export default ModelsStart;