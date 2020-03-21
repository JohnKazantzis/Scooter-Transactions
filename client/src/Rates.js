import React from 'react';
import axios from 'axios';

class Rates extends React.Component {
    state = {
        error: false,
        ETH: null,
        BTC: null,
        XRP: null
    };

    componentDidMount = async () => {
        // Getting the exchange rates from the Coinlayer API
        const COINLAYER_URL = 'http://api.coinlayer.com/live';
        const COINLAYER_API_KEY = process.env.REACT_APP_COINLAYER_API_KEY;
        const coin = 'EUR';

        const params = { access_key: COINLAYER_API_KEY, target: coin };

        const response = await axios.get(COINLAYER_URL, {params});
        console.log(response);

        if(response.data.success) {
            this.setState({
                ETH: response.data.rates.ETH,
                BTC: response.data.rates.BTC,
                XRP: response.data.rates.XRP
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
                    An error has occurred!
                </div>
            );
        }
        else {
            return(
                <div>
                    Exchange Rates:<br /><br />
                    ETH: {this.state.ETH}<br />
                    BTC: {this.state.BTC}<br />
                    XRP: {this.state.XRP}<br />
                </div>
            );
        }
        
    }
}

export default Rates;