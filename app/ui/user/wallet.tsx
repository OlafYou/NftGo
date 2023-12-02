"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '../button';
import ReactDOM from 'react-dom';
import { ethers } from "ethers"
import { CONTRACT_ADDRESS } from '@/contract.config'
import abi from '@/abi.json'
import { useUser, User } from '../userContext';


export default function Metamask() {

  const {user, setUser} = useUser()
  console.log(`${user?.accounts[0]}`)

  // const [deposit, setDeposit] = useState(0);
  // const [balance, setBalance] = useState(0);
  // const [nft, setNft] = useState<Array<any>>([]);
  // const [isUser, setIsUser] = useState(false)
  // const [isMerchant, setIsMerchant] = useState(false)


  // async function connect() {

  //   if (typeof window.ethereum !== 'undefined') {
  //     const provider = new ethers.BrowserProvider((window as any).ethereum);
  //     const accounts = await provider.send('eth_requestAccounts', [])
  //     const newUser: User = { provider: provider, accounts: accounts }
  //     setUser(newUser)

  //     provider?.getBalance(accounts[0]).then((balance) => {
  //       console.log('First balance')
  //       setBalance(Number(balance) / 1e18)
  //     });
  //   }
  // }


  // // 修改账户时更新
  // useEffect(() => {
  //   const refreshAccounts = async (accounts: any) => {
  //     if (accounts.length > 0) {
  //       const newUser: User = { provider: user && user.provider, accounts: accounts }
  //       setUser(newUser)
  //     } else {
  //       const newUser: User = { provider: user && user.provider, accounts: [] }
  //       setUser(newUser)
  //     }


  //     await user?.provider?.getBalance(accounts[0]).then((balance) => {
  //       console.log('Second balance')
  //       setBalance(Number(balance) / 1e18)
  //     });

  //     console.log(user)
  //   }
  //   // accountsChanged 事件，返回的事件对象包含一个accounts数组


  //   window.ethereum?.on('accountsChanged', refreshAccounts)
  //   return () => {                                              /* New */
  //     window.ethereum?.removeListener('accountsChanged', refreshAccounts)
  //   }
  // }, [user, setUser]);

  // // 免得刷新的时候更新
  // // useEffect(() => {
  // //   localStorage.setItem('user', JSON.stringify(user));
  // // }, [user, setUser])

  // useEffect(() => {
  //   if (user) {
  //     console.log(user)
  //     const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, user.provider)
  //     // contract.getUserNFTs(user.accounts[0]).then((nft)=>{

  //     //   let nft_list = []
  //     //   for (let i = 0; i < nft[0].length; i++) {
  //     //     nft_list.push({
  //     //       image: nft[0][i],
  //     //       name: nft[1][i],
  //     //       expiryTimes: Number(nft[2][i]),
  //     //       discountPercentages: Number(nft[3][i]),
  //     //     })
  //     //   }
  //     //   setNft(nft_list)
  //     // }).catch((error)=>console.log(error))

  //     contract.users(user.accounts[0]).then((n) => { console.log(n[0]) }).catch((error) => console.log(error))

  //   }

  // }, [user])



  // console.log(user)
  // const provider = new ethers.JsonRpcProvider("https://rpc1.aries.axiomesh.io");

  // const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, user?.provider)
  // contract.getUserNFTs(user?.accounts[0]).then((nft)=>{

  //   let nft_list = []
  //   for (let i = 0; i < nft[0].length; i++) {
  //     nft_list.push({
  //       image: nft[0][i],
  //       name: nft[1][i],
  //       expiryTimes: Number(nft[2][i]),
  //       discountPercentages: Number(nft[3][i]),
  //     })
  //   }
  //   setNft(nft_list)
  // })
  // console.log(user)

  return (
    <div className="App">


      {
        // !((window as any).ethereum) ? <p>Please Install MetaMask</p> :
        //   (!user) ? <Button onClick={connect}>Connect With MetaMask</Button> :

            <div>
              <p>Accounts: {user?.accounts[0]}</p>
              {/* <p>Wallet: {user?.accounts[0]}</p>
              <p>nft: {nft}</p> */}

            </div>
      }
    </div>
  )


}