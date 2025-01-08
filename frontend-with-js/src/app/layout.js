import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-Commerce Store',
  description: 'Modern e-commerce platform built with Next.js and Redux Toolkit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
            <Toaster position="top-right" />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
