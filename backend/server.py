import sqlite3
from flask import Flask, request
import flask
from flask_classful import FlaskView, route
import requests
import json

app = Flask(__name__)

class ContractUtils:

    @staticmethod
    def getLocalContracts():
        f = open('../client/src/contracts/scooterTransactions.json')
        data = json.load(f)
        print(data['networks']['5777']['address'])
        scooterTransactionsAddr = data['networks']['5777']['address']
        print(scooterTransactionsAddr)

class APICalls:

    @staticmethod
    @app.route('/getExchangeRates/', methods=['GET'])
    def getExchangeRates():
        #
        # Making an API call to the CoinLayer API
        # to get the current exchange rates
        #
        data = request.args.to_dict()

        coin = data['target']
        COINLAYER_URL = 'http://api.coinlayer.com/live'
        COINLAYER_API_KEY = 'eb3c76bbef63fe4aa71b802bc25bef0c'
        PARAMS = { 'access_key': COINLAYER_API_KEY, 'target': coin }
        HEADERS = {'content-type':'application/json'}
        
        response = requests.get(url=COINLAYER_URL, params=PARAMS, headers=HEADERS)
        data = json.loads(response.text)

        dataToSent = {'ETH': data['rates']['ETH'],
                 'BTC': data['rates']['BTC'],
                 'XRP': data['rates']['XRP']
        }

        responseToReact = flask.Response(json.dumps(dataToSent))
        responseToReact.headers['Access-Control-Allow-Origin'] = '*'
        return responseToReact

        

if __name__ == "__main__":
    ContractUtils.getLocalContracts()
    app.run(debug=True)