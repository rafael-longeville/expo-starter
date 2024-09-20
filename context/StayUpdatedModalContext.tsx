import React, { createContext, useContext, useEffect, useState } from "react";

interface StayUpdatedModalContentProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (isOpen: boolean) => void;
  isBlurred: boolean;
  setIsBlurred: (isBlurred: boolean) => void;
  isValidationModalOpen: boolean;
  setIsValidationModalOpen: (isOpen: boolean) => void;
  isOffRamp: boolean;
  setIsOffRamp: (isOffRamp: boolean) => void;
}

const StayUpdatedModalContent = createContext<StayUpdatedModalContentProps>({
  isModalOpen: false,
  setIsModalOpen: () => {},
  isCheckoutModalOpen: false,
  setIsCheckoutModalOpen: () => {},
  isBlurred: false,
  setIsBlurred: () => {},
  isValidationModalOpen: false,
  setIsValidationModalOpen: () => {},
  isOffRamp: false,
  setIsOffRamp: () => {},
});

export const StayUpdatedModalContentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false); // Add this line to declare isBlurred state
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isOffRamp, setIsOffRamp] = useState(false);

  return (
    <StayUpdatedModalContent.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isBlurred, // Pass the isBlurred state
        setIsBlurred, // Pass the setIsBlurred state updater*
        isValidationModalOpen,
        setIsValidationModalOpen,
        isOffRamp,
        setIsOffRamp,
      }}
    >
      {children}
    </StayUpdatedModalContent.Provider>
  );
};

export const useStayUpdatedModalContext = () =>
  useContext(StayUpdatedModalContent);
