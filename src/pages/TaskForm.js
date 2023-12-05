import styles from "./TaskForm.module.css";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Textarea from "../components/UI/Textarea";
import DropdownInput from "../components/UI/DropdownInput";
import ConfirmModal from "../components/UI/ConfirmModal";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/UI/ErrorModal";
import useHttp from "../hooks/use-http";
import { useSelector, useDispatch } from "react-redux";
import { tasksActions, CreateTask } from "../store/tasks-slice";

const TaskForm = () => {
  const userId = localStorage.getItem("localId");
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const { initialTasks, confirmModalIsActive } = tasks;

  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredDescription, setEnteredDescription] = useState("");
  const [chosenFlag, setChosenFlag] = useState("Not-important");
  const [enteredDueDate, setEnteredDueDate] = useState("");
  const [enteredStatus, setEnteredStatus] = useState("To do");

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const descriptionChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const checkboxHandler = (event) => {
    let checkbox = document.getElementById("checkbox-id");
    if (checkbox.checked) {
      checkbox.setAttribute("value", "Important");
    }
    setChosenFlag(event.target.value);
  };

  const dueDateHandler = (event) => {
    setEnteredDueDate(event.target.value);
  };

  const statusChangeHandler = (event) => {
    setEnteredStatus(event.target.value);
  };

  const visibleIdHandler = () => {
    const arrayOfVisibleIds = initialTasks.map((task) => {
      const numberPartOfVisibleId = +task.visibleId.slice(5);
      return numberPartOfVisibleId;
    });
    return Math.max(...arrayOfVisibleIds);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let checkbox = document.getElementById("checkbox-id");

    const taskData = {
      title: enteredTitle,
      description: enteredDescription,
      priority: chosenFlag,
      due: new Date(enteredDueDate).toLocaleString("en-GB", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      status: enteredStatus,
      id: Math.floor(Math.random() * 10000000 + 1),
      visibleId:
        initialTasks.length === 0
          ? "TASK-1"
          : "TASK-" + (visibleIdHandler() + 1),
      createdOn: new Date().toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    };

    dispatch(CreateTask(taskData, sendRequest, userId));

    setEnteredTitle("");
    setEnteredDescription("");
    setChosenFlag("Not-important");
    setEnteredDueDate("");
    setEnteredStatus("To do");
    checkbox.checked = false;
  };

  useEffect(() => {
    if (confirmModalIsActive) {
      dispatch(tasksActions.isTaskCreated());
    }
  }, [confirmModalIsActive, dispatch]);

  return (
    <>
      {confirmModalIsActive &&
        ReactDOM.createPortal(
          <ConfirmModal></ConfirmModal>,
          document.getElementById("confirm-modal")
        )}

      {isLoading ? (
        <ClipLoader
          color={"#c78437"}
          loading={true}
          cssOverride={{
            position: "fixed",
            inset: "280px 0 0 630px",
          }}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className={styles["task-wrapper"]}>
          <div className={styles["form-wrapper"]}>
            <form onSubmit={submitHandler}>
              <Input
                label="Title"
                input={{
                  type: "text",
                  id: "task-title",
                  placeholder: "Enter task title",
                  value: enteredTitle,
                  onChange: titleChangeHandler,
                  required: true,
                }}
              ></Input>
              <Textarea
                label="Description"
                textarea={{
                  rows: "10",
                  placeholder: "Enter details about task...",
                  id: "textarea",
                  value: enteredDescription,
                  onChange: descriptionChangeHandler,
                }}
              ></Textarea>
              <label id={styles["checkbox"]}>
                <Input
                  input={{
                    type: "checkbox",
                    id: "checkbox-id",
                    value: chosenFlag,
                    onChange: checkboxHandler,
                  }}
                />
                Priority
              </label>
              <Input
                label="Due date"
                input={{
                  type: "date",
                  id: "task-due-date",
                  value: enteredDueDate,
                  onChange: dueDateHandler,
                  required: true,
                }}
              />
              <DropdownInput
                label="Status"
                dropdownInput={{
                  id: "select-field",
                  value: enteredStatus,
                  onChange: statusChangeHandler,
                }}
              >
                <option value="To do">To do</option>
                <option value="In progress">In progress</option>
                <option value="Done">Done</option>
              </DropdownInput>

              {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
              {!error && (
                <Button button={{ type: "submit" }}>Create task</Button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskForm;
