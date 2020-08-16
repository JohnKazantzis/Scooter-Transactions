import React from 'react';
import axios from 'axios';

class TransferMoneyToContract extends React.Component {
    state = {
        error: false,
        address: null,
        functionName: null,
        name: null,
        amount: null,
        existingContracts: null
    };

    GETABIKEY = '1ZBVIFP43EPWIJV97N7EW6Z6JUU4AGPW1M';

    getExistingContracts = async () => {
        // Getting the exchange rates from the Coinlayer API
        
        const headers = {'content-type':'application/json'}
        const params = {
            token: this.props.token
        }


        const response = await axios.get('https://green-wallet.herokuapp.com/getContracts/', {headers, params});

        if(response.status === 200) {
            const existingContracts = Object.entries(response.data).map(([key, value]) => {
                return <button key={value.Address} onClick={e => this.submitTransactionButton(e, value)}> {value.Name}</button>
            });
    
            this.setState({ existingContracts: existingContracts});
        }
        else {
            this.setState({ error: true });
        }

    }

    componentDidMount = async () => {
        await this.getExistingContracts();
    }

    handleChange = event => {
        if(event.target.name === 'name') {
            this.setState({name: event.target.value});
        }
        else if(event.target.name === 'address') {
            this.setState({address: event.target.value});
        }else if(event.target.name === 'functionName') {
            this.setState({functionName: event.target.value});
        }else if(event.target.name === 'amount') {
            this.setState({amount: event.target.value});
        }    
    }

    handleSubmit = async event => {
        event.preventDefault();
        // Adding new Contract

        const params = {
            name: this.state.name,
            functionName: this.state.functionName,
            address: this.state.address,
            token: this.props.token
        }

        const response = await axios.post('https://green-wallet.herokuapp.com/updateAddContract/', JSON.stringify(params));
        
        if(response.status === 200) {
            await this.getExistingContracts();
        }
        else {
            this.setState({ error: true });
        }
    }

    deleteContract = async event => {
        event.preventDefault();

        const response = await axios.delete(`https://green-wallet.herokuapp.com/deleteContract/${this.state.address}/`);

        if(response.status === 200) {
            await this.getExistingContracts();
        }
        else {
            this.setState({ error: true });
        }
    }

    submitTransaction = async event => {
        event.preventDefault();

        // Getting the web3 instance and the account list
        // from the props passed by the parent component
        const web3 = this.props.instance;
        let accounts = this.props.accounts;
        
        // Getting ABI from etherscan so we dont have to 
        // have every contract source code locally
        const headers = {'content-type':'application/json'}
        const response = await axios.get(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${this.state.address}&apikey=${this.GETABIKEY}`, {headers});

        // Creating the contract instance
        const contractInstance = new web3.eth.Contract(
            JSON.parse(response.data.result),
            this.state.address
        );

        // Converting Finney -> Wei
        let ammountInWei = web3.utils.toWei(this.state.amount.toString(), 'finney');

        // Sending Wei
        let options = {
            from: accounts[0],
            value: ammountInWei
        }
        await contractInstance.methods[this.state.functionName]().send(options);

        // Get Wallet Balance
        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance, 'finney');

        // Setting App cmp state
        this.props.onBalanceChange(walletBalance += this.state.amount);
    }

    submitTransactionButton = async (event, value) => {
        event.preventDefault();

        // Getting the web3 instance and the account list
        // from the props passed by the parent component
        const web3 = this.props.instance;
        let accounts = this.props.accounts;
        
        // Getting ABI from etherscan so we dont have to 
        // have every contract source code locally
        const headers = {'content-type':'application/json'}
        const response = await axios.get(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${value.Address}&apikey=${this.GETABIKEY}`, {headers});

        // Creating the contract instance
        const contractInstance = new web3.eth.Contract(
            JSON.parse(response.data.result),
            value.Address
        );

        // Converting Finney -> Wei
        let ammountInWei = web3.utils.toWei(this.state.amount.toString(), 'finney');

        // Sending Wei
        let options = {
            from: accounts[0],
            value: ammountInWei
        }
        await contractInstance.methods[value.FunctionName]().send(options);

        // Get Wallet Balance
        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance, 'finney');

        // Setting App cmp state
        this.props.onBalanceChange(walletBalance += this.state.amount);
    }

    render() {
        if(this.state.error) {
            return(
                <div>
                    <div>
                        An Error Has Occurred!
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="transferMoneyToContract">
                    <h1>Transfer Money To Contract</h1>
                    <main>
                        <section className="ulSection">
                            <ul>{this.state.existingContracts}</ul>
                        </section>
                        <section>
                            <form onSubmit={this.handleSubmit}>
                                <label>Amount: </label>
                                <input name='amount' type="number" value={this.state.value} onChange={this.handleChange} />
                                <label>Name: </label>
                                <input name='name' type="text" value={this.state.value} onChange={this.handleChange} />
                                <label>Contract Address: </label>
                                <input name='address' type="text" value={this.state.value} onChange={this.handleChange} />
                                <label>Payable Function: </label>
                                <input name='functionName' type="text" value={this.state.value} onChange={this.handleChange} />
                                <div>
                                    <button onClick={this.submitTransaction}> Submit </button>
                                    <button onClick={this.handleSubmit}> Save Contract </button>
                                </div>
                            </form>
                        </section>
                    </main>
                </div>
            );
        }
    }
}

export default TransferMoneyToContract;