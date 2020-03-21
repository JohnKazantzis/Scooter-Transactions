import React from 'react';
import axios from 'axios';

class Rates extends React.Component {

    componentDidMount = async () => {
        // Getting the exchange rates from the Coinlayer API
        // const COINLAYER_URL = 'http://api.coinlayer.com/live';
        // const COINLAYER_API_KEY = process.env.REACT_APP_COINLAYER_API_KEY;
        // const coin = 'EUR';

        // const params = { access_key: COINLAYER_API_KEY, target: coin };

        // const response = await axios.get(COINLAYER_URL, {params});
        // console.log(response);
    }

    render() {
        return(
            <div>
                Rates
            </div>
        );
    }
}

export default Rates;