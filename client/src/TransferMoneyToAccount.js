import React from 'react';
import { Link } from "react-router-dom";

class TransferMoneyToAccount extends React.Component {
    state = {
        amount: null,
        address: null
    }

    handleChange = event => {
        if(event.target.name === 'amount') {
            this.setState({amount: event.target.value});
        }
        else if(event.target.name === 'address') {
            this.setState({address: event.target.value});
        }       
    }

    handleSubmit = event => {
        console.log('Transfer to Account Submitted')
    }

    render() {
        return (
            <div>
                <div>
                    TransferMoneyToAccount
                </div>
                <form onSubmit={this.handleSubmit}>
                    <label>Amount: </label>
                    <input name='amount' type="number" value={this.state.value} onChange={this.handleChange} /><br />
                    <label>Account Address: </label>
                    <input name='address' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                    <input type="submit" value="Submit" />
                </form>
                <Link to='/'>
                    <button> Back </button>
                </Link>
                {this.state.address}
                {this.state.amount}
            </div>
        );
    }
}

export default TransferMoneyToAccount;