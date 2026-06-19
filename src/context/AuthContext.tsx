// Контекст аутентификации - глобальное состояние пользователя в приложении
// Позволяет любому компоненту получить доступ к данным пользователя,
// функциям входа/выхода и обновления профиля

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authService } from "../services/auth.service";
import type { User, LoginCredentials, RegisterCredentials, UpdateProfileData } from "../types/auth";

// Тип контекста с доступными методами и состоянием
interface AuthContextValue {
  user: User | null;          // Текущий пользователь или null
  isAuthenticated: boolean;   // Авторизован ли пользователь
  isLoading: boolean;         // Флаг загрузки
  error: string | null;       // Сообщение об ошибке

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<User>;
  clearError: () => void;
  refreshUser: () => void;    // Обновить данные пользователя из хранилища
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Провайдер контекста - оборачивает всё приложение
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // При монтировании проверяем, есть ли сохранённая сессия
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Функция входа
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка входа. Попробуйте снова.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Функция регистрации
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка регистрации. Попробуйте снова.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Выход из аккаунта
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  // Обновление профиля
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setError(null);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка обновления профиля.";
      setError(message);
      throw err;
    }
  }, []);

  // Принудительное обновление данных пользователя
  const refreshUser = useCallback(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста аутентификации в компонентах
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return ctx;
}