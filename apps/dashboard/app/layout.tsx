import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Sidenav from '../components/Sidenav';
import { inter } from '@/fonts';
import SignIn from '../components/SignIn';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Frustration Dahsboard',
  description: 'Tableau de bord pour Frustration',
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const session = await auth();

  let Main = <SignIn />;
  if (session?.user)
    Main = (
      <article className='flex flex-grow'>
        <Sidenav />
        <main className='flex grow'>{children}</main>
      </article>
    );

  return (
    <html lang='fr'>
      <body
        className={`${inter.className} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        {Main}
      </body>
    </html>
  );
}
