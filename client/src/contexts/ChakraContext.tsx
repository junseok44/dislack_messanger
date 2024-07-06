import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

interface ColorModeContextType {
  colorMode: string;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

export const useColorModeContext = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error(
      "useColorModeContext must be used within a ColorModeProvider"
    );
  }
  return context;
};

interface ColorModeProviderProps {
  children: ReactNode;
}

const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [colorMode, setColorMode] = useState<string>(
    localStorage.getItem("chakra-ui-color-mode") || config.initialColorMode
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorMode);
    localStorage.setItem("chakra-ui-color-mode", colorMode);
  }, [colorMode]);

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

const ChakraContext = ({ children }: { children: ReactNode }) => (
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ColorModeProvider>{children}</ColorModeProvider>
  </ChakraProvider>
);

export default ChakraContext;
