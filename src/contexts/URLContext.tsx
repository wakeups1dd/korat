import { createContext, useContext, useState, ReactNode } from 'react';

interface URLContextType {
  scannedURL: string;
  setScannedURL: (url: string) => void;
}

const URLContext = createContext<URLContextType | undefined>(undefined);

export const URLProvider = ({ children }: { children: ReactNode }) => {
  const [scannedURL, setScannedURL] = useState('example.com');

  return (
    <URLContext.Provider value={{ scannedURL, setScannedURL }}>
      {children}
    </URLContext.Provider>
  );
};

export const useURL = () => {
  const context = useContext(URLContext);
  if (context === undefined) {
    throw new Error('useURL must be used within a URLProvider');
  }
  return context;
};
