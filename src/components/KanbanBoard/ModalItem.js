import ReactDOM from "react-dom";
import ModalOverlay from "../UI/ModalOverlay";
import Backdrop from "../UI/Backdrop";

const ModalItem = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop
          removeModal={props.onRemoveModal}
          showModal={props.showModal}
        />,
        document.getElementById("modal-overlay")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onFilter={props.onFilter}
          onRemoveModal={props.onRemoveModal}
          modalIsActive={props.modalIsActive}
        />,
        document.getElementById("modal-overlay")
      )}
    </>
  );
};

export default ModalItem;
