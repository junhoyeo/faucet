import axios from 'axios';

const headers = {
  accept: 'application/json',
  'accept-language': 'ko',
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  pragma: 'no-cache',
  'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
};

export const requestFaucet = async (account: string) => {
  const { data } = await axios.post(
    'https://wallet.test.wemix.com/faucet-api/',
    { receiver: account },
    { headers: headers },
  );
  console.log(data);
  return data;
};
