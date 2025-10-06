import Button from "./button";
import "./modal.css";

type BaseModalProps = {
  children: React.ReactNode;
  showModal: "none" | "view" | "create" | "confirmation";
  setClose: (type: any) => void;
  backDrop: boolean;
  width?: string;
  height?: string;
  removeCloseButton?: boolean;
  zIndexInput?: number;
  modalType: "view" | "create" | "confirmation";
};

type AbsoluteModalProps = BaseModalProps & {
  position: "absolute";
  hover: true;
  left: "auto" | string;
  top: "auto" | string;
};

type OtherModalProps = BaseModalProps & {
  position: "right" | "middle" | "left";
  hover?: boolean;
};

export type ModalProps = AbsoluteModalProps | OtherModalProps;

function Modal({
  children,
  position,
  showModal,
  setClose,
  backDrop,
  width,
  height,
  removeCloseButton,
  zIndexInput,
  modalType,
  hover,
}: ModalProps) {
  return (
    <div
      onClick={() => {
        setClose("none");
      }}
      className={`${backDrop ? "back-drop" : ""} ${
        showModal === modalType ? "" : "hidden"
      }`}
      style={{ zIndex: zIndexInput }}
    >
      <div
        className={`modal ${position} ${showModal === modalType ? "" : "hidden"}`}
        style={{
          height: height,
          width: width ? width : "",
          position: hover ? "absolute" : "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showModal === "create" && <div className="header-color"></div>}
        {!removeCloseButton && (
          <div className="top-button-container">
            <Button className="btn-plain btn-ext " onClick={() => setClose("none")}>
              X
            </Button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
