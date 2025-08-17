import Button from "./button";
import "./modal.css";

type modalProps = {
  children: React.ReactNode;
  position: "right" | "middle" | "left";
  showModal: "none" | "view" | "create" | "confirmation";
  setClose: (type: any) => void;
  backDrop: boolean;
  width?: string;
  height?: string;
  removeCloseButton?: boolean;
  zIndexInput?: number;
  modalType: string;
  hover?: boolean;
};

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
}: modalProps) {
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
