import Button from "./button";
import "./modal.css";

type modalProps = {
  children: React.ReactNode;
  type?: string;
  showModal: boolean;
  handleShowModal: () => void;
};

function Modal({ children, type, showModal, handleShowModal }: modalProps) {
  return (
    <div className={`modal ${type} ${showModal ? "" : "hidden"}`}>
      <div className="header-color"></div>
      <div className="header">
        <div></div>
        <Button className="btn-plain btn-ext" onClick={() => handleShowModal()}>
          X
        </Button>
      </div>
      {children}
    </div>
  );
}

export default Modal;
