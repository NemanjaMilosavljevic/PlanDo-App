import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
} from "react";
import useHttp from "../hooks/use-http";
import AuthContext from "./auth-context";

const TasksContext = React.createContext({
  initialTasks: [],
  setInitialTasks: () => {},
  isModifiedTask: false,
  setIsModifiedTask: () => {},
  onUpdateTask: (task) => {},
  onSaveTask: (task) => {},
  onRemoveTask: (id) => {},
  filterState: {},
  onFilteredMonth: () => {},
  onFilteredPriority: () => {},
  monthRef: {},
  priorityRef: {},
  isLoading: false,
  error: null,
  clearError: () => {},
  didCreateTask: false,
  closeConfirmModal: () => {},
  confirmModalIsActive: false,
});

export const TasksContextProvider = (props) => {
  const ctxAuth = useContext(AuthContext);
  const { userId } = ctxAuth;
  const [initialTasks, setInitialTasks] = useState([]);
  const [isModifiedTask, setIsModifiedTask] = useState(false);
  const monthRef = useRef();
  const priorityRef = useRef();

  const initialFilterState = {
    filteredMonth: "All",
    filteredPriority: "All",
    filteredTasks: initialTasks,
  };

  const filterReducer = (state, action) => {
    const filteredTasksHandler = () => {
      const monthValue = monthRef.current.value;
      const priorityValue = priorityRef.current.value;

      const tasksPerMonth = initialTasks.filter((task) => {
        if (monthValue === "All") {
          return initialTasks;
        }
        return monthValue === task.createdOn.slice(0, -9);
      });

      const tasksPerPriority = initialTasks.filter((task) => {
        if (priorityValue === "All") {
          return initialTasks;
        }
        return priorityValue === task.priority;
      });

      return tasksPerMonth.filter(
        (task) => true === tasksPerPriority.some((el) => el.id === task.id)
      );
    };

    if (action.type === "month") {
      return {
        filteredMonth: action.value,
        filteredPriority: state.filteredPriority,
        filteredTasks: filteredTasksHandler(),
      };
    }

    if (action.type === "priority") {
      return {
        filteredMonth: state.filteredMonth,
        filteredPriority: action.value,
        filteredTasks: filteredTasksHandler(),
      };
    }

    return initialFilterState;
  };

  const [filterState, dispatchFilter] = useReducer(
    filterReducer,
    initialFilterState
  );

  useEffect(() => {
    filterState.filteredTasks = initialTasks;
    filterState.filteredMonth = "All";
    filterState.filteredPriority = "All";
    return () => {
      setIsModifiedTask(false);
    };
  }, [initialTasks, isModifiedTask]);

  const filterMonthHandler = (event) => {
    dispatchFilter({ type: "month", value: event.target.value });
  };

  const filterPriorityHandler = (event) => {
    dispatchFilter({ type: "priority", value: event.target.value });
  };

  //Sending HTTP Requests...

  const { isLoading, error, sendRequest, clearError } = useHttp();
  const [didCreateTask, setDidCreateTask] = useState(false);
  const [confirmModalIsActive, setConfirmModalIsActive] = useState(false);

  const fetchTasksOnCreate = async (taskData, taskObj) => {
    const generatedId = taskObj.name;
    const createdTask = { ...taskData, firebaseId: generatedId };
    setInitialTasks((prevState) => {
      return [...prevState, createdTask];
    });

    setConfirmModalIsActive(true);
    setTimeout(() => {
      closeConfirmModal();
    }, 3000);
  };

  const createTaskHandler = async (taskData) => {
    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: taskData,
      },
      fetchTasksOnCreate.bind(null, taskData)
    );
  };

  const closeConfirmModal = () => {
    setTimeout(() => {
      setConfirmModalIsActive(false);
    }, 1000);
    setDidCreateTask(false);
  };

  useEffect(() => {
    if (confirmModalIsActive) {
      setDidCreateTask(true);
    }
  }, [confirmModalIsActive]);

  //---------------------------------

  const modifyTaskHandler = async (updatedTask) => {
    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${updatedTask.firebaseId}/.json`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedTask,
      },
      fetchTasksOnModify.bind(null, updatedTask)
    );
  };

  const fetchTasksOnModify = async (updatedTask) => {
    for (const key of initialTasks) {
      if (updatedTask.firebaseId === key.firebaseId) {
        for (const prop in key) {
          if (!(key[prop] === updatedTask[prop])) {
            key[prop] = updatedTask[prop];
          }
        }
      }
      setIsModifiedTask(true);
      setInitialTasks(initialTasks);
    }
  };

  const fetchTasksOnDelete = async (updatedTaskList) => {
    setInitialTasks(updatedTaskList);
  };

  const deleteTaskHandler = async (task) => {
    let updatedTasks = initialTasks.filter(
      (item) => item.firebaseId !== task.firebaseId
    );

    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks/${task.firebaseId}/.json`,
        method: "DELETE",
      },
      fetchTasksOnDelete.bind(null, updatedTasks)
    );
  };

  useEffect(() => {
    const fetchTasksHandler = (taskObj) => {
      const initialTasks = [];

      for (const key in taskObj) {
        initialTasks.push({
          title: taskObj[key]?.title,
          description: taskObj[key]?.description,
          priority: taskObj[key]?.priority,
          due: taskObj[key]?.due,
          status: taskObj[key]?.status,
          id: taskObj[key]?.id,
          visibleId: taskObj[key]?.visibleId,
          createdOn: taskObj[key]?.createdOn,
          firebaseId: key,
        });
      }

      setInitialTasks(initialTasks);
    };

    sendRequest(
      {
        url: `https://plan-do-95624-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/tasks.json`,
      },
      fetchTasksHandler
    );
  }, [sendRequest, userId]);

  return (
    <TasksContext.Provider
      value={{
        initialTasks,
        isModifiedTask,
        setInitialTasks,
        setIsModifiedTask,
        onUpdateTask: modifyTaskHandler,
        onCreateTask: createTaskHandler,
        onRemoveTask: deleteTaskHandler,
        filterState,
        onFilteredMonth: filterMonthHandler,
        onFilteredPriority: filterPriorityHandler,
        monthRef,
        priorityRef,
        isLoading,
        error,
        clearError,
        didCreateTask,
        closeConfirmModal,
        confirmModalIsActive,
      }}
    >
      {props.children}
    </TasksContext.Provider>
  );
};

export default TasksContext;
