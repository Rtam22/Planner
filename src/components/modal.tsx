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
  width = "",
  height = "100vh",
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
        <div className="header-color"></div>
        <div className="header">
          <div></div>
          <Button
            className="btn-plain btn-ext"
            onClick={() => handleShowModal("none")}
          >
            X
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
