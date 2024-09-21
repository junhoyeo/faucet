import { HDNodeWallet, JsonRpcProvider, Wallet, parseEther } from 'ethers';

import { requestFaucet } from './faucet';
import { SupportedNetwork } from './types';

const generateRandomWallet = () => Wallet.createRandom();
const sendFunds = async (
  network: SupportedNetwork,
  fromWallet: HDNodeWallet,
  toAddress: string,
  amount: string,
) => {
  const RPC_URL =
    network === 'wemix' ? 'https://api.test.wemix.com' : 'https://public-en-kairos.node.kaia.io';
  const provider = new JsonRpcProvider(RPC_URL);
  const signer = fromWallet.connect(provider);

  let tx: any = {
    from: signer.address,
    to: toAddress,
    value: parseEther(amount),
  };

  if (network === 'wemix') {
    const gasPrice = await provider.getFeeData();
    const gasEstimate = await provider.estimateGas(tx);
    tx = { ...tx, gasLimit: gasEstimate, gasPrice: gasPrice.gasPrice };
  }
  if (network === 'klaytn') {
    tx = { ...tx, gas: '85000000', gasPrice: '25000000000' };
  }

  try {
    const sendTransaction = await signer.sendTransaction(tx);
    const receipt = await sendTransaction.wait();
    console.log(
      `Transaction successful! Sent ${amount} ${
        network === 'wemix' ? 'WEMIX' : 'KLAY'
      } tokens to ${toAddress}. Receipt:`,
      receipt,
    );
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};

export const requestFunds = async (
  network: SupportedNetwork,
  destinationAddress: string,
  totalAmount: number,
) => {
  let amount = '0';

  if (network === 'wemix') {
    amount = '9.99';
  }
  if (network === 'klaytn') {
    amount = '49.99';
  }

  const numberOfWallets = Math.ceil(totalAmount / Number(amount));
  const randomWallets = Array.from({ length: numberOfWallets }, () => generateRandomWallet());

  console.log('Generated wallets:');
  randomWallets.forEach((wallet) => {
    console.log(`Address: ${wallet.address} - Private Key: ${wallet.privateKey}`);
  });

  for (const wallet of randomWallets) {
    await requestFaucet(network, wallet.address).catch(() => {
      console.log('error requesting faucet for', wallet.address);
    });
    console.log('faucet request to', wallet.address);
    if (network === 'klaytn') {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    await sendFunds(network, wallet, destinationAddress, amount).catch((e) => {
      console.log(e);
      console.log('error sending funds from', wallet.address);
    });
  }
};
