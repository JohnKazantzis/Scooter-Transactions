import React from 'react';
import { Link } from "react-router-dom";

class TransferMoneyToAccount extends React.Component {

    render() {
        return (
            <div>
                <div>
                    TransferMoneyToAccount
                </div>
                <Link to='/'>
                    <button> Back </button>
                </Link>
            </div>
        );
    }
}

export default TransferMoneyToAccount;