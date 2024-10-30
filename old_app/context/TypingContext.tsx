import React, { createContext, useState, useContext, ReactNode } from "react";

interface TypingContextType {
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <TypingContext.Provider value={{ isTyping, setIsTyping }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (context === undefined) {
    throw new Error("useTyping must be used within a TypingProvider");
  }
  return context;
};
