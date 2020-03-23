import React from 'react';
import Web3 from 'web3';
import Rates from './Rates';
import Deposit from './Deposit';
import TransferMoneyToAccount from './TransferMoneyToAccount';
import TransferMoneyToContract from './TransferMoneyToContract';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

// Importing the Contract's artifact
import deployedContract from './contracts/scooterTransactions.json';

class App extends React.Component {
    state = {
        walletBalance: null,
        contractInstance: null,
        accounts: null,
        contractAddr: null,
        totalBalance: 0,
        paymentAmount: 0
    };

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

        const contractInstance = new web3.eth.Contract(
            deployedContract.abi,
            contractAdrr
        );
        console.log(contractInstance);

        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance);

        // Setting the state
        this.setState({
            contractInstance: contractInstance,
            accounts: accounts,
            contractAddr: contractAdrr,
            walletBalance: walletBalance
        });

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
         

    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact>
                        <div>
                            Balance: {this.state.walletBalance} ETH<br /><br />
                            <Link to='/deposit'>
                                <button> Make A Deposit </button>
                            </Link>
                            <Link to='/rates'>
                                <button> Get Exchange Rates </button>
                            </Link>
                            <Link to='/TransferMoneyToContract'>
                                <button> Transfer Money To Contract </button>
                            </Link>
                            <Link to='/TransferMoneyToAccount'>
                                <button> Transfer Money To Account </button>
                            </Link>
                        </div>
                    </Route>
                    <Route path='/rates'>
                        <Rates />
                    </Route>
                    <Route path='/deposit'>
                        <Deposit />
                    </Route>
                    <Route path='/TransferMoneyToContract'>
                        <TransferMoneyToContract />
                    </Route>
                    <Route path='/TransferMoneyToAccount'>
                        <TransferMoneyToAccount />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;

