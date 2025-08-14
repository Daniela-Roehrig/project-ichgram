
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./modules/App";
import { UserProvider } from "./context/UserContext"; // ✅ das fehlt bei dir!
import "./shared/styles/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <UserProvider> {/* ✅ HIER eingefügt */}
          <App />
        </UserProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
