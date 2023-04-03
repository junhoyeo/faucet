import axios from 'axios';
import Caver from 'caver-js';
import crypto_ from 'crypto';
// @ts-ignore
import Hash from 'eth-lib/lib/hash';
import FormData from 'form-data';

// import http from 'http';
// import https from 'https';

const BLOCK_RPC = 'https://klaytn-baobab-rpc.allthatnode.com:8551';

const caverClient = new Caver(BLOCK_RPC);

const main = async () => {
  // write your input here
  // const timestamp = '***YOUR TIMESTAMP***'; //e.g. 1675843358759
  const timestamp = new Date().getTime().toString();
  const deployerAddress = '0x4d8c593adea8141b954da17a1054a6a30a1bd916';
  const contractAddress = '0xabf392d73078724957c89baa349390a3a37cadb0';

  // logic to verify signature
  const message = `${timestamp}${deployerAddress}${contractAddress}`;
  const encryptedHashRaw = crypto_.createHash('sha256').update(message).digest('hex');
  console.log('encrypted hash for apply : ', encryptedHashRaw);

  const prefixedEncryptedHash = `\x19Klaytn Signed Message:\n` + encryptedHashRaw.length + encryptedHashRaw;
  // const hashedPrefixedEncryptedHash = Hash.keccak256(prefixedEncryptedHash);

  const signature = caverClient.klay.accounts.sign(
    encryptedHashRaw,
    '0x84cb654ddaf4f466a577ea6833f817da695236642759539f04bef149382a25d7',
  );
  const hashedPrefixedEncryptedHashSignature = signature.signature;
  console.log('signature : ', hashedPrefixedEncryptedHashSignature);
  const recoveredAddress = caverClient.klay.accounts.recover(
    encryptedHashRaw,
    hashedPrefixedEncryptedHashSignature,
  );
  console.log({ recoveredAddress });

  const formData = new FormData();
  // formData.append('file', file);
  // formData.append(
  //   'movie',
  //   new Blob([JSON.stringify(movie)], {
  //     type: 'application/json',
  //   }),
  // );

  // params = {
  // timestamp: 1655176036
  // walletAddress: "0x6ff09c4c3eb0f50d07282934d9f9120f31fb8c1d",
  // walletType: "0",
  // signature: "0x8bb6aaeb2d96d024754d3b50babf116cece68977acbe8ba6a66f14d5217c60d96af020a0568661e7c72e753e80efe084a3aed9f9ac87bf44d09ce67aad3d4e01",
  // projectName: "Contract code match",
  // tokenName: "",
  // socialProfiles: `{"websiteURL":"https://baobab.scope.klaytn.com/","emailAddress":"klaytn.support@ozys.net","whitepaper":"","gitHub":"","reddit":"","twitter":"","discord":"","telegram":"","weChat":"","face
  //   },
  // files: (binary)
  formData.append('timestamp', timestamp);
  formData.append('walletAddress', deployerAddress);
  formData.append('walletType', '0');
  formData.append('signature', hashedPrefixedEncryptedHashSignature);
  formData.append('projectName', 'Orbit Bridge Klaytn USD Tether');
  // const fileBuffer = // from baseurl data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB71BMVEUAAABPrpVQrpVPrpZNrJZDpZgrlJ5guZIGe6cpUUdQr5ZSr5dQr5VMqJkGc6sFeaYFgKMGhaJPr5ZPrZUGdakEhKEEiJ4uk58Eh58Di5wDkJkCmJQ7oJoCnpEFeacEgaIBoo8GfaYFiKADhKABoY8FhKEJbLIDgqABn5ABoo4Ep49PrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVQr5ZQrpZPr5VQr5ZPrpVPrpVPrpVPr5VQr5ZPrpVQr5VPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpVPrpZPrpVPrpUGdKsGcqwGc6sGdaoEd6cBeaQDfaMGgKQGc6sGdaoSiacChJ8FiZ9PrpUAGc4GdaoNjqACi5tPrpVPrpVQr5UAb6wGeKgAkJZPrpVYtJMEd6gGe6YAl5MGeKkCfKMDnZIBnZEEgaIEhaABnZEBoY8Co44Eh54Ai5oAkpYCmZQCn5ABpI0DlJcDmJVPrpUDd6cciK4+nLgGeagZiKxps8h7v81gtMIskbN7vc5jtcODxs51wcgnoahWqcGIxtJdtL+Fyc5QtbYVn50zmbN0vsmAx8xFsbIHm5Uqnas6qq8EmZX////kb4u0AAAAh3RSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABR0gy+PhJekfxdzb7gQXGhkWkwIGCgmNEiQTDY8NPU0YCob+gzE3OTbajASKhwYDKYm3ql4KMtP7jAeIAqf1RnfldRjcgBEPG92BBaj1RzPV/I8HKou5rGALCAQQS3eXAAAAAWJLR0SkWb56uQAAAAd0SU1FB+QLBAg4JnIyPcwAAAE6SURBVCjPY2CgLmBEAwgJbR1dONDRRpLQ1dM3gAJ9PV0kCUOjdjgwMkSSMDYxNTMzb283NzMzNTFGkrCwtLK2sW1vt7WxtrK0YERylJ29g6NTe7uTo4O9HcJZjM4uVjaubu5ACQ9XGysXZ7iEp5e3jwWjb7ufP6OFj7eXJ1zCwjggMCjYySwkNDgoMMAYbgnIs0wWYeHt7eFhFswsrGzsHDDrObm4eRgj2tsjGHn5+COjBAQEBOFOFgJLCItEx8TGxSeIiqFJiCcmdXR2JaekSiBJpLW3p6VndPf09vVnZkkiSWTn5OTm5U+YOGnylKkFUkgShbq6RcUl06bPmDlrdqk0kgQQyJSVz5k7b/6CikpZ1KiUk6+qXrhocU1tnQKqhKKScn1DY1Nzi4oKWuyrqompt7ZpaCpoAQBOzVaYf3v0wQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAB9KADAAQAAAABAAAB9AAAAABUpuy6AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTExLTA0VDA4OjU2OjI1KzAwOjAwXH+22QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0xMS0wNFQwODo1NjoyNSswMDowMC0iDmUAAAASdEVYdGV4aWY6RXhpZk9mZnNldAAyNlMbomUAAAAYdEVYdGV4aWY6UGl4ZWxYRGltZW5zaW9uADUwMEE76LEAAAAYdEVYdGV4aWY6UGl4ZWxZRGltZW5zaW9uADUwMNw0CccAAAAASUVORK5CYII=
  const fileBuffer = Buffer.from(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB71BMVEUAAABPrpVQrpVPrpZNrJZDpZgrlJ5guZIGe6cpUUdQr5ZSr5dQr5VMqJkGc6sFeaYFgKMGhaJPr5ZPrZUGdakEhKEEiJ4uk58Eh58Di5wDkJkCmJQ7oJoCnpEFeacEgaIBoo8GfaYFiKAD',
  );
  formData.append('file', fileBuffer);
  // formData.append('tokenName', 'Orbit Bridge Klaytn USD Tether');

  console.log(contractAddress, deployerAddress);
  const { data } = await axios
    .post(`https://api-baobab-v3.scope.klaytn.com/codeMatch/token/${contractAddress}`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
    .catch((e) => e.response);
  console.log(data);
};
main();
