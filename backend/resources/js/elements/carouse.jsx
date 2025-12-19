import Slide from "./slide/slide"
import "../Carousel.css";
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect  } from 'react';

const images = import.meta.glob('../img/start/*.{jpg,jpeg,png}', { eager: true });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([key, value]) => [key.split('/').pop(), value.default])
);

function Carouse() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/carousel') // URL API
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(console.error);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  
  var tf;

  if (items.length <= 1)
    {
      tf = false;
    }
  else
    {
      tf = true;
    }

  return (
    
    <Carousel activeIndex={index} controls={false} indicators={tf} onSelect={handleSelect}>
      
      {items.map((item) => {
        return <Carousel.Item key={item.id} interval={8000}>
          <Slide {...item} img={item.img}/>
        </Carousel.Item>;
      })}
    </Carousel>
  );
}

export default Carouse;