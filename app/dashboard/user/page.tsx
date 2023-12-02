
import { useEffect, useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Profile  from '@/app/ui/user/account';
import { UserProvider } from '@/app/ui/userContext';

export default function Page() {

  return (
    <UserProvider>
  <Profile/>
  </UserProvider>)

}