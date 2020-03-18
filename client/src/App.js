import React from 'react';
import Web3 from 'web3';

// Importing the Contract's artifact
import deployedContract from './contracts/scooterTransactions.json';

class App extends React.Component {
    state = { contractInstance: null,
        accounts: null,
        contractAddr: null,
        totalBalance: 0,
        paymentAmount: 0 };

    componentDidMount = async () => {
        
        // Creating a localhost provider http://127.0.0.1:8545 (truffle-config.js)
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');

        // Creating Web3 instance
        const web3 = new Web3(provider);
        
        // Getting accounts
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);

        // Getting the Network Id and the address of the deployed Contract
        const netId = await web3.eth.net.getId();
        const contractAdrr = await deployedContract.networks[netId].address;
        console.log(netId);
        console.log(contractAdrr);

        // Creating a new contract instance to be able interact with it
        // const contractInstance = new web3.eth.Contract(
        //     deployedContract.abi,
        //     netId && contractAdrr,
        // );
        const contractInstance = new web3.eth.Contract(
            deployedContract.abi,
            contractAdrr
        );
        console.log(contractInstance);

        // Setting the state
        this.setState({ contractInstance: contractInstance, accounts: accounts, contractAddr: contractAdrr });

        this.getTotalBalance();

    }

    getTotalBalance = async () => {
        const { contractInstance } = this.state;
        
        const response = await contractInstance.methods.totalBalance().call();
        
        console.log('Balance: ' + JSON.stringify(response));
        this.setState({ totalBalance: response });
    }

    makePayment = async (event) => {
        event.preventDefault();

        const { contractInstance, accounts, paymentAmount } = this.state;

        const options = { from:  accounts[0], value: paymentAmount };
        const response = await contractInstance.methods.makePayment().send(options);
        console.log('Transaction Hash: ' + JSON.stringify(response));
        
        this.getTotalBalance();
    }

    handleChange = event => {
        this.setState({paymentAmount: event.target.value});
    }
     

    render() {
        return (
            <div>
                <h1>Scooter Transactions</h1>
                <h4>Balance: {this.state.totalBalance}</h4>
                <form onSubmit={this.makePayment}>
                    <label>
                    Payment Amount:&nbsp;&nbsp;
                    <input type="number" value={this.state.paymentAmount} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default App;