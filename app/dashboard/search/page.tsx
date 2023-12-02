

'use client';
import { lusitana } from '@/app/ui/fonts';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams , usePathname, useRouter} from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import { Button } from '@/app/ui/button';
import { fetchMerchantNFTs, drawCard, users, walletTransfer} from '@/app/ui/user-data';
import { useUser } from '@/app/ui/userContext';
import { NftGallery } from '@/app/ui/user/account';
import { Prompt } from 'next/font/google';

export default function Page({ placeholder }: { placeholder: string }) {

  const [inputValue, setInputValue] = useState('');
  const [nfts, setNfts] = useState();
  const {user, setUser} = useUser();
  const [showResults, setShowResults] = useState(false)
  const [merchant, setMerchant] = useState('');
  const router = useRouter();
 
  const handleChange = (e:any) => {
    setInputValue(e.target.value);
    setShowResults(false);
    setMerchant('')
  };

  const handleClick = async ()=>{
    const tempNfts = await fetchMerchantNFTs(user?.provider, inputValue)
    setNfts(tempNfts)
    setShowResults(true)

    if((tempNfts?.length > 0)){
      setMerchant(inputValue)
    }
  }

  const handleDraw = async ()=>{

    const merchantInfo = await users(user?.provider, merchant)
    console.log(merchantInfo)
    const result = await drawCard(user?.provider, inputValue)
    if(result){
      
    alert("Finish drawing.Check your NFT Gallery!")
    }
    else{
      alert("Drawing Failed")
    }
    
    
  }

  const handleTransfer = async ()=>{

    document.body.style.pointerEvents = 'none'; // 禁用所有事件
    const amount = prompt('Please enter the amount you wish to transfer')
    const result = await walletTransfer(user?.provider, merchant, amount)
    document.body.style.pointerEvents = 'auto';
    if(result){
      alert('Transferred succesfully! Check your points.')
      

    }else{
      alert('Transfer failed.')
    }
    

  }

  return (

    <div className="w-full">
        <div className="flex w-full items-center justify-between mb-4">
          <h1 className={`${lusitana.className} text-2xl`}>Search Merchant and Draw NFT</h1>
         </div>
       
      
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleChange}
        defaultValue={''}
      />
      <Button onClick={handleClick}>Search</Button>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>

    {showResults&&
    (nfts?.length>0&&
      <div className='mt-4'>
          <NftGallery nfts={nfts} showHead={false}/>
          {(!user?.isMerchant)&&
          <div className='flex mt-5'>
          <Button onClick={handleDraw}>Draw NFT</Button>
          <Button className='ml-10' onClick={handleTransfer}>Transfer</Button>
          </div>
          }
      </div>)}


    </div>
  );
}

 
// export default async function Page({
//     searchParams,
//   }: {
//     searchParams?: {
//       query?: string;
//       page?: string;
//     };
//   }) {
//     const query = searchParams?.query || '';
    
   
//     return (
//       <div className="w-full">
//         <div className="flex w-full items-center justify-between">
//           <h1 className={`${lusitana.className} text-2xl`}>Search Merchant and Draw NFT</h1>
//         </div>
//         <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
//           <Search placeholder="Enter the name of the merchant to find which NFTS are available" />
//         </div>
//       </div>
//     );
//   }