import React from 'react';
import axios from 'axios';
//import { Link } from "react-router-dom";

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

        const response = await axios.get('https://green-wallet.herokuapp.com/getExchangeRates/', {headers, params});

        if(response.status === 200) {
            this.setState({
                ETH: response.data.ETH,
                BTC: response.data.BTC,
                XRP: response.data.XRP
            });

            this.props.onEthRateChange(response.data.ETH);
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
                </div>
            );
        }
        else {
            return(
                <div>
                    <div>
                        {/* <span>Exchange Rates:</span><br /><br /> */}
                        <b>ETH:</b> {this.state.ETH} €<br />
                        <b>BTC:</b> {this.state.BTC} €<br />
                        <b>XRP:</b> {this.state.XRP} €<br />
                    </div>
                </div>
            );
        }
        
    }
}

export default Rates;