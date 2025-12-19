import React, { Component } from 'react';

class Salon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDesc: false,
      isMobile: window.innerWidth < 768,
      hoveredPoint: null, // для хранения точки, на которую навели
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth < 768 });
  };

  handleClick = () => {
    if (this.state.isMobile) {
      this.setState(prev => ({ showDesc: !prev.showDesc }));
    }
  };

  handleMouseEnter = () => {
    if (!this.state.isMobile) {
      this.setState({ showDesc: true });
    }
  };

  handleMouseLeave = () => {
    if (!this.state.isMobile) {
      this.setState({ showDesc: false, hoveredPoint: null });
    }
  };

  handlePointMouseEnter = (point) => {
    this.setState({ hoveredPoint: point });
  };

  handlePointMouseLeave = () => {
    this.setState({ hoveredPoint: null });
  };

  render() {
    const { src, points } = this.props; // points - массив {x, y, comment}
    const { hoveredPoint } = this.state;

    if (!src) return <div>Изображение не загружено</div>;

    return (
      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      >
        <div className='d-none d-md-block d-lg-none'>
        <img src={src} alt="Описание" style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
        </div>
        <div className='d-none d-lg-block d-xl-none'>
        <img src={src} alt="Описание" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
        </div>
        <div className='d-none d-xl-block d-xxl-none'>
        <img src={src} alt="Описание" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
        </div>
        <div className='d-none d-xxl-block'>
        <img src={src} alt="Описание" style={{ width: '100%', height: '550px', objectFit: 'cover' }} />
        </div>
        {/* Точки */}
        {points && points.map((point, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${point.y}%`,
              left: `${point.x}%`,
              width: '20px',
              height: '20px',
              backgroundColor: '#ebebebdc',
              borderRadius: '50%',
              border: '2px solid #a1a1a1ff',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => this.handlePointMouseEnter(point)}
            onMouseLeave={this.handlePointMouseLeave}
          />
        ))}
        {/* Комментарий при наведении на точку */}
        {hoveredPoint && (
          <div
            style={{
            position: 'absolute',
            top: `${hoveredPoint.y}%`,
            left: `${hoveredPoint.x}%`,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '5px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            transform: `
                    translate(
                    ${hoveredPoint.x > 50 ? '-110%' : '10%'},
                    ${hoveredPoint.y > 20 ? '-110%' : '10%'}
                    )
                `,
                }}
          >
            {hoveredPoint.comment}
          </div>
        )}
      </div>
    );
  }
}

export default Salon;