import React, {Component} from "react";


class ConditionSt extends Component {
    render() {
        const { id, condition } = this.props;
        return (
            <>
                <span className="text-light"> {condition}</span>
                <br></br>
            </>
        );
        
    }
}

export default ConditionSt;