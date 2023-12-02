'use client'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {Form} from '@/app/ui/registerForm'
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