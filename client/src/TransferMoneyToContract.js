import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

class TransferMoneyToContract extends React.Component {
    state = {
        error: false,
    };

    componentDidMount = async () =>{
        // Getting the exchange rates from the Coinlayer API
        
        const headers = {'content-type':'application/json'}

        const response = await axios.get('http://127.0.0.1:5000/getContracts/', {headers});
        console.log(response);

        if(response.status === 200) {
            console.log(response)
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
                        TransferMoneyToContract <br/>
                    </div>
                    <Link to='/'>
                        <button> Back </button>
                    </Link>
                </div>
            );
        }
    }
}

export default TransferMoneyToContract;