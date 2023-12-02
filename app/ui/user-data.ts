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
import { User } from '@/app/ui/userContext'

export async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        
        const accounts = await provider.send('eth_requestAccounts', [])


            // accounts = await provider.send('eth_accounts', [])

        const metamask = { provider: provider, accounts: accounts }
        return metamask;
    } else {
        // alert('Please Install MetaMask!');
        return null;
    };
}

export async function askMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        
        // const accounts = await provider.send('eth_requestAccounts', [])
        const accounts = await provider.send('eth_accounts', [])

        const metamask = { provider: provider, accounts: accounts }
        return metamask;
    } else {
        // alert('Please Install MetaMask!');
        return null;
    };
}

export async function fetchUserInfo(provider: any, account: any) {

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
    // 先判断是否注册
    try {
        const result = await contract.users(account)
        if (result[0] === '') {
            console.log('You are not registered')
            return ({
                nickname: '',
                points: 0,
                isUser: false,
                isMerchant: false
            });
        } else {
            const userInfo = {
                nickname: String(result[0]),
                points: Number(result[2]),
                isUser: true,
                isMerchant: Boolean(result[1])
            }
            console.log(userInfo)
            return userInfo;
        }

    } catch (error) {
        console.log(error)
        return null
    }

}



export async function fetchUserNfts(provider: any, account: any): Promise<Array<Nft>|null>{


    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
    // 先判断是否注册
    try {
        const result = await contract.getUserNFTs(account)

        let nfts = []
        for (let i = 0; i < result[0].length; i++) {
            nfts.push({
                image: result[0][i],
                name: result[1][i],
                expiryTimes: timestampToDate(Number(result[2][i])),
                discountPercentages: Number(result[3][i])
            })
        }

        return nfts;
    } catch (error) {
        console.log(error)
        return null
    }

}

export async function register(provider: any, nickname: any, isMerchant: any, expense: any) {

    const signer = await provider?.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
    // 先判断是否注册
    try {
        await contract.registerUser(nickname, isMerchant, expense)
        return true

    } catch (error) {
        console.log(error)
        return false
    }

}
function timestampToDate(timestamp: number) {
    const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需要加1
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export async function createNFT(provider: any, image: any, name: any, time: any, discount: any) {

    const signer = await provider?.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
    // 先判断是否注册
    try {
        await contract.createNFT(image, name, time, discount)
        return true

    } catch (error) {
        console.log(error)
        return false
    }

}

export interface Nft {
    image: string,
    name: string,
    expiryTimes: string,
    discountPercentages: number
  }

export async function fetchMerchantNFTs(provider: any, name: any) {

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
    // 先判断是否注册
    try {
        const address = await contract.resolveAddress(name)
        const users = await contract.users(address)

        if(users.isMerchant){
        const nfts = await fetchUserNfts(provider, address)
        return nfts;
        }
        else {
            return null;
        }
        

    } catch (error) {
        console.log(error)
        return null;
    }

}

export async function drawCard(provider: any, name: any) {

    const signer = await provider?.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)

    // 先判断是否注册
    try {
        await contract.drawCard(name)
        return true
        

    } catch (error) {
        console.log(error)
        return false;
    }

}

export async function users(provider: any, name: any) {


    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)

    // 先判断是否注册
    try {
        const address = await contract.resolveAddress(name)
        const users = await contract.users(address)
        return users
        

    } catch (error) {
        console.log(error)
        return null;
    }

}

export async function walletTransfer(provider: any, name: any, amount:any) {

    const signer = await provider?.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)

    
    try {
        await contract.deposit(amount);
    } catch (error) {
        console.log(error)
        console.log('Fail to deposit')
        return false;
    }

    

    try {
        const address = await contract.resolveAddress(name);
        await contract.walletTransfer(address, amount);
        const tx = await signer.sendTransaction({
            to: address,
            value: ethers.parseUnits(String(amount), 18)
          });
        const receipt = await tx.wait();
        return true

    } catch (error) {
        console.log(error)
        console.log('Fail to walletTransfer')
        return false;
    }


}