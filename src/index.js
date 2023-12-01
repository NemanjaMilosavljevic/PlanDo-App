import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { TasksContextProvider } from "./contextAPI/tasks-context";
import { AuthContextProvider } from "./contextAPI/auth-context";
import { DragAndDropContextProvider } from "./contextAPI/dnd-context";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthContextProvider>
        <TasksContextProvider>
          <DragAndDropContextProvider>
            <App />
          </DragAndDropContextProvider>
        </TasksContextProvider>
      </AuthContextProvider>
    </Provider>
  </BrowserRouter>
);
