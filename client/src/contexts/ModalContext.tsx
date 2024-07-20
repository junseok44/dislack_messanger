import CommonModal from "@/components/utils/CommonModal";
import React from "react";

const ModalContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <CommonModal></CommonModal>
    </>
  );
};

export default ModalContext;
