import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {Form} from '@/app/ui/createNftsForm'


export default function Page() {


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'User', href: '/dashboard/user' },
                    {
                        label: 'Create NFTs',
                        href: '/dashboard/user/createNfts',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}