'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '../button';
import ReactDOM from 'react-dom';
import { ethers } from "ethers"
import { CONTRACT_ADDRESS } from '@/contract.config'
import abi from '@/abi.json'
import { useUser, User } from '../userContext';
import { fetchUserNfts } from '../user-data';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { connectMetaMask } from '../user-data';

export default function Profile() {

    const { user, setUser } = useUser();
    const [nfts, setNfts] = useState([])
    const [balance, setBalance] = useState(0)
    const [chainId, setChainId] = useState()

    console.log(nfts instanceof Array)


    useEffect(() => {

        const fetchData = async () => {
            const nfts = await fetchUserNfts(user?.provider, user?.accounts[0])
            const balance = await user?.provider?.getBalance(user?.accounts[0])
            const network = await user?.provider?.getNetwork()


            console.log(network)
            console.log(nfts)
            setNfts(nfts)
            setBalance(Number(balance) / 1e18)
            setChainId(Number(network['chainId']))
        }
        if (user&&(user?.accounts.length>0)) { fetchData() }

    }, [user])

    



    return (
        <div>


            {
                !((window as any).ethereum) ? <p>Please Install MetaMask</p> :
                  (!user || (user?.accounts.length===0)) ? <Button onClick={connectMetaMask}>Connect With MetaMask</Button> :

                <div>
                    <MetaMask account={user?.accounts[0]} balance={balance} chainId={chainId} />
                    <UserInfo />
                    <NftGallery nfts={nfts} showHead={true} />

                </div>


            }
        </div>
    )


}

export function MetaMask(props: any) {

    const { account, balance, chainId } = props

    return (
        <div className="flex  flex-col md:col-span-4 lg:col-span-4 mb-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                MetaMask Wallet Info
            </h2>
            <div className="flex w-[600px] grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {/* NOTE: comment in this code when you get to this point in the course */}


                <div className="bg-white px-6">
                    <div className='flex flex-row items-center justify-between py-4'>



                        <div className="flex items-center">
                            {/* <Image
                            src={`/${nft.name}.png`}
                            alt={`${nft.name}'s profile picture`}
                            className="mr-4 rounded-full"
                            width={32}
                            height={32}
                        /> */}
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium md:text-base mb-3 border-b py-1">

                                    <strong>Chain ID: </strong>{chainId}



                                </div>

                                {/* <div className='flex flex-row items-center justify-between py-4 border'> */}

                                <p className="truncate text-sm font-medium md:text-base mb-3 border-b py-1">
                                    <strong>Balance: </strong> {balance.toFixed(4)} AXM
                                </p>
                                {/* </div> */}

                                <p className="truncate text-sm font-medium md:text-base mb-3 border-b py-1">
                                    <strong>Address: </strong> {account}
                                </p>
                                {/* <p
                        className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                    >
                        <strong>Balance:</strong> {balance.toFixed(4)} AXM
                    </p>
                            <p className="hidden text-sm text-gray-500 sm:block">
                               <strong>Address:</strong> {account}
                            </p> */}
                            </div>
                        </div>

                    </div>
                </div>




            </div>
        </div>
    )




}

export function UserInfo() {

    const { user, setUser } = useUser();

    return (
        <div className="flex  flex-col md:col-span-4 lg:col-span-4 mb-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                User Info
            </h2>
            {user?.isUser ?
                <div className="flex w-[600px] grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                    {/* NOTE: comment in this code when you get to this point in the course */}


                    <div className="bg-white px-6">
                        <div className='flex flex-row items-center justify-between py-4'>



                            <div className="flex items-center">
                                {/* <Image
                            src={`/${nft.name}.png`}
                            alt={`${nft.name}'s profile picture`}
                            className="mr-4 rounded-full"
                            width={32}
                            height={32}
                        /> */}
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium md:text-base mb-3 border-b py-1">
                                        <strong>Identity: </strong>{user?.isMerchant ? 'Merchant' : 'Customer'}
                                    </div>

                                    {/* <div className='flex flex-row items-center justify-between py-4 border'> */}

                                    <p className="truncate text-sm font-medium md:text-base mb-3 border-b py-1">
                                        <strong>Nickname: </strong> {user?.nickname}
                                    </p>
                                    {/* </div> */}

                                    <p className="truncate text-sm font-medium md:text-base mb-3 border-b py-1">
                                        <strong>Points: </strong> {user?.points}
                                    </p>
                                    {/* <p
                        className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                    >
                        <strong>Balance:</strong> {balance.toFixed(4)} AXM
                    </p>
                            <p className="hidden text-sm text-gray-500 sm:block">
                               <strong>Address:</strong> {account}
                            </p> */}
                                </div>
                            </div>

                        </div>
                    </div>





                </div> :
                <div className='flex'>
                    <div className="flex text-sm font-medium md:text-base mb-3 py-1">
                        <strong>We detect that you have not yet registered as our user. </strong>
                        <strong> {'Please click here to '}
                            <Link href='/dashboard/user/register'>
                                <button className="underline hover:text-blue-600" > regisiter</button>
                            </Link>
                        </strong>

                    </div>
                </div>
            }
        </div>
    )




}

export function NftGallery(props: any) {

    const { nfts, showHead } = props
    const { user, setUser } = useUser();



    return (
        <div className="flex w-full flex-col md:col-span-4 lg:col-span-4">
            {
                showHead &&
                <div className='flex justify-between'>
                    <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                        NFT Gallery
                    </h2>
                    {user?.isMerchant &&
                        <Link href='/dashboard/user/createNfts'>
                            <Button className='w-[135px] items-center'>Create NFTs +</Button>
                        </Link>
                    }
                </div>
            }
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {/* NOTE: comment in this code when you get to this point in the course */}

                <div className="bg-white px-6">
                    {nfts?.map((nft, i) => {
                        return ((nft.image!=='')&&
                            <div
                                key={i}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={`/${nft.image}`}
                                        alt={`${nft.name}'s profile picture`}
                                        className="mr-4 rounded-full"
                                        width={32}
                                        height={32}
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {nft.name}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {nft.expiryTimes}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {nft.discountPercentages}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div>
            </div>
        </div>
    );



}





