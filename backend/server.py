import sqlite3
from flask import Flask, request
import flask
from flask_classful import FlaskView, route
from flask_cors import CORS
import requests
import json
from sqlalchemy import create_engine  
from sqlalchemy import Column, String, Integer 
from sqlalchemy.ext.declarative import declarative_base  
from sqlalchemy.orm import sessionmaker
import hashlib

from JWTTokenUtils import *

app = Flask(__name__)
CORS(app)

db_string = 'postgres://postgres:2310452227@localhost:5432/postgres'
db = create_engine(db_string)


base = declarative_base()

class Contract(base):  
    __tablename__ = 'Contracts'

    Name = Column(String)
    Address = Column(String, primary_key=True)
    FunctionName = Column(String)
    userId = Column(Integer)

class User(base):  
    __tablename__ = 'Users'

    Id = Column(Integer, primary_key=True, autoincrement=True)
    FirstName = Column(String)
    LastName = Column(String)
    Username = Column(String)
    Password = Column(String)


class UserUtils:

    @staticmethod
    def passwordHashing(password):
        # Creating the user's password hash
        return hashlib.sha224(password).hexdigest()

    @staticmethod
    @app.route('/checkToken/', methods=['GET'])
    def checkToken():
        data = request.args.to_dict()
        token = data['token']

        result = JWTTokenUtils.checkToken(token)
        if result is None:
            return '0'
        return '1'

    @staticmethod
    @app.route('/login/', methods=['GET'])
    def login():
        # Getting calls's parameters
        data = request.args.to_dict()

        # Creating session
        Session = sessionmaker(db)  
        session = Session()

        # Querying the database to validate the user's credentials
        users = session.query(User).filter(User.Username == data['username']).filter(User.Password == UserUtils.passwordHashing(data['password'].encode('utf-8')))

        for user in users:
            print('User found: {}, {}'.format(user.Username, user.Password))

            # Creating token
            token = JWTTokenUtils.createToken(user.Id)
            return {'token': token.decode('utf-8')}
        session.commit()

        return 'User not found!'

    @staticmethod
    @app.route('/createUser/', methods=['POST'])
    def createUser():
        data = request.values.to_dict()
        for key in data.keys():
            formData = json.loads(key)

        print(formData)

        # Creating session
        Session = sessionmaker(db)  
        session = Session()

        genesys = User(Username=formData['username'], Password=UserUtils.passwordHashing(formData['password'].encode('utf-8')))
        session.add(genesys)

        session.commit()

        return 'ok'

    @staticmethod
    @app.route('/deleteUser/', methods=['DELETE'])
    def deleteUser():
        data = request.args.to_dict()
        print(data)

        session.query(User).filter(User.Username == data['username']).filter(User.Password == UserUtils.passwordHashing(data['password'].encode('utf-8'))).delete()
        session.commit()

        return 'OK'    

class ContractUtils:

    @staticmethod
    def getLocalContracts():
        f = open('../client/src/contracts/scooterTransactions.json')
        data = json.load(f)
        
        scooterTransactionsAddr = data['networks']['5777']['address']
        print(scooterTransactionsAddr)

        return scooterTransactionsAddr

    @staticmethod
    @app.route('/getContracts/', methods=['GET'])
    def getContracts():
        #
        # Returning all the Contract entries in the db
        #
        Session = sessionmaker(db)  
        session = Session()
        
        contracts = session.query(Contract).order_by(Contract.Address)
        data = {}
        for contract in contracts:
            data[contract.Address] = {'Name': contract.Name, 'FunctionName': contract.FunctionName, 'Address': contract.Address}
        session.commit()
        
        print(data)
        responseToReact = flask.Response(json.dumps(data))
        responseToReact.headers['Access-Control-Allow-Origin'] = '*'
        return responseToReact

    @staticmethod
    @app.route('/deleteContract/<address>/', methods=['DELETE'])
    def deleteContract(address):
        print(address)

        Session = sessionmaker(db)  
        session = Session()

        # genesys = Contract(Address=address)
        # session.delete(genesys)

        session.query(Contract).filter(Contract.Address == address).delete()

        session.commit()
        
        return 'Contact Deleted'
    
    @staticmethod
    @app.route('/updateAddContract/', methods=['POST'])
    def updateContract():
        data = request.values.to_dict()
        for key in data.keys():
            formData = json.loads(key)

        # print(formData)

        Session = sessionmaker(db)  
        session = Session()

        # Checking if the Contract (address) already exists
        contracts = session.query(Contract)
        for contract in contracts:
            if formData['address'] == contract.Address:
                # If any field is different, update data!
                if (formData['name'] != contract.Name) or (formData['functionName'] != contract.FunctionName):
                    contract.Name = formData['name']
                    contract.FunctionName = formData['functionName']
                    session.commit()

                    return 'Contract Updated'
                return 'Contract Already exists'

        genesys = Contract(Name=formData['name'], Address=formData['address'], FunctionName=formData['functionName'])
        session.add(genesys)

        session.commit()
        
        return 'OK'



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

        


# Getting the address of the contract
scooterTransactionsAddr = ContractUtils.getLocalContracts()

Session = sessionmaker(db)  
session = Session()

base.metadata.create_all(db)

# genesys = Contract(Name='Coffee Story', Address='address02', FunctionName='paymentFunction')
# session.add(genesys)  
session.commit()

# users = session.query(User)
# for x in users:
#     print(x.LastName)

# # Connecting to the database
# db, base = ContractUtils.dbInit()

# # Creating Tables
# ContractUtils.create_tables(db)

token = JWTTokenUtils.createToken(1)
JWTTokenUtils.checkToken(token)
    
app.run(debug=True)