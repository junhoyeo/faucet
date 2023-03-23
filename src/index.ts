import { HDNodeWallet, JsonRpcProvider, Wallet, parseEther } from 'ethers';

import { requestFaucet } from './faucet';

const generateRandomWallet = () => Wallet.createRandom();
const sendFunds = async (fromWallet: HDNodeWallet, toAddress: string, amount: string) => {
  const provider = new JsonRpcProvider('https://api.test.wemix.com');
  const signer = fromWallet.connect(provider);

  const tx: any = {
    from: signer.address,
    to: toAddress,
    value: parseEther(amount),
  };

  const gasPrice = await provider.getFeeData();
  const gasEstimate = await provider.estimateGas(tx);

  tx.gasLimit = gasEstimate;
  tx.gasPrice = gasPrice.gasPrice;

  try {
    const sendTransaction = await signer.sendTransaction(tx);
    const receipt = await sendTransaction.wait();
    console.log(`Transaction successful! Sent ${amount} Wemix tokens to ${toAddress}. Receipt:`, receipt);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
};

const main = async () => {
  const randomWallets = Array.from({ length: 10 }, () => generateRandomWallet());
  const destinationAddress = '0x7777777141f111cf9F0308a63dbd9d0CaD3010C4';

  console.log('Generated wallets:');
  randomWallets.forEach((wallet) => {
    console.log(`Address: ${wallet.address} - Private Key: ${wallet.privateKey}`);
  });

  for (const wallet of randomWallets) {
    await requestFaucet(wallet.address).catch(() => {
      console.log('error requesting faucet for', wallet.address);
    });
    console.log('faucet request to', wallet.address);
    await sendFunds(wallet, destinationAddress, '9.99').catch(() => {
      console.log('error sending funds from', wallet.address);
    });
  }
};
main();
