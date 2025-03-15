import { createContext, useState, useContext, ReactNode } from 'react';
import Welcome from '../components/Welcome';
import { DisplayContextType } from '../types';

// Create the context with a default value
const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

// Type for the ThemeProvider props
interface DisplayProviderProps {
  children: ReactNode;
}

export const DisplayProvider: React.FC<DisplayProviderProps> = ({ children }) => {
  const [display, setDisplay] = useState<ReactNode>(<Welcome />);
  const [bgColor, setBgColor] = useState<string>('bg-[#E8E8E8]');
  const [showButtons, setShowButtons] = useState<boolean>(false);

  return (
    <DisplayContext.Provider
      value={{
        display,
        setDisplay,
        bgColor,
        setBgColor,
        showButtons,
        setShowButtons,
      }}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplayContext = () => useContext(DisplayContext);
