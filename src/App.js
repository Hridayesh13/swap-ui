import {useState} from 'react';
import {ethers, BigNumber} from 'ethers';
import './App.css';
import { MaxUint256 } from '@ethersproject/constants';

import contracts from './contracts/hardhat_contracts.json'; 
const token1 = contracts[31337].localhost.contracts.Token1
const token2 = contracts[31337].localhost.contracts.Token2
const Factory = contracts[31337].localhost.contracts.UniswapV2Factory
const router = contracts[31337].localhost.contracts.UniswapV2Router02

const overrides = {
  gasLimit: 9999999
}

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

function App() {
  const [userAccount, setUserAccount] = useState()
  const [recAccount, setRecAccount] = useState()
  const [amount, setAmount] = useState()
  const [balancetk1 , setBalancetk1] = useState("")
  const [balancetk2 , setBalancetk2] = useState("")
  const [token1Amount , setAmounttk1] = useState(0)
  const [token2Amount , setAmounttk2] = useState(0)


  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log( " provider ", {provider})
      console.log( " Account " , account);

      const tk1 = new ethers.Contract(token1.address, token1.abi, provider)
      const balancetk1 = await tk1.balanceOf(account);
      setUserAccount(account);
      console.log(" Balance Token1: ", balancetk1.toString());
      setBalancetk1(balancetk1.toString());

      const tk2 = new ethers.Contract(token2.address, token2.abi, provider)
      const balancetk2 = await tk2.balanceOf(account);
      setUserAccount(account);
      console.log(" Balance Token2: ", balancetk2.toString());
      setBalancetk2(balancetk2.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(" signer ", signer)
      const contract = new ethers.Contract(token1.address, token1.abi, signer)
      const transation = await contract.transfer(recAccount, expandTo18Decimals(amount));
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${recAccount}`);
    }
  }

  async function addLiquidity() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(" signer ", signer)

    const tk1 = new ethers.Contract(token1.address, token1.abi, signer)
    const tk2 = new ethers.Contract(token2.address, token2.abi, signer)
    const r02 = new ethers.Contract(router.address, router.abi, signer)
    const factory = new ethers.Contract(Factory.address, Factory.abi, signer)

    // await factory.createPair(tk1.address, tk2.address)
    await tk1.approve(router.address, MaxUint256)
    await tk2.approve(router.address, MaxUint256)
    await r02.addLiquidity(
      token1.address,
      token2.address,
      token1Amount,
      token2Amount,
      token1Amount,
      token2Amount,
      account,
      MaxUint256,
      overrides
    )
  }

  return (
    <div className="App">
      <p> hello user</p>
      <button onClick={getBalance}>Get Balance</button>
        { userAccount ? 
          <div>
            <p> {userAccount}</p>
            <p> balance TK1 :  {balancetk1}</p>
            <p> balance TK2 :  {balancetk2}</p>
          </div>:
          <p></p>
        }
        <input onChange={e => setRecAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <button onClick={sendCoins}>Send Token1</button>
<br></br><br></br>

        <input onChange={e => setAmounttk1(expandTo18Decimals(e.target.value))} placeholder="Amount TK1" />
        <input onChange={e => setAmounttk2(expandTo18Decimals(e.target.value))} placeholder="Amount TK2" />
        <button onClick={addLiquidity}>Add Liquidity</button>
    </div>
  );
}

export default App;