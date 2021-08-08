import {useState} from 'react';
import {ethers, BigNumber} from 'ethers';
import './App.css';
import { MaxUint256 } from '@ethersproject/constants';
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'

// import { Contract } from '@ethersproject/contracts'
// import { IUniswapV2Pair } from '@uniswap/v2-core/build/IUniswapV2Pair.json';


import contracts from './contracts/contracts.json'; 

const token1 = contracts[3].ropsten.contracts.Token1
const token2 = contracts[3].ropsten.contracts.Token2
const token3 = contracts[3].ropsten.contracts.Token3
const Factory = contracts[3].ropsten.contracts.UniswapV2Factory
const router = contracts[3].ropsten.contracts.UniswapV2Router02
// const Pair = contracts[3].ropsten.contracts.UniswapV2Pair

const overrides = {
  gasLimit: 5999999
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
  const [tokenA , setTokenA] = useState("")
  const [tokenB , setTokenB] = useState("")
  const [pairAddress, setPairaddress] = useState()


  // async function requestAccount() {
  //   await window.ethereum.request({ method: 'eth_requestAccounts' });
  // }

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
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(" signer ", signer)
      const contract = new ethers.Contract(token1.address, token1.abi, signer)
      const transation = await contract.transfer(recAccount, expandTo18Decimals(amount));
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${recAccount}`);
    }
  }

  async function findPair() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const factory = new ethers.Contract(Factory.address, Factory.abi, signer)
      // const hash = await factory.INIT_CODE_PAIR_HASH.call();
      // console.log(`${hash}`);

      const pairAddress = await factory.getPair(tokenA, tokenB)
      // if (pairAddress == address(0)) {
        
      // } else {
        
      // }
      setPairaddress(pairAddress);

      // const pair = new ethers.Contract(pairAddress, Pair.abi, signer)
      // const balance = await pair.getReserves();

      console.log(`LP address: ${pairAddress}`);
      // console.log(`reserves: ${balance}`);

    } catch(e) {
      console.log(e);
    }
  }

  async function createPair() {
     try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tk1 = new ethers.Contract(token1.address, token1.abi, signer)
      const tk2 = new ethers.Contract(token2.address, token2.abi, signer)
      const factory = new ethers.Contract(Factory.address, Factory.abi, signer)
      
      // uniswap router02 address : "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
      await factory.createPair(tk1.address, tk2.address)

      const pairAddress = await factory.getPair(tk1.address, tk2.address);
      // const pair = new ethers.Contract(pairAddress, Pair.abi, signer)
      // // const pair = await Pair.at(pairAddress);
      // const balance = await pair.balanceOf(account); 
      // console.log(`balance LP: ${balance.toString()}`);
      console.log(`LP address: ${pairAddress}`);
    } catch(e) {
      console.log("PAIR_EXISTS!");
    }
  }

  async function addLiquidity() {
     try {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // console.log(" signer ", signer)

      const tk1 = new ethers.Contract(token1.address, token1.abi, signer)
      const tk2 = new ethers.Contract(token2.address, token2.abi, signer)
      // const tk3 = new ethers.Contract(token3.address, token3.abi, signer)

      const r02 = new ethers.Contract(router.address, router.abi, signer)
      // const factory = new ethers.Contract(Factory.address, Factory.abi, signer)
      
      // uniswap router02 address : "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
      // await factory.createPair(tk1.address, tk2.address)

      // const pairAddress = await factory.getPair(tk1.address, tk2.address)
      // const pair = new Contract(pairAddress, Pair.abi, provider).connect(account)

      await tk1.approve(router.address, MaxUint256)
      await tk2.approve(router.address, MaxUint256)

      // FOR TEST
      // await r02.addLiquidity(
      //   token1.address,
      //   token2.address,
      //   10000,
      //   10000,
      //   10000,
      //   10000,
      //   account,
      //   Math.floor(Date.now() / 1000) + 60 * 10,
      //   overrides
      // );
      // let estimate
      // let method
      // let args
      // let value
      // estimate = router.estimateGas.addLiquidity
      // method = router.addLiquidity
      await r02.addLiquidity(
      // args = [
        token1.address,
        token2.address,
        token1Amount,
        token2Amount,
        token1Amount,
        token2Amount,
        account,
        // MaxUint256,
        Math.floor(Date.now() / 1000) + 60 * 10,
        overrides
        // estimate
      // ]
      )
      // console.log(`liquidity added successfully!!!`);

      // const pairAddress = await factory.getPair(tk1.address, tk2.address);
      // const pair = new ethers.Contract(pairAddress, Pair.abi, signer)
      // // const pair = await Pair.at(pairAddress);
      // const balance = await pair.balanceOf(account); 
      // console.log(`balance LP: ${balance.toString()}`);
      // console.log(`Pair address: ${pairAddress}`);
    } catch(e) {
      console.log(e);
    }
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
        <input onChange={e => setTokenA(e.target.value)} placeholder="Token A" />
        <input onChange={e => setTokenB(e.target.value)} placeholder="Token B" />
        <button onClick={findPair}>Find Pair</button>
        { pairAddress ? 
          <div>
            <p> pair address :  {pairAddress}</p>
          </div>:
          <p></p>
        }
<br></br><br></br>
        <button onClick={createPair}>Create pair</button>
<br></br><br></br>
        <input onChange={e => setAmounttk1(expandTo18Decimals(e.target.value))} placeholder="Amount TK1" />
        <input onChange={e => setAmounttk2(expandTo18Decimals(e.target.value))} placeholder="Amount TK2" />
        <button onClick={addLiquidity}>Add Liquidity</button>
    </div>
  );
}

export default App;