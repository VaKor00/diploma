import React, {Component} from "react";

const black = {filter: "brightness(20%)", zIndex: "1", height: "500px", objectFit: "cover" };
const blackS = {filter: "brightness(20%)", zIndex: "1", height: "350px", objectFit: "cover" };

const startText = {position: "absolute", zIndex: "2", marginTop: "50px", fontFamily: "TT Supermolot Neue Trial Expanded DemiBold"};
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "28px"}    


class Slide extends Component {
    render() {
        const { id, img, name, descript, button, link } = this.props;

        return (
            <div>
                <img style={black} src={img} className="d-none d-lg-block w-100" alt={`Slide ${id}`} />
                <img style={blackS} src={img} className="w-100 d-sm-block d-lg-none" alt={`Slide ${id}`} />
                <div style={startText} className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between">
                    <div class="container text-center text-md-start">
                        <h1 className="text-light">{name} </h1>
                        <h3 className="text-light">{descript}</h3>
                        <button style={buttons} type="button" className="btn btn-outline-light btn-lg">
                            {button} <i className="bi bi-chevron-right"></i>
                        </button>
                        
                    </div>
                </div>
            </div>
        );
        
    }
}

export default Slide;