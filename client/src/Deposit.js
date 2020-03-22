import React from 'react';
import { Link } from "react-router-dom";

class Deposit extends React.Component {
    render() {
        return (
            <div>
                    <div>
                        Deposit
                    </div>
                    <Link to='/'>
                        <button> Back </button>
                    </Link>
            </div>
        );
    }
}

export default Deposit;