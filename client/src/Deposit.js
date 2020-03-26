import React from 'react';
import { Link } from "react-router-dom";

class Deposit extends React.Component {
    state = {
        amount: 0,
        cardNumber: null,
        email: null,
        expMonth: null,
        expYear: null,
        CVV2CVC2: null,
        value: undefined
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
        else if(event.target.name === 'amount') {
            this.setState({amount: event.target.value});
        }
        
    }

    handleSubmit = async event => {
        console.log('Deposit Submitted')

        event.preventDefault();

        // Getting web3 instance and accounts
        const web3 = this.props.instance;
        const accounts = await web3.eth.getAccounts();

        // Converting Ether to Wei
        let ammountInWei = web3.utils.toWei(this.state.amount.toString(), 'ether');

        // Send Money
        await web3.eth.sendTransaction({
            from: accounts[4],
            to: accounts[0],
            value: ammountInWei
        });

        // Get Wallet Balance
        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance);
        console.log(walletBalance);

        let walletBalance1 = await web3.eth.getBalance(accounts[1]);
        walletBalance1 = web3.utils.fromWei(walletBalance1);
        console.log(walletBalance1);

        // Setting App cmp state
        this.props.onBalanceChange(walletBalance += this.state.amount);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Amount To Deposit (ETH): </label>
                    <input name='amount' type="number" value={this.state.value} onChange={this.handleChange} /><br /><br />

                    <label>Card Number: </label>
                    <input name='cardNumber' type="text" value={this.state.value} onChange={this.handleChange} /><br />

                    <label>Email: </label>
                    <input name='email' type="email" value={this.state.value} onChange={this.handleChange} /><br />

                    <label>Expiration Month: </label>
                    <input name='expMonth' type="number" value={this.state.value} onChange={this.handleChange} /><br />

                    <label>Expiration Year: </label>
                    <input name='expYear' type="number" value={this.state.value} onChange={this.handleChange} /><br />

                    <label>CVV2/CVC2: </label>
                    <input name='CVV2CVC2' type="text" value={this.state.value} onChange={this.handleChange} /><br />

                    <input type="submit" value="Submit" />
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