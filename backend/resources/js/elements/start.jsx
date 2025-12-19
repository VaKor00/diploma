import SlideStock from "./slidestock/slidestock"
import DStart from "./dstart/dstart"

const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px"} 
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "26px"}    

const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}
const block = {height: "auto"}
const imgStL = {width: "100%", height: "450px", objectFit: "cover", clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)"}
const imgStR = {width: "100%", height: "450px", objectFit: "cover", clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)"}
const imgStM = {width: "100%", height: "300px", objectFit: "cover", clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)"}


function Start(props) {
        
        const { id, name, edit_content, desc, button_bool, button, link, img, priority } = props; //link

        return (
            <>
            {edit_content === 1 ? 
            <div>
                <h1 style={h1} class="text-center">{name}</h1>
                <br></br>
                {(id % 2 === 0) ?
                <div class="row h-auto">
                    <div class="col-12 col-xl-8 d-flex align-items-center text-center" style={descst}>
                        <div>
                        <p class="text-sm-start">{desc}</p>
                        
                        {button_bool === true ? 
                        <button style={buttons} type="button" className="btn btn-outline-dark btn-lg">
                            {button} <i className="bi bi-chevron-right"></i>
                        </button>
                        : ""}
                        <br></br>
                        <br></br>
                        </div>
                    </div>
                    
                    <div class="d-none d-xl-block col-4"><img src={img} style={imgStL} alt={`Startpage ${id}`} /></div>
                    <div class="d-block d-xl-none col-12 "><img src={img} style={imgStM} alt={`Startpage ${id}`} /></div>
                </div>
                : 
                <div class="row" style={block}>
                    <div class="d-none d-xl-block col-4"><img src={img} style={imgStR} alt={`Startpage ${id}`} /></div>
                    <div class="col-12 col-xl-8 d-flex align-items-center text-center" style={descst}>
                        <div>
                        <p class="text-sm-start">{desc}</p>
                        {button_bool === true ? 
                        <button style={buttons} type="button" className="btn btn-outline-dark btn-lg">
                            {button} <i className="bi bi-chevron-right"></i>
                        </button> 
                        : ""}
                        <br></br>
                        <br></br>
                        </div>
                    </div>
                    <div class="d-block d-xl-none col-12 "><img src={img} style={imgStM} alt={`Startpage ${id}`} /></div>
                </div>
                }
                <br></br>
            </div>
            : 
            (name === "Модельный ряд") ? 
                <div>
                <h1 style={h1} class="text-center">{name}</h1>
                    <br></br>
                        <SlideStock/>
                </div>
                : 
                (name === "Дилеры") ? 
                <div>
                <h1 style={h1} class="text-center">{name}</h1>
                    <br></br>
                        <DStart/>
                </div>
                : ""
            }
            </>
        );
        
    
}

export default Start;