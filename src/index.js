import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DragAndDropContextProvider } from "./contextAPI/dnd-context";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <DragAndDropContextProvider>
        <App />
      </DragAndDropContextProvider>
    </Provider>
  </BrowserRouter>
);
