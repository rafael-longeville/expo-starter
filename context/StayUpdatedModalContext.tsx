// ModalContext.tsx
import React, { createContext, useContext, useState } from "react";

interface StayUpdatedModalContentProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const StayUpdatedModalContent = createContext<StayUpdatedModalContentProps>({
  isModalOpen: false,
  setIsModalOpen: () => {},
});

export const StayUpdatedModalContentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StayUpdatedModalContent.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </StayUpdatedModalContent.Provider>
  );
};

export const useStayUpdatedModalContext = () =>
  useContext(StayUpdatedModalContent);
