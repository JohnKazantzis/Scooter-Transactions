import React from 'react';
import { Link } from "react-router-dom";

class TransferMoneyToContract extends React.Component {

    render() {
        return (
            <div>
                <div>
                    TransferMoneyToContract
                </div>
                <Link to='/'>
                    <button> Back </button>
                </Link>
            </div>
        );
    }
}

export default TransferMoneyToContract;