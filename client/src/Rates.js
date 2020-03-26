import React from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

class Rates extends React.Component {
    state = {
        error: false,
        ETH: null,
        BTC: null,
        XRP: null
    };

    componentDidMount = async () => {
        // Getting the exchange rates from the Coinlayer API
        
        const coin = 'EUR';

        const params = { target: coin };
        const headers = {'content-type':'application/json'}

        const response = await axios.get('http://127.0.0.1:5000/getExchangeRates/', {headers, params});
        console.log(response);

        if(response.status === 200) {
            this.setState({
                ETH: response.data.ETH,
                BTC: response.data.BTC,
                XRP: response.data.XRP
            });
        }
        else {
            this.setState({ error: true });
        }   
    }

    render() {
        if(this.state.error) {
            return(
                <div>
                    <div>
                        An Error Has Occurred!
                    </div>
                    <Link to='/'>
                        <button> Back </button>
                    </Link>
                </div>
            );
        }
        else {
            return(
                <div>
                    <div>
                        Exchange Rates:<br /><br />
                        ETH: {this.state.ETH}<br />
                        BTC: {this.state.BTC}<br />
                        XRP: {this.state.XRP}<br />
                    </div>
                    <Link to='/'>
                        <button> Back </button>
                    </Link>
                </div>
            );
        }
        
    }
}

export default Rates;