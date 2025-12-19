const descst = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "24px"} 
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "26px"}    

const h1 = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "40px"}
const block = {height: "auto"}
const imgStL = {width: "100%", height: "450px", objectFit: "cover", clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)"}
const imgStR = {width: "100%", height: "450px", objectFit: "cover", clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)"}
const imgStM = {width: "100%", height: "300px", objectFit: "cover", clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)"}


function Bank(props) {
        
        const { name, logo, min_percent, max_percent, price, deposit, term } = props; //link

        // в пропсы добавить сумму кредита и срок

        // расчёт ежемесячного платежа, исходя из минимальной ставки

        const credit = price - ((price / 100) * deposit); // заемные средства

        const month = (min_percent/100)/12; //процент по ежемесячному платежу
        
        const priceMonth = credit * (month + (month/(Math.pow((1+month), term)-1)));

        return (
            <>
                <div className="container">
                    <div className="d-none d-lg-block col-12">
                        <div className="row">
                            <div className="col-1 justify-content-center">
                                <img src={logo} style={{width: "58px", height: "58px", objectFit: "contain"}} alt="logo"></img>
                            </div>
                            <div className="col-6 justify-content-center">
                                <h4 className="text-dark">{name}</h4>
                                <p className="text-secondary">Ставка от {min_percent}% до {max_percent}%</p>
                            </div>
                            <div className="col-5 justify-content-center">
                                <h1 className="text-secondary text-end">от {Math.trunc(priceMonth)} ₽/мес.</h1>
                            </div>
                        </div>
                    </div>
                    <div className="d-block d-lg-none col-12">
                        <div className="row">
                            <div className="row">
                                <div className="col-2 justify-content-center">
                                    <img src={logo} style={{width: "58px", height: "58px", objectFit: "contain"}} alt="logo"></img>
                                </div>
                                <div className="col-10">
                                    <h4 className="text-dark">{name}</h4>
                                    <p className="text-secondary">Ставка от {min_percent}% до {max_percent}%</p>
                                </div>
                            </div>
                            <div className="col-12">
                                <h1 className="text-secondary">от {Math.trunc(priceMonth)} ₽/мес.</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <br></br>
            </>
        );
        
    
}

export default Bank;