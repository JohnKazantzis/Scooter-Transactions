import React from 'react';
import { Link } from "react-router-dom";

class TransferMoneyToAccount extends React.Component {
    state = {
        amount: 0,
        address: null,
        value: undefined
    }

    handleChange = event => {
        if(event.target.name === 'amount') {
            this.setState({amount: event.target.value});
        }
        else if(event.target.name === 'address') {
            this.setState({address: event.target.value});
        }       
    }

    handleSubmit = async event => {
        event.preventDefault();

        // Getting web3 instance and accounts
        const web3 = this.props.instance;
        const accounts = await web3.eth.getAccounts();

        // Converting Ether to Wei
        let ammountInWei = web3.utils.toWei(this.state.amount.toString(), 'ether');

        // Send Money
        this.setState({ address: accounts[1] });
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: this.state.address,
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
            </div>
        );
    }
}

export default TransferMoneyToAccount;