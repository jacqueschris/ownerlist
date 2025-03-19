import { createContext, useState, useContext, ReactNode } from 'react';
import { DisplayContextType } from '../types/index';
import { HomeScreen } from '@/components/screens/home-screen';

// Create the context with a default value
const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

// Type for the ThemeProvider props
interface DisplayProviderProps {
  children: ReactNode;
}

export const DisplayProvider: React.FC<DisplayProviderProps> = ({ children }) => {
  const [display, setDisplay] = useState<ReactNode>(<HomeScreen />);
  const [bgColor, setBgColor] = useState<string>('bg-[#E8E8E8]');
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [showAddPropertyButton, setShowAddPropertyButton] = useState<boolean>(true);

  return (
    <DisplayContext.Provider
      value={{
        display,
        setDisplay,
        bgColor,
        setBgColor,
        showButtons,
        setShowButtons,
        showAddPropertyButton,
        setShowAddPropertyButton
      }}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplayContext = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error('useDisplay must be used within a DisplayProvider');
  }
  return context;
};
