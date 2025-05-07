import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles.scss";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);
