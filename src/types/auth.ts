// Типы данных для системы аутентификации и личного кабинета
// ─── Типы данных: авторизация, заказы, отзывы, промокоды ────────────────────

export interface User {
  id: string;
  name: string; // Имя пользователя
  email: string;
  phone?: string; // Телефон (опционально)
  avatar?: string; // URL аватара
  createdAt: string; // Дата регистрации
  bonusPoints: number; // Бонусные баллы
}

export interface AuthResponse {
  user: User;
  token: string; // JWT токен
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  newsletter?: boolean; // Подписка на новости
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

// ─── Заказы ─────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
  size?: string;
  color?: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string; // Адрес доставки
  paymentMethod: string; // Способ оплаты
}

// ─── Отзывы ────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  productId: number;
  productName: string;
  productImg: string;
  rating: number; // Оценка от 1 до 5
  text: string;
  createdAt: string;
}

// ─── Промокоды ─────────────────────────────────────────────────────────────
export interface PromoCode {
  id: string;
  code: string; // Код для ввода
  discount: number; // Скидка в процентах
  description: string;
  expiresAt: string; // Дата истечения
  isUsed: boolean; // Использован ли код
}
