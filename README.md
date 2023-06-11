# @junhoyeo/faucet

> 🤖 Automation for Bootstrapping Testnet Tokens in Blockchain Faucets — <br />
> Currently Supports WEMIX and KLAY

- WEMIX in [WEMIX Testnet](https://wallet.test.wemix.com/faucet)
- KLAY in [Klaytn Baobab(Testnet)](https://baobab.wallet.klaytn.foundation/faucet)

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
