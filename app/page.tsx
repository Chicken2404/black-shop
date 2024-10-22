"use client"
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaWallet } from 'react-icons/fa';
import algosdk from 'algosdk';
import { NetworkId, useWallet } from '@txnlab/use-wallet-react';
import React from "react";
import CartSummary from './components/CartSummary';
import Image from 'next/image';

const peraWallet = new PeraWalletConnect();

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function Home() {
  const {
    algodClient,
    activeAddress,
    setActiveNetwork,
    transactionSigner,
    wallets
  } = useWallet();
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const isConnectedToPeraWallet = !!accountAddress;
  const [products] = useState([
    { id: 1, name: "Black Coffee", price: 0.005, image: "https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmZe8MSWYnMxzPZXwnvvbnfQ9G8R3tjomPvxo7u3KS2Enw", description: "Strong and bold black coffee" },
    { id: 2, name: "Bubble Milk Tea", price: 0.008, image: "https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmZe8MSWYnMxzPZXwnvvbnfQ9G8R3tjomPvxo7u3KS2Enw", description: "Milk tea with soft black bubbles" },
    { id: 3, name: "Mango Smoothie", price: 0.007, image: "https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmZe8MSWYnMxzPZXwnvvbnfQ9G8R3tjomPvxo7u3KS2Enw", description: "Refreshing mango smoothie" },
    { id: 4, name: "Orange Juice", price: 0.006, image: "https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmZe8MSWYnMxzPZXwnvvbnfQ9G8R3tjomPvxo7u3KS2Enw", description: "Freshly squeezed orange juice" },
    { id: 5, name: "Matcha Ice Blended", price: 0.009, image: "https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmZe8MSWYnMxzPZXwnvvbnfQ9G8R3tjomPvxo7u3KS2Enw", description: "Rich and creamy matcha ice blended" },
    { id: 6, name: "Lemon Soda", price: 0.004, image: "https://peach-realistic-spider-498.mypinata.cloud/ipfs/QmZe8MSWYnMxzPZXwnvvbnfQ9G8R3tjomPvxo7u3KS2Enw", description: "Refreshing lemon soda" },
  ]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts: string[]) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e: Error) => console.log(e));
  }, [handleDisconnectWalletClick]);

  function handleConnectWalletClick() {
    wallets[0]
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0].address);
        setActiveNetwork(NetworkId.TESTNET);
        wallets[0].setActiveAccount(newAccounts[0].address)
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    wallets[0].disconnect();
    setAccountAddress(null);
  }

  function addToCart(product: Product) {
    setCart((prevCart) => [...prevCart, product]);
  }

  async function handlePurchase() {
    if (!accountAddress || !activeAddress) {
      alert('Please connect your wallet before making a payment.');
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    try {
      const atc = new algosdk.AtomicTransactionComposer()
      const suggestedParams = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: suggestedParams,
        from: accountAddress,
        to: "DTUA424DKCJYPHF5MLO6CL4R2BWOTH2GLOUQA257K5I7G65ENHSDJ4TTTE",
        amount: totalAmount * 1000000,
      });
      
      atc.addTransaction({ txn: transaction, signer: transactionSigner })

      const result = await atc.execute(algodClient, 2)
      console.info(`Transaction successful!`, {
        confirmedRound: result.confirmedRound,
        txIDs: result.txIDs
      })
      alert('Payment successful!')
      setCart([]);
    } catch (error) {
      console.error('Error during transaction:', error)
      alert('An error occurred during the payment process. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-black text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Beverage Voucher</h1>
          <button
            className="bg-white text-black px-4 py-2 rounded-full flex items-center hover:bg-gray-200 transition duration-300"
            onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick}
          >
            <FaWallet className="mr-2" />
            {isConnectedToPeraWallet ? "Disconnect Wallet" : "Connect Pera Wallet"}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Voucher List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={500} 
                height={300} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{product.price} Algo</span>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition duration-300 flex items-center"
                    onClick={() => addToCart(product)}
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CartSummary cart={cart} />

        <div className="flex justify-center mt-8">
          <button
            className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition duration-300 shadow-lg"
            onClick={handlePurchase}
          >
            Place Order
          </button>
        </div>
      </main>

      <footer className="bg-black text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Beverage Voucher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}