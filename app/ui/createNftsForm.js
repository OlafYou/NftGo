'use client'
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useUser } from '@/app/ui/userContext';
import { register, createNFT} from '@/app/ui/user-data';

export function Form() {

    // const initialState = { message: null, errors: {} };
    // const [state, dispatch] = useFormState(createInvoice, initialState);

    // const [showPoints, setShowPoints] = useState(false);
    const { user, setUser } = useUser()
    // const router = useRouter();



    const handleSubmit = async (event) => {
        event.preventDefault(); // 阻止表单的默认提交行为

        document.body.style.pointerEvents = 'none'; // 禁用所有事件
        alert('Creating')


        // 获取表单数据
        const formData = new FormData(event.target);
        
        const name = formData.get('name');
        const discount = formData.get('discount');
        const time = formData.get('time')
        const image = formData.get('image')
        

        function getBase64(file){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
            });
        }
    
       const imageBase64 = await getBase64(image)
        const ImageData = new FormData()
        ImageData.append('imageData', imageBase64)
        ImageData.append('imageName', image?.name)
        console.log(imageBase64)

        

        const result = await createNFT(user?.provider, image.name, name, time, discount);
        document.body.style.pointerEvents = 'auto';
        
        if(result){
            
            const response = await fetch('/api', {
                method: 'POST',
                body: ImageData
              });
              
            const data = await response.json();
            console.log(data);
            alert('NFT Created Successfully!')
        }
        else{
            alert('Creating Failed')
        }
        


        
        
        
        
        

        // 进行其他操作，如发送网络请求等
    };

    

    // return(
    // <form action="/api/upload" method="post" encType="multipart/form-data">
    //     <input type="file" name="image" />
    //     <button type="submit">Upload</button>
    // </form>);

    return (
        <form onSubmit={handleSubmit} action="/api" method="post" encType="multipart/form-data">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Please Enter the Name of NFT
                    </label>
                    <div className="relative">

                        <input

                            id="name"
                            name="name"
                            type="string"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                        />
                        {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
                    </div>
                    {/* {state.errors?.customerId ? (
                        <div
                            id="customer-error"
                            aria-live="polite"
                            className="mt-2 text-sm text-red-500"
                        >
                            {state.errors.customerId.map((error: string) => (
                                <p key={error}>{error}</p>
                            ))}
                        </div>
                    ) : null} */}
                </div>

                {/* Invoice Amount */}

                <div className="mt-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Please Enter the Discount Percentage
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="discount"
                                name="discount"
                                type="number"
                                step="1"
                                placeholder='Example: Input 10 means 10% discount'
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                            />
                            {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Please Enter the Valid Duration of the Discount in Seconds
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="time"
                                name="time"
                                type="number"
                                step="1"
                                placeholder='Example: Input 3600 means 3600s, that is, 1 hour.'
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                            />
                            {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        Please Upload the Picture for the NFT
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input type="file" name="image" className="peer block rounded-md py-2 pl-2 text-sm "/>
                        </div>
                    </div>
                </div>

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/user"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create</Button>
            </div>
        </form>
    );
}