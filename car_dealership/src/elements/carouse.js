import cars from '../carousel.json'
import Slide from "./slide/slide"
import "../Carousel.css";
import Carousel from 'react-bootstrap/Carousel';
import { useState  } from 'react';

function Carouse() {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
};

return (
    
    //  баннер с авто 
    
    <Carousel activeIndex={index} controls={false} onSelect={handleSelect}> 
        {cars.map((item) => (
            <Carousel.Item key={item.id} interval={8000} >
                    <Slide {...item}/>
            </Carousel.Item>
        ))} 
        
    </Carousel>
         
    );
}

export default Carouse;
