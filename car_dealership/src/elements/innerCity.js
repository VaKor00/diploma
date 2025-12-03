import React, {Component} from "react";

class InnerCity extends Component {
    render() {
        const { id, city } = this.props;
        return (
            <>
            {city}
            </>
        );
        
    }
}

export default InnerCity;