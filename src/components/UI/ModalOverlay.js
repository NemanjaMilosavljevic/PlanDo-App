import styles from "./ModalOverlay.module.css";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import Input from "./Input";
import DropdownInput from "./DropdownInput";
import Textarea from "./Textarea";
import ErrorModal from "./ErrorModal";
import { useSelector, useDispatch } from "react-redux";
import { UpdateTask, deleteTaskHandler } from "../../store/tasks-slice";
import useHttp from "../../hooks/use-http";
import CSSTransition from "react-transition-group/CSSTransition";
import { modalSliceActions } from "../../store/modal-slice";

const ModalOverlay = ({ onRemoveModal, className }) => {
  const userId = localStorage.getItem("localId");

  const dispatch = useDispatch();
  const initialTasks = useSelector((state) => state.tasks.initialTasks);
  const { error, clearError, sendRequest } = useHttp();

  const isToggle = useSelector((state) => state.theme.switchIsToggle);
  const modal = useSelector((state) => state.modal);
  const {
    enteredTitle,
    enteredDescription,
    chosenPriority,
    enteredDueDate,
    enteredStatus,
    visibleId,
    id,
    isChecked,
    createdOn,
    firebaseId,
    modalIsActive,
  } = modal;

  const titleChangeHandler = (event) => {
    dispatch(modalSliceActions.getTitle(event.target.value));
  };

  const descriptionChangeHandler = (event) => {
    dispatch(modalSliceActions.getDescription(event.target.value));
  };

  const checkboxHandler = (event) => {
    dispatch(modalSliceActions.getPriority(event.target.value));
    dispatch(modalSliceActions.getIsChecked(event.target.value));
  };

  const dueDateHandler = (event) => {
    dispatch(modalSliceActions.getDueDate(event.target.value));
  };

  const statusChangeHandler = (event) => {
    dispatch(modalSliceActions.getStatus(event.target.value));
  };

  const updateTaskHandler = (event) => {
    event.preventDefault();

    const updatedTask = {
      title: enteredTitle,
      description: enteredDescription,
      priority: chosenPriority,
      due: new Date(enteredDueDate).toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      status: enteredStatus,
      id: id,
      visibleId: visibleId,
      createdOn: createdOn,
      firebaseId: firebaseId,
    };

    dispatch(
      UpdateTask(updatedTask, sendRequest, initialTasks, userId, onRemoveModal)
    );
  };

  const onDeleteTask = (event) => {
    event.preventDefault();

    const deletedTask = {
      title: enteredTitle,
      description: enteredDescription,
      priority: chosenPriority,
      due: new Date(enteredDueDate).toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      status: enteredStatus,
      id: id,
      visibleId: visibleId,
      createdOn: createdOn,
      firebaseId: firebaseId,
    };

    dispatch(
      deleteTaskHandler(
        deletedTask,
        sendRequest,
        initialTasks,
        userId,
        onRemoveModal
      )
    );
  };

  let classes = `${styles["modal-container"]} ${className}`;

  return (
    <>
      {!error && (
        <CSSTransition
          timeout={600}
          in={modalIsActive}
          mountOnEnter
          unmountOnExit
          classNames={{
            enter: "",
            enterActive: `${styles.animationEnter}`,
            exit: "",
            exitActive: `${styles.animationExit}`,
          }}
        >
          <div className={classes}>
            <form onSubmit={updateTaskHandler} className={styles["modal-form"]}>
              <div className={styles["modal-heading"]}>
                <span className={styles["visible-id"]}>{visibleId}</span>
                <Textarea
                  textarea={{
                    type: "textarea",
                    rows: "2",
                    id: styles["modal-title"],
                    value: enteredTitle,
                    onChange: titleChangeHandler,
                  }}
                />
              </div>

              <div className={styles["status"]}>
                <span className={styles["inline-text"]}>Sorted in:</span>
                <DropdownInput
                  className={styles["select-list"]}
                  dropdownInput={{
                    id: styles["modal-select-field"],
                    value: enteredStatus,
                    onChange: statusChangeHandler,
                  }}
                >
                  <option value="To do">To do</option>
                  <option value="In progress">In progress</option>
                  <option value="Done">Done</option>
                </DropdownInput>
              </div>

              <label htmlFor="textarea">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{
                    color: `${isToggle ? "#c78437" : "#2f2e41"}`,
                    padding: " 0px 10px 0px 0px",
                  }}
                />
                Description
              </label>
              <Textarea
                className={styles["modal-description"]}
                textarea={{
                  rows: "10",
                  id: styles.textarea,
                  value: enteredDescription,
                  onChange: descriptionChangeHandler,
                }}
              ></Textarea>

              <div className={styles["priority"]}>
                <label id={styles["checkbox"]}>
                  <Input
                    input={{
                      type: "checkbox",
                      id: styles["checkbox-id"],
                      value: isChecked ? "Not-important" : "Important",
                      onChange: checkboxHandler,
                      checked: isChecked,
                    }}
                  />
                  Priority
                </label>
              </div>

              <div className={styles["create-date"]}>
                <label>{`CreatedOn: ${createdOn}`}</label>
              </div>

              <div className={styles["calendar"]}>
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  style={{
                    color: `${isToggle ? "#c78437" : "#2f2e41"}`,
                    padding: " 0px 10px 0px 0px",
                  }}
                />
                <Input
                  className={`${
                    isToggle ? styles["orange-icon"] : styles["modal-date"]
                  }`}
                  input={{
                    type: "date",
                    id: styles["modal-due-date"],
                    value: enteredDueDate,
                    onChange: dueDateHandler,
                  }}
                />
              </div>

              <div>
                <Button
                  button={{ onClick: onRemoveModal }}
                  className={styles["cancel-btn"]}
                ></Button>
                <Button
                  className={styles["update-btn"]}
                  button={{ type: "submit" }}
                >
                  Update task
                </Button>
                <Button
                  className={styles["delete-btn"]}
                  button={{
                    onClick: onDeleteTask,
                  }}
                >
                  Delete
                </Button>
              </div>
            </form>
          </div>
        </CSSTransition>
      )}
      {error &&
        ReactDOM.createPortal(
          <ErrorModal onClose={clearError}>{error}</ErrorModal>,
          document.getElementById("confirm-modal")
        )}
    </>
  );
};

export default ModalOverlay;
