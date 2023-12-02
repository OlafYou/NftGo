"use client"
import { Wallet } from 'ethers';
import { createContext } from 'react';
import { useSDK } from '@metamask/sdk-react';
import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { MetaMaskUIProvider } from '@metamask/sdk-react-ui';
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import ReactDOM from 'react-dom';
import { ethers } from "ethers"
import { CONTRACT_ADDRESS } from '@/contract.config'
import abi from '@/abi.json'
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { userAgent } from 'next/server';
import { askMetaMask, fetchUserInfo } from './user-data';



export interface User {
  provider: ethers.BrowserProvider | null;
  accounts: Array<any>;
  points: number;
  nickname: string;
  isUser: boolean;
  isMerchant: boolean;
}

export interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const initialContext = {
  user: null,
  setUser: () => { }
}

export const UserContext = createContext<UserContextType>(initialContext);

export function UserProvider({ children }: { children: React.ReactNode }) {

  // const initialUser = JSON.parse(localStorage.getItem('user')) 
  const initialUser = null
  const [user, setUser] = useState<User | null>(initialUser);
  



  useEffect(() => {
    async function fetchData() {
      // 发起异步请求
      const metamask = await askMetaMask();

      if (metamask?.accounts.length>0) {
        const userInfo = await fetchUserInfo(metamask?.provider, metamask?.accounts[0]);
        const tempUser: User = { ...metamask, ...userInfo };
        setUser(tempUser);
        console.log(tempUser)
      }

    }
    fetchData()
    console.log('1')

    window.ethereum?.on('accountsChanged', fetchData)
    return () => {                                              /* New */
      window.ethereum?.removeListener('accountsChanged', fetchData)
    }
  }, [])

  // //修改账户时更新
  // useEffect(() => {
  //   const refreshAccounts = async (accounts: any) => {
  //     if (accounts.length > 0) {
  //       const userInfo = await fetchUserInfo(user?.provider, accounts[0]);
  //       const tempUser: User = { ...user, ...userInfo, accounts: accounts};
  //       setUser(tempUser);
  //     } else {
  //       const tempUser: User = {...user, accounts: [] }
  //       setUser(tempUser)
  //     }

  //   }
  //   // accountsChanged 事件，返回的事件对象包含一个accounts数组
  //   window.ethereum?.on('accountsChanged', refreshAccounts)
  //   return () => {                                              /* New */
  //     window.ethereum?.removeListener('accountsChanged', refreshAccounts)
  //   }
  // }, [user, setUser]);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 在需要使用状态的组件中使用useContext来获取状态
export function useUser(){
  return useContext(UserContext);
};

export function ConnectMetaMask() {

  return (
    <Link href='/dashboard/user'>
      <Button >Click to Explore</Button>
    </Link>
  )
}
