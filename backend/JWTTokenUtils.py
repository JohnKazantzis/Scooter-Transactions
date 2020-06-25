import jwt
import datetime

# Secret Key for the JWT token
SECRET_KEY = 'UQWHUEHWQUIHEQ1243D'

class JWTTokenUtils:
    @staticmethod
    def createToken(userId):
        # userId = 1
        #print(str(datetime.datetime.utcnow()) + '\n')
        #print(str(datetime.timedelta(minutes=20)) + '\n')

        # Create JWT token
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=20),
            'iat': datetime.datetime.utcnow(),
            'sub': userId
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        print(token)

        return token

    @staticmethod
    def checkToken(token):
        # Decoding Token
        try:
            payload = jwt.decode(token, SECRET_KEY)
            print(payload['sub'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            print('Expired token')
            return None
        except jwt.InvalidTokenError:
            print('Invalid Token')
            return None