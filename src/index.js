import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { TasksContextProvider } from "./contextAPI/tasks-context";
import { NavbarContextProvider } from "./contextAPI/navbar-context";
import { ThemeModeContextProvider } from "./contextAPI/theme-mode-context";
import { AuthContextProvider } from "./contextAPI/auth-context";
import { DragAndDropContextProvider } from "./contextAPI/dnd-context";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <TasksContextProvider>
        <DragAndDropContextProvider>
          <NavbarContextProvider>
            <ThemeModeContextProvider>
              <App />
            </ThemeModeContextProvider>
          </NavbarContextProvider>
        </DragAndDropContextProvider>
      </TasksContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
