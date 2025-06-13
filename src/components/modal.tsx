import Button from "./button";
import "./modal.css";
import type { modalType } from "../components/types/modalTypes";

type modalProps = {
  children: React.ReactNode;
  type: "right" | "middle" | "left";
  showModal: "none" | "view" | "create";
  handleShowModal: (type: modalType) => void;
  backDrop: boolean;
  width?: string;
  height?: string;
};

function Modal({
  children,
  type,
  showModal,
  handleShowModal,
  backDrop,
  width,
  height,
}: modalProps) {
  return (
    <div
      className={`${backDrop ? "back-drop" : ""} ${
        showModal != "none" ? "" : "hidden"
      }`}
    >
      <div
        className={`modal ${type}`}
        style={{ height: height, width: width ? width : "" }}
      >
        {showModal === "create" && <div className="header-color"></div>}
        <Button
          className="btn-plain btn-ext btn-right"
          onClick={() => handleShowModal("none")}
        >
          X
        </Button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
