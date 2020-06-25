import React from 'react';
//import { Link } from "react-router-dom";

class Deposit extends React.Component {
    state = {
        amount: 0,
        cardNumber: null,
        chname: null,
        expMonth: null,
        expYear: null,
        CVV2CVC2: null,
        value: undefined,
        loading: false
    }
    
    handleChange = event => {
        if(event.target.name === 'cardNumber') {
            this.setState({cardNumber: event.target.value});
        }
        else if(event.target.name === 'chname') {
            this.setState({chname: event.target.value});
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

        // Start Loading
        this.setState({ loading: true });

        // Send Money
        await web3.eth.sendTransaction({
            from: accounts[1],
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

        // Stop Loading
        this.setState({ loading: false });
    }

    render() {
        if(this.state.loading) {
            return (
                <div>
                    <div className="loaderContainer">
                        <div class="lds-facebook"><div></div><div></div><div></div></div>
                    </div>
                        <div className="loadingComments">Your transaction is being processed. Please be patient!</div>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h1>
                        Deposit Money
                    </h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="inputs">
                            <label>Amount To Deposit (ETH): </label>
                            <input name='amount' type="number" value={this.state.value} onChange={this.handleChange} />
    
                            <label>Card Number: </label>
                            <input name='cardNumber' type="text" value={this.state.value} onChange={this.handleChange} />
    
                            <label>Card Holder Name: </label>
                            <input name='chname' type="text" value={this.state.value} onChange={this.handleChange} />
    
                            <label>Expiration Month: </label>
                            <input name='expMonth' type="number" value={this.state.value} onChange={this.handleChange} />
    
                            <label>Expiration Year: </label>
                            <input name='expYear' type="number" value={this.state.value} onChange={this.handleChange} />
    
                            <label>CVV2/CVC2: </label>
                            <input name='CVV2CVC2' type="text" value={this.state.value} onChange={this.handleChange} />
                            <button onClick={this.handleSubmit}> Deposit Funds </button>
                        </div>
                    </form>
                </div>
            );
        }
    }
}

export default Deposit;