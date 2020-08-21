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

class App extends React.Component {
    state = {
        web3instance: null,
        walletBalance: null,
        accounts: null,
        totalBalance: 0,
        paymentAmount: 0,
        token: "",
        mnemonic: "",
        ethRate: 350,
        loggedIn: false,
        loginShow: "login",
        loginButtonShow: "",
        loginCheck: true
    };

    componentDidMount = async () => {
        // Checking if the JWT Token is valid
        this.loginCheck();
    }

    initialiseWallet = async () => {
        const infuraApiKey = "97bda0faaf4b44cb87286a8c0dd98e16";

        // Creating a rinkeby TestNet provider
        const web3 = new Web3(new HDWalletProvider(localStorage.getItem("Mnemonic"), 'https://rinkeby.infura.io/v3/'+infuraApiKey));
        
        // Getting accounts
        const accounts = await web3.eth.getAccounts();

        // Get balance for account 0
        let walletBalance = await web3.eth.getBalance(accounts[0]);
        walletBalance = web3.utils.fromWei(walletBalance, 'finney');

        // Setting the state
        this.setState({
            accounts: accounts,
            walletBalance: walletBalance,
            web3instance: web3
        });

        this.logHelpInfo();
    }

    loginCheck = async () => {
        // Getting Token, if already exists
        const existingToken = localStorage.getItem("JWTtoken");
        const existingMnemonic = localStorage.getItem("Mnemonic");
        
        // Checking if the JWT Token is valid
        const headers = {'content-type':'application/json'}
        const params = {
            token: existingToken
        }
        
        const response = await axios.get('https://green-wallet.herokuapp.com/checkToken/?token='+existingToken, {headers, params});
        
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

    getEthRate = (ethRate) => {
        this.setState({ethRate: ethRate});
    }

    getCred = data => {
        // Save token to local storage
        localStorage.setItem("JWTtoken", data.token);
        localStorage.setItem("Mnemonic", data.mnemonic);

        this.setState({token: data.token, mnemonic: data.mnemonic}); 
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

    logHelpInfo = async () => {
        // Getting the Network Id and the address of the deployed Contract
        const netId = await this.state.web3instance.eth.net.getId();
        const contractAdrr = await deployedContract.networks[netId].address;

        // Print info
        console.log('### Helpful information for testing ###')
        console.log('Our wallet address: ' + this.state.accounts[0])
        console.log('Test wallet address to send money: ' + this.state.accounts[1])
        console.log('Test smart contract address to send money: ' + contractAdrr)
        console.log('Test smart contract address payable function: makePayment')
        console.log('########################################')
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
                                <li><a href="#deposit">Make A Deposit</a></li>
                                <li><a href="#transferMoney">Transfer Money</a></li>
                                <button className="logoutButton" onClick={this.logout}> Log Out </button>
                            </ul>
                        </div>
                        <div className="sectionsLayout">
                            <div id="balance-rates">
                                <div id="rates">
                                    <div>
                                        <span>Balance:</span> {parseFloat(this.state.walletBalance).toFixed(2)} Finney
                                    </div>
                                    <div>
                                        {/* <Rates onEthRateChange={this.getEthRate} /> */}
                                        ETH: 350<br />
                                        BTC: 2000<br />
                                        XRP: 3<br />
                                    </div>
                                </div>
                            </div>
                            <div id="deposit">
                                <div className="cardDetails">
                                    <Deposit instance={this.state.web3instance}
                                             onBalanceChange={this.balanceChange}
                                             ethRate={this.state.ethRate} />
                                </div>
                            </div>
                            <div id="transferMoney">
                                <Carousel easing="cubic-bezier(1,.15,.55,1.54)"
                                          tiltEasing="cubic-bezier(0.110, 1, 1.000, 0.210)"
                                          transitionMs={700}>
                                    <div id="transferMoneyToContract">
                                        <TransferMoneyToContract token={this.state.token}
                                                                 accounts={this.state.accounts}
                                                                 instance={this.state.web3instance}
                                                                 onBalanceChange={this.balanceChange} />
                                    </div>
                                    <div id="transferMoneyToAccount">
                                        <TransferMoneyToAccount instance={this.state.web3instance}
                                                                accounts={this.state.accounts}
                                                                onBalanceChange={this.balanceChange} />
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

