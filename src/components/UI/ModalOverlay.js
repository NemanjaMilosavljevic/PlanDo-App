import styles from "./ModalOverlay.module.css";
import { useContext, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import TasksContext from "../../contextAPI/tasks-context";
import Button from "./Button";
import Input from "./Input";
import DropdownInput from "./DropdownInput";
import Textarea from "./Textarea";
import { useSelector } from "react-redux";

import CSSTransition from "react-transition-group/CSSTransition";

const ModalOverlay = (props) => {
  const ctxTasks = useContext(TasksContext);
  const isToggle = useSelector((state) => state.theme.switchIsToggle);

  const createUTCdateToISO = (dateString) => {
    const offset = new Date().getTimezoneOffset();
    const myDate = Date.parse(dateString) - offset * 60 * 1000;
    return new Date(myDate).toISOString().slice(0, 10);
  };

  const initialTaskState = {
    enteredTitle: props.onFilter.title,
    enteredDescription: props.onFilter.description,
    chosenPriority: props.onFilter.priority,
    enteredDueDate: createUTCdateToISO(props.onFilter.due),
    enteredStatus: props.onFilter.status,
    visibleId: props.onFilter.visibleId,
    id: props.onFilter.id,
    isChecked: props.onFilter.priority === "Important" ? true : false,
    createdOn: props.onFilter.createdOn,
    firebaseId: props.onFilter.firebaseId,
  };

  const updateReducer = (state, action) => {
    if (action.type === "title") {
      return {
        enteredTitle: action.titleValue,
        enteredDescription: state.enteredDescription,
        chosenPriority: state.chosenPriority,
        enteredDueDate: state.enteredDueDate,
        enteredStatus: state.enteredStatus,
        visibleId: props.onFilter.visibleId,
        id: props.onFilter.id,
        isChecked:
          state.chosenPriority === "Important" &&
          action.priorityValue === undefined
            ? true
            : false,
        createdOn: props.onFilter.createdOn,
        firebaseId: props.onFilter.firebaseId,
      };
    }
    if (action.type === "description") {
      return {
        enteredTitle: state.enteredTitle,
        enteredDescription: action.descriptionValue,
        chosenPriority: state.chosenPriority,
        enteredDueDate: state.enteredDueDate,
        enteredStatus: state.enteredStatus,
        visibleId: props.onFilter.visibleId,
        id: props.onFilter.id,
        isChecked:
          state.chosenPriority === "Important" &&
          action.priorityValue === undefined
            ? true
            : false,
        createdOn: props.onFilter.createdOn,
        firebaseId: props.onFilter.firebaseId,
      };
    }

    if (action.type === "priority") {
      return {
        enteredTitle: state.enteredTitle,
        enteredDescription: state.enteredDescription,
        chosenPriority: action.priorityValue,
        enteredDueDate: state.enteredDueDate,
        enteredStatus: state.enteredStatus,
        visibleId: props.onFilter.visibleId,
        id: props.onFilter.id,
        isChecked:
          action.priorityValue === "Important" ||
          (state.chosenPriority === "Important" &&
            action.priorityValue === undefined)
            ? true
            : false,
        createdOn: props.onFilter.createdOn,
        firebaseId: props.onFilter.firebaseId,
      };
    }

    if (action.type === "due") {
      return {
        enteredTitle: state.enteredTitle,
        enteredDescription: state.enteredDescription,
        chosenPriority: state.chosenPriority,
        enteredDueDate: action.dueValue,
        enteredStatus: state.enteredStatus,
        visibleId: props.onFilter.visibleId,
        id: props.onFilter.id,
        isChecked:
          state.chosenPriority === "Important" &&
          action.priorityValue === undefined
            ? true
            : false,
        createdOn: props.onFilter.createdOn,
        firebaseId: props.onFilter.firebaseId,
      };
    }

    if (action.type === "status") {
      return {
        enteredTitle: state.enteredTitle,
        enteredDescription: state.enteredDescription,
        chosenPriority: state.chosenPriority,
        enteredDueDate: state.enteredDueDate,
        enteredStatus: action.statusValue || state.enteredStatus,
        visibleId: props.onFilter.visibleId,
        id: props.onFilter.id,
        isChecked:
          state.chosenPriority === "Important" &&
          action.priorityValue === undefined
            ? true
            : false,
        createdOn: props.onFilter.createdOn,
        firebaseId: props.onFilter.firebaseId,
      };
    }

    return initialTaskState;
  };

  const [updatedState, dispatchUpdate] = useReducer(
    updateReducer,
    initialTaskState
  );

  const titleChangeHandler = (event) => {
    dispatchUpdate({
      type: "title",
      titleValue: event.target.value,
    });
  };

  const descriptionChangeHandler = (event) => {
    dispatchUpdate({
      type: "description",
      descriptionValue: event.target.value,
    });
  };

  const checkboxHandler = (event) => {
    dispatchUpdate({
      type: "priority",
      priorityValue: event.target.value,
    });
  };

  const dueDateHandler = (event) => {
    dispatchUpdate({
      type: "due",
      dueValue: event.target.value,
    });
  };

  const statusChangeHandler = (event) => {
    dispatchUpdate({ type: "status", statusValue: event.target.value });
  };

  const updateTaskHandler = (event) => {
    event.preventDefault();

    const updatedTask = {
      title: updatedState.enteredTitle,
      description: updatedState.enteredDescription,
      priority: updatedState.chosenPriority,
      due: new Date(updatedState.enteredDueDate).toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      status: updatedState.enteredStatus,
      id: updatedState.id,
      visibleId: updatedState.visibleId,
      createdOn: updatedState.createdOn,
      firebaseId: updatedState.firebaseId,
    };

    ctxTasks.onUpdateTask(updatedTask);
    props.onRemoveModal();
  };

  const onDeleteTask = (event) => {
    event.preventDefault();
    const deletedTask = {
      title: updatedState.enteredTitle,
      description: updatedState.enteredDescription,
      priority: updatedState.chosenPriority,
      due: new Date(updatedState.enteredDueDate).toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      status: updatedState.enteredStatus,
      id: updatedState.id,
      visibleId: updatedState.visibleId,
      createdOn: updatedState.createdOn,
      firebaseId: updatedState.firebaseId,
    };
    ctxTasks.onRemoveTask(deletedTask);
    props.onRemoveModal();
  };

  let classes = `${styles["modal-container"]} ${props.className}`;

  return (
    <CSSTransition
      timeout={600}
      in={props.modalIsActive}
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
            <span className={styles["visible-id"]}>
              {updatedState.visibleId}
            </span>
            <Textarea
              textarea={{
                type: "textarea",
                rows: "2",
                id: styles["modal-title"],
                value: updatedState.enteredTitle,
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
                value: updatedState.enteredStatus,
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
                color: `${isToggle === true ? "#c78437" : "#2f2e41"}`,
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
              value: updatedState.enteredDescription,
              onChange: descriptionChangeHandler,
            }}
          ></Textarea>

          <div className={styles["priority"]}>
            <label id={styles["checkbox"]}>
              <Input
                input={{
                  type: "checkbox",
                  id: styles["checkbox-id"],
                  value: updatedState.isChecked ? "Not-important" : "Important",
                  onChange: checkboxHandler,
                  checked: updatedState.isChecked,
                }}
              />
              Priority
            </label>
          </div>

          <div className={styles["create-date"]}>
            <label>{`CreatedOn: ${updatedState.createdOn}`}</label>
          </div>

          <div className={styles["calendar"]}>
            <FontAwesomeIcon
              icon={faCalendarDays}
              style={{
                color: `${isToggle === true ? "#c78437" : "#2f2e41"}`,
                padding: " 0px 10px 0px 0px",
              }}
            />
            <Input
              className={`${
                isToggle === true ? styles["orange-icon"] : styles["modal-date"]
              }`}
              input={{
                type: "date",
                id: styles["modal-due-date"],
                value: updatedState.enteredDueDate,
                onChange: dueDateHandler,
              }}
            />
          </div>

          <div>
            <Button
              button={{ onClick: props.onRemoveModal }}
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
  );
};

export default ModalOverlay;
