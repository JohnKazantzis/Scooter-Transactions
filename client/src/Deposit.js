import React from 'react';
import { Link } from "react-router-dom";

class Deposit extends React.Component {
    state = {
        cardNumber: null,
        email: null,
        monthOfexp: null,
        yearOfexp: null,
        CVV2CVC2: null
    }
    
    handleChange = event => {
        this.setState({paymentAmount: event.target.value});
    }

    render() {
        return (
            <div>
                <div>
                    Deposit
                </div>
                <Link to='/'>
                    <button> Back </button>
                </Link>
            </div>
        );
    }
}

export default Deposit;