import Button from "./button";
import "./modal.css";
import type { modalType } from "../../types/modalTypes";

type modalProps = {
  children: React.ReactNode;
  type: "right" | "middle" | "left";
  showModal: "none" | "view" | "create" | boolean;
  setClose: (type: any) => void;
  backDrop: boolean;
  closeOnBackDrop?: boolean;
  width?: string;
  height?: string;
  removeCloseButton?: boolean;
  zIndexInput?: number;
};

function Modal({
  children,
  type,
  showModal,
  setClose,
  backDrop,
  width,
  height,
  closeOnBackDrop,
  removeCloseButton,
  zIndexInput,
}: modalProps) {
  return (
    <div
      onClick={() => {
        if (closeOnBackDrop) setClose("none");
      }}
      className={`${backDrop ? "back-drop" : ""} ${showModal != "none" ? "" : "hidden"}`}
      style={{ zIndex: zIndexInput }}
    >
      <div
        className={`modal ${type}`}
        style={{ height: height, width: width ? width : "" }}
        onClick={(e) => e.stopPropagation()}
      >
        {showModal === "create" && <div className="header-color"></div>}
        {!removeCloseButton && (
          <Button
            className="btn-plain btn-ext btn-right"
            onClick={() => setClose("none")}
          >
            X
          </Button>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
