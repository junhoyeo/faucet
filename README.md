# @junhoyeo/faucet

> Automation for **WEMIX**(Wemix Testnet) and **KLAY**(Klaytn Baobab Testnet) Faucet

```bash
yarn add @junhoyeo/faucet
```

```ts
import { requestFunds } from '@junhoyeo/faucet';

requestFunds(
  'klaytn', // 'wemix' | 'klaytn'
  '0x7777777141f111cf9F0308a63dbd9d0CaD3010C4',
  1200,
);
```
