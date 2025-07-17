import Button from "./button";
import "./confirmation.css";

type ConfirmationProps = {
  buttonConfirmTitle: string;
  buttonCancelTitle?: string;
  onClickConfirm: (value: any) => void;
  onClickCancel?: (value: any) => void;
  children: string | React.ReactNode;
};

function Confirmation({
  buttonConfirmTitle,
  buttonCancelTitle,
  children,
  onClickConfirm,
  onClickCancel,
}: ConfirmationProps) {
  return (
    <div className="confirmation">
      <p>{children}</p>

      <div className="button-container">
        <Button onClick={onClickConfirm} className="btn-plain">
          {buttonConfirmTitle}
        </Button>
        {buttonCancelTitle && onClickCancel && (
          <Button onClick={onClickCancel} className="btn-plain">
            {buttonCancelTitle}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Confirmation;
