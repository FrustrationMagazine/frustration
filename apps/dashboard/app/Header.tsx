import React from 'react';
import { bebasNeue } from '../utils/fonts';
import Link from 'next/link';
// import { Button } from "@frustration/ui";

const Header = () => {
  return (
    <header className='flex h-fit w-full items-center justify-center bg-black py-2'>
      <Link href='/dashboard'>
        <h1
          className={`text-7xl uppercase text-frustration-yellow ${bebasNeue.className}`}
        >
          Dashboard
        </h1>
      </Link>
      {/* <Button className="color-red" /> */}
    </header>
  );
};

export default Header;
