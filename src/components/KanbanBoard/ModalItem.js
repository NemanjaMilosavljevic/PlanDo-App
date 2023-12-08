import ReactDOM from "react-dom";
import ModalOverlay from "../UI/ModalOverlay";
import Backdrop from "../UI/Backdrop";

const ModalItem = ({ onRemoveModal }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop removeModal={onRemoveModal} />,
        document.getElementById("modal-overlay")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onRemoveModal={onRemoveModal} />,
        document.getElementById("modal-overlay")
      )}
    </>
  );
};

export default ModalItem;
