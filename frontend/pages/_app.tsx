import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Navbar from '@/components/navbar';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='min-h-screen min-w-full flex'>
      <aside className='w-36 bg-gray-50 shadow-2xs p-6'>
        <Navbar />
      </aside>
      <section className='flex-1'>
        <Component {...pageProps} />
      </section>
    </div>
  );
}
    