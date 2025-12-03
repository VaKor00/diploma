import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import "bootstrap-icons/font/bootstrap-icons.css";
import Carouse from './elements/carouse';
import Start from "./elements/start";
import startpage from "./startpage.json";
import conditionstart from "./conditionsstart.json";
import ConditionSt from "./elements/conditionst";

const logoText = {fontFamily: "TT Supermolot Neue Trial Expanded DemiBold", fontSize: "30px"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "22px"}    

// Карусель предложений на главной странице

const descst = {fontFamily: "TT Supermolot Neue Trial Medium"} 

function App() {
  return (
    <div className="App">
      
      {/* шапка сайта */}
      <header className="bg-dark" style={{ position: 'relative' }}> {/* Добавили position: relative */}
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand text-light" href="/" style={logoText}>
              <img src="logo.svg" style={{ width: '35px', height: '35px', marginTop: '-5px', marginRight: '10px' }} alt="logo" />
              PHOENIX
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav" style={buttons}> {/* Обновленные стили */}
            <ul className="navbar-nav custom-right-align">
              <li className="nav-item">
                  <a className="nav-link" href="#">
                    Модельный ряд
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Авто в наличии
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Автокредит
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Вход {/* в зависимости от авторизации будет меняться */}
                  </a>
                </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

        {/* тело сайта */}
      <Carouse/>
      <main class="container">
        {/* Разделитель для разделов */}
      <div>
      <br></br>
        {startpage.map((item) => (
            <div key={item.id} >
                    <Start {...item}/>
            </div>
        ))} 
        
      </div>
      </main>
      <footer className='bg-dark d-block'>
        <div class="container text-light" style={descst}>
          <br></br>
          {/* Тут будут отображаться условия для главной страницы сайта */}
            {conditionstart.map((item) => (
            <div key={item.id} >
                    <ConditionSt {...item}/>
            </div>
          ))} 
          <br></br>
          <p>Изложенная на данном сайте информация носит ознакомительный характер не является публичной офертой, определяемой положениями статей 435 и 437 Гражданского Кодекса Российской Федерации. Подробности актуальных предложений доступны в салонах официальных дилеров PHOENIX. Указанные на сайте цены, комплектации и технические характеристики, а также условия гарантии могут быть изменены в любое время без специального уведомления. Внешний вид товара, включая цвет, могут отличаться от представленных на фотографиях. Товар сертифицирован.</p>
          <br></br>
          <h3 className='text-center'>ОЦЕНИВАЙТЕ СВОИ ФИНАНСОВЫЕ ВОЗМОЖНОСТИ И РИСКИ!</h3>

          <hr></hr>
          <div class="row">
            <div class="text-center col-md-6 text-md-start">
              <a href="/" class="text-decoration-none text-light" style={logoText}>
                  <img src="logo.svg" style={{width: "35px", height: "35px", marginTop: "-5px"}} alt="logo"></img> PHOENIX</a>
              <br></br><br></br>
            </div>
            <div class="text-center col-md-6 text-md-end">
              <h5>Горячая линия</h5>
              <h3><a class="text-decoration-none text-light" href="tel:+78005553535">+7 800 555 35 35</a></h3>
              <h5>PHOENIX в социальных сетях</h5>
              <div>
                <a href="http://vk.com" class="text-decoration-none text-light" style={logoText}>
                <img src="img/socnetwork/vk.svg" style={{width: "45px", height: "45px", marginTop: "-5px"}} alt="logo"></img></a>
                <a href="http://vk.com" class="text-decoration-none text-light" style={logoText}>
                <img src="img/socnetwork/yt.svg" style={{width: "45px", height: "45px", marginTop: "-5px"}} alt="logo"></img></a>
                <a href="http://vk.com" class="text-decoration-none text-light" style={logoText}>
                <img src="img/socnetwork/tg.svg" style={{width: "45px", height: "45px", marginTop: "-5px"}} alt="logo"></img></a>
              
              </div>
              <br></br>
            </div>
            <h5 className='text-center text-md-start'>(с) 2025 ООО “ФЕНИКС АВТО”</h5> 
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
