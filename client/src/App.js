import React from 'react';
import Web3 from 'web3';
import axios from 'axios';
import HDWalletProvider from "@truffle/hdwallet-provider";
import Rates from './Rates';
import Deposit from './Deposit';
import TransferMoneyToAccount from './TransferMoneyToAccount';
import TransferMoneyToContract from './TransferMoneyToContract';
import UserManagement from './UserManagement';

// Importing the Contract's artifact
import deployedContract from './contracts/scooterTransactions.json';

// Importing Css
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import Carousel from 'react-elastic-carousel';
// import Spinner from 'react-bootstrap/Spinner';

class App extends React.Component {
    state = {
        web3instance: null,
        walletBalance: null,
        contractInstance: null,
        accounts: null,
        contractAddr: null,
        totalBalance: 0,
        paymentAmount: 0,
        token: "",
        mnemonic: "",
        loggedIn: false,
        loginShow: "login",
        loginButtonShow: "",
        loginCheck: true
    };

    componentDidMount = async () => {
        // Checking if the JWT Token is valid
        console.log('####Init 11: ', this.state.token, this.state.mnemonic); 
        console.log('####Init LOCAL 11: ', localStorage.getItem("JWTtoken"), localStorage.getItem("Mnemonic")); 
        this.loginCheck();
        console.log('####Init 22: ', this.state.token, this.state.mnemonic);
        console.log('####Init LOCAL 22: ', localStorage.getItem("JWTtoken"), localStorage.getItem("Mnemonic")); 
        // const mnemonic = "multiply intact zone error sausage soap light prize potato limit excess subway";
        //console.log('Mnemonic returned: ', this.state.mnemonic, localStorage.getItem('Mnemonic'), this.state.mnemonic && this.state.token);
        //const existingMnemonic = localStorage.getItem("Mnemonic");
    }

    initialiseWallet = async () => {
        const infuraApiKey = "97bda0faaf4b44cb87286a8c0dd98e16";

        // Creating a rinkeby TestNet provider
        const web3 = new Web3(new HDWalletProvider(localStorage.getItem("Mnemonic"), 'https://rinkeby.infura.io/v3/'+infuraApiKey));

        // let privateKey = '3B673A55CC628BEC289F98EE13BEC78C0DEEEBC74D53ADFD0028D917704D79DB';

        // LOCAL NETWORK --------------------------------------------------------
        // // Creating a localhost provider http://127.0.0.1:8545 (truffle-config.js)
        // const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');

        // // Creating Web3 instance
        // const web3 = new Web3(provider);
        
        // Getting accounts
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        // -----------------------------------------------------------------------

        // Getting the Network Id and the address of the deployed Contract
        const netId = await web3.eth.net.getId();
        const contractAdrr = await deployedContract.networks[netId].address;
        console.log('NetId', netId);
        console.log('ContractId', contractAdrr);

        const contractInstance = new web3.eth.Contract(
            deployedContract.abi,
            contractAdrr
        );
        console.log(contractInstance);
        
        // // Getting Initial Contract Balance
        // console.log('Contract Balance: ', await contractInstance.methods['totalBalance()']().call());

        // // Sending Wei
        // let options = {
        //     from: accounts[0],
        //     value: 10
        // }
        // await contractInstance.methods.makePayment().send(options);

        // // // Getting Initial Contract Balance
        // console.log('$$$ New Contract Balance: ', await contractInstance.methods['totalBalance()']().call());

        // Get balance for account 0
        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance);
        console.log('Account[0] ' + walletBalance);

        // Get balance for account 1
        let secondAccBalance = await web3.eth.getBalance(accounts[1]);
        secondAccBalance = web3.utils.fromWei(secondAccBalance);
        console.log('Account[1] ' + secondAccBalance);

