import React, { ReactNode } from 'react';
import Link from 'next/link';
import { FaCreditCard } from 'react-icons/fa';
import { poppins } from '@/fonts';
import SignOut from './SignOut';

const SIDENAV_ELEMENTS = [
  {
    label: 'Revenus',
    icon: <FaCreditCard />,
    href: '/revenus',
  },
];

const MenuDivider = <hr className='border-3 border-frustration-yellow-hover' />;

const Menu = ({
  label,
  icon,
  href,
}: {
  label: string;
  icon: ReactNode;
  href: string;
}) => {
  return (
    <li key={label.toLowerCase()}>
      <Link
        href={href}
        className={`mb-2 flex items-center gap-4 px-5 py-2 text-lg ${poppins.className} rounded-md transition duration-500 hover:bg-frustration-yellow-hover`}
      >
        {icon} {label}
      </Link>
      {MenuDivider}
    </li>
  );
};

const Menus = (
  <ul className='w-full px-3 text-frustration-yellow'>
    {SIDENAV_ELEMENTS.map(Menu)}
  </ul>
);

/*********************************/
/*           EXPORT              */
/*********************************/
const Sidenav = () => {
  return (
    <aside className='flex w-60 flex-col items-center justify-between bg-black pb-4'>
      {Menus}
      <SignOut />
    </aside>
  );
};

export default Sidenav;
