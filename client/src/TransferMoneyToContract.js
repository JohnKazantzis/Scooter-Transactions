import React from 'react';
import { Link } from "react-router-dom";
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
            return <li key={key}>{key}: {value.Name}, {value.FunctionName}</li>
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

        const response = await axios.post('http://127.0.0.1:5000/updateContract/', JSON.stringify(params));
        
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
                    <Link to='/'>
                        <button> Back </button>
                    </Link>
                </div>
            );
        }
        else {
            return(
                <div>
                    <header>
                        <h2>TransferMoneyToContract</h2><br/>
                    </header>
                    <main>
                        <section>
                            <ul>{this.state.existingContracts}</ul>
                        </section>
                        <section>
                            <h3>Add/Update Contract</h3>
                            <form onSubmit={this.handleSubmit}>
                                <label>Name: </label><br />
                                <input name='name' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                                <label>Contract Address: </label><br />
                                <input name='address' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                                <label>Payable Function (Insert '-' if its a fallback function): </label><br />
                                <input name='functionName' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                                <input type="submit" value="Submit" />
                            </form>
                        </section>
                    </main>
                    <Link to='/'>
                        <button> Back </button>
                    </Link>
                    {this.state.name}
                    {this.state.address}
                    {this.state.functionName}
                </div>
            );
        }
    }
}

export default TransferMoneyToContract;