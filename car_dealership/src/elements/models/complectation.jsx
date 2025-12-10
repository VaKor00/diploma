import React, { Component} from "react";

const startText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"}; const text = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "20px"}

const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px", backgroundColor: "white", marginBottom: "10px", border: "none", color: "#4b4b4b"}   

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

    // const { id, img, model_name, description, min_price} = this.props;
   
    const { isOpen } = this.state;
    return (
      <>
        <div className="row">
            <div className="col-8">
                <h1 className="text-dark">Комплектейш нэйм</h1>
            </div>
            <div className="col-4 text-end">
                <button onClick={this.toggleOpen} style={descst}>
                    Подробнее
                </button>
            </div>
        </div>
        
        <div className={`content ${isOpen ? 'open' : ''}`} style={{height: "400px", backgroundColor: "white"}}>
          
          Контент 123456
        </div>
        <br></br>
      </>
    );
  }
}

export default Complectation;