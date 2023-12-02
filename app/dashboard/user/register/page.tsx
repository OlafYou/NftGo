'use client'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { useUser } from '@/app/ui/userContext';
import { register } from '@/app/ui/user-data';
import { useRouter } from 'next/navigation';

export default function Page() {


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'User', href: '/dashboard/user' },
                    {
                        label: 'Register',
                        href: '/dashboard/user/register',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}

export function Form() {

    // const initialState = { message: null, errors: {} };
    // const [state, dispatch] = useFormState(createInvoice, initialState);

    const [showPoints, setShowPoints] = useState(false);
    const { user, setUser } = useUser()
    const router = useRouter();



    const handleSubmit = async (event: any) => {
        event.preventDefault(); // 阻止表单的默认提交行为


        // 获取表单数据
        const formData = new FormData(event.target);
        const nickname = formData.get('nickname');
        const status = formData.get('status');
        const expense = Number(formData.get('expense'));

        const result = await register(user?.provider, nickname, status === 'Merchant', expense)

        if (result) {
            alert('Succesfully Registered!')
            setUser({ ...user, isUser: true })
            router.push('/dashboard/user')
        }

        // 进行其他操作，如发送网络请求等
    };

    const handleMerchantClick = () => {
        setShowPoints(true);
    };

    const handleCustomerClick = () => {
        setShowPoints(false);
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Please Enter Your Nickname
                    </label>
                    <div className="relative">

                        <input

                            id="nickname"
                            name="nickname"
                            type="string"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

                {/* Invoice Status */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Confirm Your Identity
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    id="Merchant"
                                    name="status"
                                    type="radio"
                                    value="Merchant"
                                    className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                                    onClick={handleMerchantClick}
                                />
                                <label
                                    htmlFor="Merchant"
                                    className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium"
                                >Merchant
                                </label>

                            </div>
                            <div className="flex items-center">
                                <input
                                    id="Customer"
                                    name="status"
                                    type="radio"
                                    value="Customer"
                                    className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                                    onClick={handleCustomerClick}
                                />
                                <label
                                    htmlFor="Customer"
                                    className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium"
                                >
                                    Customer
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Invoice Amount */}
                {showPoints &&
                    <div className="mt-4">
                        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                            Enter Expense Needed For Drawing Your NFTs
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="expense"
                                    name="expense"
                                    type="number"
                                    step="1"
                                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                />
                                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/user"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Register</Button>
            </div>
        </form>
    );
}