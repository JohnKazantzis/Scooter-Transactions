import React from 'react';
import { Link } from "react-router-dom";

class Deposit extends React.Component {
    state = {
        cardNumber: null,
        email: null,
        expMonth: null,
        expYear: null,
        CVV2CVC2: null,
        value: null
    }
    
    handleChange = event => {
        if(event.target.name === 'cardNumber') {
            this.setState({cardNumber: event.target.value});
        }
        else if(event.target.name === 'email') {
            this.setState({email: event.target.value});
        }
        else if(event.target.name === 'expMonth') {
            this.setState({expMonth: event.target.value});
        }
        else if(event.target.name === 'expYear') {
            this.setState({expYear: event.target.value});
        }
        else if(event.target.name === 'CVV2CVC2') {
            this.setState({CVV2CVC2: event.target.value});
        }
        
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <tr>
                            <label>Card Number: </label>
                            <input name='cardNumber' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                        </tr>
                        <tr>
                            <label>Email: </label>
                            <input name='email' type="email" value={this.state.value} onChange={this.handleChange} /><br />
                        </tr>
                        <tr>
                            <label>Expiration Month: </label>
                            <input name='expMonth' type="number" value={this.state.value} onChange={this.handleChange} /><br />
                        </tr>
                        <tr>
                            <label>Expiration Year: </label>
                            <input name='expYear' type="number" value={this.state.value} onChange={this.handleChange} /><br />
                        </tr>
                        <tr>
                            <label>CVV2/CVC2: </label>
                            <input name='CVV2CVC2' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                        </tr>
                        <input type="submit" value="Submit" />
                    </table>
                </form>
                <Link to='/'>
                    <button> Back </button>
                </Link>
                {this.state.cardNumber}
                {this.state.email}
                {this.state.expMonth}
                {this.state.expYear}
                {this.state.CVV2CVC2}
            </div>
        );
    }
}

export default Deposit;