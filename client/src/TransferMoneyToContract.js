import React from 'react';
//import { Link } from "react-router-dom";
import axios from 'axios';

class TransferMoneyToContract extends React.Component {
    state = {
        error: false,
        address: null,
        functionName: null,
        name: null,
        existingContracts: null
    };

    getExistingContracts = async () => {
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

        const existingContracts = Object.entries(response.data).map(([key, value]) => {
            // return <li key={key}>{key}: {value.Name}, {value.FunctionName}</li>
            return <button> {value.Name}</button>
        });

        this.setState({ existingContracts: existingContracts});
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
        }    
    }

    handleSubmit = async event => {
        event.preventDefault();
        // Adding new Contract

        const params = {
            name: this.state.name,
            functionName: this.state.functionName,
            address: this.state.address
        }
        console.log(JSON.stringify(params))

        const response = await axios.post('http://127.0.0.1:5000/updateAddContract/', JSON.stringify(params));
        
        if(response.status === 200) {
            console.log(response)
            await this.getExistingContracts();
        }
        else {
            this.setState({ error: true });
        }
    }

    deleteContract = async event => {
        event.preventDefault();

        const response = await axios.delete(`http://127.0.0.1:5000/deleteContract/${this.state.address}/`);

        if(response.status === 200) {
            console.log(response)
            await this.getExistingContracts();
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
                <div className="transferMoneyToContract">
                    <h1>Transfer Money To Contract</h1>
                    <main>
                        <section className="ulSection">
                            <ul>{this.state.existingContracts}</ul>
                        </section>
                        <section>
                            <form onSubmit={this.handleSubmit}>
                                <label>Name: </label>
                                <input name='name' type="text" value={this.state.value} onChange={this.handleChange} />
                                <label>Contract Address: </label>
                                <input name='address' type="text" value={this.state.value} onChange={this.handleChange} />
                                <label>Payable Function: </label>
                                <input name='functionName' type="text" value={this.state.value} onChange={this.handleChange} />
                                <div>
                                    <button onClick={this.handleSubmit}> Submit </button>
                                    <button onClick={this.deleteContract}> Delete </button>
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