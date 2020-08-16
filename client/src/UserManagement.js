import React from 'react';
//import { Link } from "react-router-dom";
import axios from 'axios';

class UserManagement extends React.Component {
    state = {
        username: '',
        password: ''
    };

    handleChange = event => {
        if(event.target.name === 'username') {
            this.setState({username: event.target.value});
        }
        else {
            this.setState({password: event.target.value});
        }   
    }

    handleSubmit = async event => {
        event.preventDefault();

        // Making API call to check the user's credentials
        const headers = {'content-type':'application/json'}
        const params = {
            username: this.state.username,
            password: this.state.password
        }

        const response = await axios.get('https://green-wallet.herokuapp.com/login/', {headers, params});
        const token = response.data.token;

        const LoginCredentials = {
            token: token,
            mnemonic: response.data.mnemonic
        };
        this.props.getCred(LoginCredentials);
        
    }

    createUser = async event => {
        event.preventDefault();

        // Making API call to create new user
        const params = {
            username: this.state.username,
            password: this.state.password
        }

        const response = await axios.post('https://green-wallet.herokuapp.com/createUser/', JSON.stringify(params));

    }

    deleteUser = async event => {
        event.preventDefault();

        // Making API call to create new user
        const headers = {'content-type':'application/json'}
        const params = {
            username: this.state.username,
            password: this.state.password
        }

        const response = await axios.delete('https://green-wallet.herokuapp.com/deleteUser/', { headers, params });
    }

    render() {
        return(
            <div>
                <header>
                    <h2>Log In/Create New User</h2>
                </header>
                <main className="userManagement">
                    <section>
                        <ul>{this.state.existingContracts}</ul>
                    </section>
                    <section className="UMutils">
                        <form onSubmit={this.handleSubmit}>
                            <div className="inputs">
                                <label>Username: </label>
                                <input name='username' type="text" value={this.state.value} onChange={this.handleChange} /><br />
                                <label>Password: </label>
                                <input name='password' type="password" value={this.state.value} onChange={this.handleChange} /><br />
                            </div>
                            <div>
                                <button onClick={this.handleSubmit}> Log In </button>
                                <button onClick={this.createUser}> Create New User </button>
                            </div>
                            {/* <button onClick={this.deleteUser}> Delete User </button> */}
                        </form>
                    </section>
                </main>
            </div>
        );
    }
}

export default UserManagement;