        // Setting the state
        this.setState({
            contractInstance: contractInstance,
            accounts: accounts,
            contractAddr: contractAdrr,
            walletBalance: walletBalance,
            web3instance: web3
        });
    }

    loginCheck = async () => {
        // Getting Token, if already exists
        const existingToken = localStorage.getItem("JWTtoken");
        const existingMnemonic = localStorage.getItem("Mnemonic");

        console.log('####TOKEN CHECK 11: ', localStorage.getItem("JWTtoken"), localStorage.getItem("Mnemonic"));
        

        // Checking if the JWT Token is valid
        const headers = {'content-type':'application/json'}
        const params = {
            token: existingToken
        }
        
        // const response = await axios.get('http://127.0.0.1:5000/checkToken/', {headers, params});
        response = await axios.get('https://green-wallet.herokuapp.com/checkToken/', {headers, params});
        console.log(response);

        
        if(response.data === 1) {
            this.setState({ token: existingToken, mnemonic: existingMnemonic });
            this.initialiseWallet();
        }
        else {
            this.setState({ token: "", mnemonic: "" });
            localStorage.setItem("JWTtoken", "");
            localStorage.setItem("Mnemonic", "");
        }
        this.setState({ loginCheck: false });
    }

    balanceChange = (balance) => {
        this.setState({walletBalance: balance});
    }

    getCred = data => {
        // Save token to local storage
        localStorage.setItem("JWTtoken", data.token);
        localStorage.setItem("Mnemonic", data.mnemonic);

        this.setState({token: data.token, mnemonic: data.mnemonic});
        console.log('App: ', this.state.token, this.state.mnemonic);   
        this.initialiseWallet();     
    }

    showUserManagement = event => {
        this.setState({ loginShow: "loginShow", loginButtonShow: "removeButton" });
    }

    logout = event => {
        this.setState( { loginShow: "login", loginButtonShow: "", token: "" } );
        localStorage.setItem("JWTtoken", "");
        localStorage.setItem("Mnemonic", "");
    }

    render() {
        if(this.state.loginCheck) {
            return(
                <div className="loginCheck">
                    <div className="loaderContainer">
                        <div className="lds-facebook"><div></div><div></div><div></div></div>
                    </div>
                    <div className="loadingComments">Checking For Active Session</div>
                </div>
            );
        }
        else {
            if(this.state.token) {
                return (
                    <div>
                        <div className="navbar">
                            <h1 className="logo">
                                <span className="logoSpan"><FontAwesomeIcon icon={faCoffee} /></span>GreenWallet
                            </h1>
                            <ul>
                                <li><a href="#balance-rates">Balance/Exchange Rates</a></li>
                                <li><a href="#deposit">Make A Deposit</a></li>
                                <li><a href="#transferMoney">Transfer Money</a></li>
                                <button className="logoutButton" onClick={this.logout}> Log Out </button>
                            </ul>
                        </div>
                        <div className="sectionsLayout">
                            <div id="balance-rates">
                                <div id="rates">
                                    <div>
                                        <span>Balance:</span> {parseFloat(this.state.walletBalance).toFixed(2)} ETH
                                    </div>
                                    <div>
                                        <Rates />
                                        {/* ETH: 1000000<br />
                                        BTC: 2000000<br />
                                        XRP: 3000000<br /> */}
                                    </div>
                                </div>
                            </div>
                            <div id="deposit">
                                <div className="cardDetails">
                                    <Deposit instance={this.state.web3instance} onBalanceChange={this.balanceChange} />
                                </div>
                            </div>
                            <div id="transferMoney">
                                <Carousel>
                                    <div id="transferMoneyToContract">
                                        <TransferMoneyToContract token={this.state.token} accounts={this.state.accounts} contractInstance={this.state.contractInstance} />
                                    </div>
                                    <div id="transferMoneyToAccount">
                                        <TransferMoneyToAccount instance={this.state.web3instance} accounts={this.state.accounts} onBalanceChange={this.balanceChange} />
                                    </div>
                                </Carousel>
                            </div>
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <div className="logoAppearing">
                            <h1 className="logo">
                                <span className="logoSpan"><FontAwesomeIcon icon={faCoffee} /></span>GreenWallet
                            </h1>
                        </div>
                        <div id="auth">
                            <button onClick={this.showUserManagement} className={this.state.loginButtonShow}> Log In / Create New Account </button>
                            <div id={this.state.loginShow}>
                                <UserManagement getCred={this.getCred} />
                            </div>
                        </div>                    
                    </div>
                );
            }
        }

    }
}

export default App;

