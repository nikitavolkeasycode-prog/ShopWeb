// Точка входа в приложение.
// Здесь создаётся корневой элемент React и оборачивается провайдером авторизации.
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// AuthProvider хранит данные о текущем пользователе (вошёл/не вошёл) и раздаёт их всему приложению.
import { AuthProvider } from "./context/AuthContext";
// Глобальные стили (шрифты, цвета, базовые правила).
import "./styles/index.css";

// Находим <div id="root"> в index.html и рендерим туда интерфейс.
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

