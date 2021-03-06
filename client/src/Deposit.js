import React from 'react';

class Deposit extends React.Component {
    state = {
        amount: 0,
        cardNumber: null,
        chname: null,
        expMonth: null,
        expYear: null,
        CVV2CVC2: null,
        value: undefined,
        loading: false,
        amountInEuros: ""
    }
    
    handleChange = event => {
        // Function that saves the new values of the form inputs
        // to the react state
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

            if(event.target.value) {
                const web3 = this.props.instance;
                const amountInWei = web3.utils.toWei(event.target.value.toString(), 'finney');
                const amountInEth = web3.utils.fromWei(amountInWei);
                const amountToDisplay = amountInEth * this.props.ethRate;

                this.setState({amountInEuros: amountToDisplay});
            }
            else {
                this.setState({amountInEuros: ""});
            }
        }
        
    }

    handleSubmit = async event => {
        event.preventDefault();

        // Getting web3 instance and accounts
        const web3 = this.props.instance;
        const accounts = await web3.eth.getAccounts();

        // Converting Finney to Wei
        let ammountInWei = web3.utils.toWei(this.state.amount.toString(), 'finney');

        // Start Loading
        this.setState({ loading: true });

        // Send Money
        await web3.eth.sendTransaction({
            from: accounts[1],
            to: accounts[0],
            value: ammountInWei
        });

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
                <div>
                    <div className="loaderContainer">
                        <div className="lds-facebook"><div></div><div></div><div></div></div>
                        <div className="loadingComments">Your transaction is being processed. Please be patient!</div>
                    </div>
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
                            <label>Amount To Deposit (Finney): </label>
                            <input name='amount' type="number" value={this.state.value} onChange={this.handleChange} />

                            <label>Amount To Deposit (Euros): </label>
                            <input name='amountInEuros' type="number" value={this.state.amountInEuros} readOnly />
    
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