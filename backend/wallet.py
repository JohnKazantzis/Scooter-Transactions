from pywallet import wallet

class walletUtils:
    @staticmethod
    def createSeed():
        return wallet.generate_mnemonic()
        