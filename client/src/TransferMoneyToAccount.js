import React from 'react';

class TransferMoneyToAccount extends React.Component {
    state = {
        amount: 0,
        address: null,
        value: undefined,
        loading: false
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
        const accounts = this.props.accounts;

        // Converting Finney to Wei
        let ammountInWei = web3.utils.toWei(this.state.amount.toString(), 'finney');

        // Start Loading
        this.setState({ loading: true });

        // Send Money
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: this.state.address,
            value: ammountInWei
        });

        // Get Wallet Balance
        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance, 'finney');

        // Setting App cmp state
        this.props.onBalanceChange(walletBalance += this.state.amount);

        // Stop Loading
        this.setState({ loading: false });
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="TMTAloaderContainer">
                    <div className="lds-facebook"><div></div><div></div><div></div></div>
                    {/* <div className="loadingComments">Your transaction is being processed. Please be patient!</div> */}
                </div>
            );
        }
        else {
            return (
                <div>
                    <h1>
                        Transfer Money To Account
                    </h1>
                    <form onSubmit={this.handleSubmit}>
                        <label>Amount: </label>
                        <input name='amount' type="number" value={this.state.value} onChange={this.handleChange} />
                        <label>Account Address: </label>
                        <input name='address' type="text" value={this.state.value} onChange={this.handleChange} />
                        <button onClick={this.handleSubmit}> Transfer Funds </button>
                    </form>
                </div>
            );
        }
    }
}

export default TransferMoneyToAccount;