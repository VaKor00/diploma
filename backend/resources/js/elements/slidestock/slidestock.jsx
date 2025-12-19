import React, {useRef} from "react";
import ModelsStart from "./modelsStart";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useState, useEffect  } from 'react';

const block = {height: "auto"}
const buttons = {fontFamily: "TT Supermolot Neue Trial Medium", fontSize: "26px"}    

const images = import.meta.glob('../../img/cars/*.{jpg,jpeg,png}', { eager: true });

const imageMap = Object.fromEntries(
  Object.entries(images).map(([key, value]) => [key.split('/').pop().toLowerCase(), value.default])
);


function SlideStock() {
// обработчик карусели прокрутки

        const responsive = {
            desktop: {
                breakpoint: { max: 3840, min: 1200 },
                items: 3,
                slidesToSlide: 1,
                partialVisibilityGutter: 0,
            },
            tablet: {
                breakpoint: { max: 1200, min: 768 },
                items: 2,
                slidesToSlide: 1,
                partialVisibilityGutter: 0,
            },
            mobile: {
                breakpoint: { max: 767, min: 0 },
                items: 1,
                slidesToSlide: 1,
                partialVisibilityGutter: 0,
            },
        };

        const carouselRef = useRef();

        const handlePrev = () => {
            if (carouselRef.current) {
            carouselRef.current.previous();
            }
        };

        const handleNext = () => {
            if (carouselRef.current) {
            carouselRef.current.next();
            }
        };

        const [items, setItems] = useState([]);
        
          useEffect(() => {
            fetch('/api/models')
              .then(res => res.json())
              .then(data => {
                setItems(data);
              })
              .catch(console.error);
          }, []);

        
        return (
            <>
                    <div className="row" style={block}>
                    <div className="col-2 col-md-1 d-flex justify-content-center text-center">
                        <button style={buttons} type="button" className="btn btn-lg btn-info" onClick={handlePrev}>
                        <i className="bi bi-chevron-left"></i>
                        </button>
                    </div>
                    <div className="col-8 col-md-10">
                        <div>
                        <Carousel
                            ref={carouselRef}
                            responsive={responsive}
                            arrows={false}
                            infinite={true}
                            autoPlay={false}
                            >
                            {items.map((item) => {
                                
                                const imgKey = item.img ? item.img.split('/').pop().toLowerCase() : null;
                                return (
                                <div key={item.id} className="text-center">
                                    <ModelsStart {...item} img={imgKey ? imageMap[imgKey] : undefined} />
                                </div>
                                );
                            })}
                        </Carousel>
                        </div>
                    </div>
                    <div className="col-2 col-md-1 d-flex justify-content-center text-center">
                        <button style={buttons} type="button" className="btn btn-lg btn-info" onClick={handleNext}>
                        <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    </div>
                    <br></br>
                </>
        )
};

export default SlideStock;