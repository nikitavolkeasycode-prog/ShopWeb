import type { User, AuthResponse, LoginCredentials, RegisterCredentials, UpdateProfileData, Order, Review, PromoCode } from "../types/auth";
// Сервис авторизации.
// Здесь эмулируется работа с бэкендом: вход, регистрация, профиль, промокоды.

// Ключи для хранения данных в localStorage
const STORAGE_KEY_TOKEN = "voila_token";
const STORAGE_KEY_USER = "voila_user";
const STORAGE_KEY_ORDERS = "voila_orders";
const STORAGE_KEY_REVIEWS = "voila_reviews";
const STORAGE_KEY_WISHLIST = "voila_wishlist";
const STORAGE_KEY_PROMOS = "voila_promos";

// Генерация mock JWT токена (в реальном проекте токен приходит с сервера)
const generateToken = (): string =>
  "voila_jwt_" + Math.random().toString(36).substring(2) + Date.now().toString(36);

// Имитация задержки запроса к серверу
const delay = (ms: number = 500) => new Promise((r) => setTimeout(r, ms));

// ─── Mock база пользователей ─────────────────────────────────────────────────
const getUsers = (): Record<string, { password: string; user: User }> => {
  const raw = localStorage.getItem("voila_users");
  if (raw) return JSON.parse(raw);

  // Предустановленные аккаунты
  const defaults: Record<string, { password: string; user: User }> = {
    "demo@voila.com": {
      password: "demo123456",
      user: {
        id: "user_1",
        name: "Sophie Martin",
        email: "demo@voila.com",
        phone: "+1 (555) 123-4567",
        createdAt: new Date("2025-09-15").toISOString(),
        bonusPoints: 1250,
      },
    },
    // Аккаунт для преподавателя
    "liubovsheyda@gmail.com": {
      password: "Teacher_2026",
      user: {
        id: "user_teacher",
        name: "Любовь Шейда",
        email: "liubovsheyda@gmail.com",
        phone: "+7 (999) 123-45-67",
        createdAt: new Date("2025-01-10").toISOString(),
        bonusPoints: 5000,
      },
    },
  };
  localStorage.setItem("voila_users", JSON.stringify(defaults));
  return defaults;
};

const saveUsers = (users: Record<string, { password: string; user: User }>) =>
  localStorage.setItem("voila_users", JSON.stringify(users));

// ─── Заполнение демо-данных ─────────────────────────────────────────────────
const seedOrders = (userId: string): Order[] => {
  const existing = localStorage.getItem(STORAGE_KEY_ORDERS + "_" + userId);
  if (existing) return JSON.parse(existing);

  // Тестовые заказы
  const orders: Order[] = [
    {
      id: "ORD-001",
      items: [
        { id: "oi_1", productId: 1, name: "Wool Cashmere Coat", price: 320, quantity: 1, img: "prod1.jpg", size: "M", color: "Camel" },
        { id: "oi_2", productId: 3, name: "Leather Crossbody Bag", price: 180, quantity: 1, img: "prod3.jpg", color: "Black" },
      ],
      total: 500,
      status: "delivered", // Доставлен
      createdAt: new Date("2026-05-20").toISOString(),
      updatedAt: new Date("2026-05-28").toISOString(),
      shippingAddress: "123 Main St, New York, NY 10001",
      paymentMethod: "Credit Card (•••• 4242)",
    },
    {
      id: "ORD-002",
      items: [
        { id: "oi_3", productId: 5, name: "Linen Blend Blazer", price: 245, quantity: 2, img: "prod5.jpg", size: "S", color: "Ivory" },
      ],
      total: 490,
      status: "shipped", // Отправлен
      createdAt: new Date("2026-06-10").toISOString(),
      updatedAt: new Date("2026-06-12").toISOString(),
      shippingAddress: "123 Main St, New York, NY 10001",
      paymentMethod: "PayPal",
    },
    {
      id: "ORD-003",
      items: [
        { id: "oi_4", productId: 7, name: "Silk Evening Dress", price: 450, quantity: 1, img: "prod7.jpg", size: "M", color: "Midnight Blue" },
      ],
      total: 450,
      status: "processing", // В обработке
      createdAt: new Date("2026-06-15").toISOString(),
      updatedAt: new Date("2026-06-15").toISOString(),
      shippingAddress: "123 Main St, New York, NY 10001",
      paymentMethod: "Credit Card (•••• 4242)",
    },
  ];

  localStorage.setItem(STORAGE_KEY_ORDERS + "_" + userId, JSON.stringify(orders));
  return orders;
};

const seedReviews = (userId: string): Review[] => {
  const existing = localStorage.getItem(STORAGE_KEY_REVIEWS + "_" + userId);
  if (existing) return JSON.parse(existing);

  // Тестовые отзывы
  const reviews: Review[] = [
    { id: "rev_1", productId: 1, productName: "Wool Cashmere Coat", productImg: "prod1.jpg", rating: 5, text: "Absolutely stunning coat! The fabric is incredibly soft and warm. True to size.", createdAt: new Date("2026-05-30").toISOString() },
    { id: "rev_2", productId: 3, productName: "Leather Crossbody Bag", productImg: "prod3.jpg", rating: 4, text: "Beautiful bag with great craftsmanship. Fits all my essentials.", createdAt: new Date("2026-06-01").toISOString() },
  ];

  localStorage.setItem(STORAGE_KEY_REVIEWS + "_" + userId, JSON.stringify(reviews));
  return reviews;
};

const seedPromos = (userId: string): PromoCode[] => {
  const existing = localStorage.getItem(STORAGE_KEY_PROMOS + "_" + userId);
  if (existing) return JSON.parse(existing);

  // Тестовые промокоды
  const promos: PromoCode[] = [
    { id: "promo_1", code: "VOILA20", discount: 20, description: "Скидка 20% на следующий заказ от $150", expiresAt: new Date("2026-08-01").toISOString(), isUsed: false },
    { id: "promo_2", code: "BONUS50", discount: 50, description: "$50 скидки на любой товар полной цены", expiresAt: new Date("2026-07-15").toISOString(), isUsed: false },
    { id: "promo_3", code: "FREESHIP", discount: 0, description: "Бесплатная доставка на любой заказ", expiresAt: new Date("2026-09-01").toISOString(), isUsed: true },
  ];

  localStorage.setItem(STORAGE_KEY_PROMOS + "_" + userId, JSON.stringify(promos));
  return promos;
};

// ─── Валидация форм ─────────────────────────────────────────────────────────
export const validation = {
  email: (v: string): string | null => {
    if (!v) return "Email обязателен";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Введите корректный email адрес";
    return null;
  },
  password: (v: string): string | null => {
    if (!v) return "Пароль обязателен";
    if (v.length < 6) return "Пароль должен быть не менее 6 символов";
    return null;
  },
  name: (v: string): string | null => {
    if (!v) return "Имя обязательно";
    if (v.trim().length < 2) return "Имя должно содержать хотя бы 2 символа";
    return null;
  },
  confirmPassword: (password: string, confirm: string): string | null => {
    if (!confirm) return "Подтвердите пароль";
    if (password !== confirm) return "Пароли не совпадают";
    return null;
  },
  phone: (v: string): string | null => {
    if (!v) return null; // Поле опционально
    if (!/^[\d\s\+\-\(\)]{7,20}$/.test(v)) return "Введите корректный номер телефона";
    return null;
  },
};

// ─── Сервис аутентификации ──────────────────────────────────────────────────
export const authService = {
  // Регистрация нового пользователя
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay();
    const users = getUsers();
    const email = credentials.email.toLowerCase().trim();

    if (users[email]) {
      throw new Error("Аккаунт с таким email уже существует");
    }

    const newUser: User = {
      id: "user_" + Date.now(),
      name: credentials.name.trim(),
      email: email,
      createdAt: new Date().toISOString(),
      bonusPoints: 500, // Приветственный бонус
    };

    users[email] = { password: credentials.password, user: newUser };
    saveUsers(users);

    const token = generateToken();
    // Сохраняем сессию в localStorage
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));

    // Создаём демо-данные для нового пользователя
    seedOrders(newUser.id);
    seedReviews(newUser.id);
    seedPromos(newUser.id);

    return { user: newUser, token };
  },

  // Вход в аккаунт
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay();
    const users = getUsers();
    const email = credentials.email.toLowerCase().trim();
    const record = users[email];

    if (!record) {
      throw new Error("Аккаунт с таким email не найден");
    }

    if (record.password !== credentials.password) {
      throw new Error("Неверный пароль. Попробуйте снова.");
    }

    const token = generateToken();
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(record.user));

    return { user: record.user, token };
  },

  // Выход из аккаунта
  logout(): void {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  // Получение текущего пользователя из localStorage
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  // Проверка, авторизован ли пользователь
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY_TOKEN) && !!this.getCurrentUser();
  },

  // Обновление профиля пользователя
  async updateProfile(data: UpdateProfileData): Promise<User> {
    await delay();
    const user = this.getCurrentUser();
    if (!user) throw new Error("Не авторизован");

    const users = getUsers();
    const record = users[user.email];
    if (!record) throw new Error("Пользователь не найден");

    // Проверка уникальности email при смене
    if (data.email && data.email.toLowerCase().trim() !== user.email) {
      const newEmail = data.email.toLowerCase().trim();
      if (users[newEmail]) {
        throw new Error("Этот email уже используется");
      }
      // Переносим запись пользователя на новый email
      delete users[user.email];
      record.user.email = newEmail;
      users[newEmail] = record;
    }

    const updatedUser: User = {
      ...user,
      name: data.name?.trim() ?? user.name,
      email: data.email?.toLowerCase().trim() ?? user.email,
      phone: data.phone ?? user.phone,
      avatar: data.avatar ?? user.avatar,
    };

    record.user = updatedUser;
    saveUsers(users);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));

    return updatedUser;
  },

  // Получение списка заказов
  getOrders(): Order[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return seedOrders(user.id);
  },

  // Получение списка отзывов
  getReviews(): Review[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return seedReviews(user.id);
  },

  // Добавление нового отзыва
  addReview(productId: number, productName: string, productImg: string, rating: number, text: string): Review {
    const user = this.getCurrentUser();
    const reviews = this.getReviews();
    const newReview: Review = {
      id: "rev_" + Date.now(),
      productId,
      productName,
      productImg,
      rating,
      text,
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEY_REVIEWS + "_" + user!.id, JSON.stringify(reviews));
    return newReview;
  },

  // Удаление отзыва по ID
  deleteReview(reviewId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;
    const reviews = this.getReviews().filter((r) => r.id !== reviewId);
    localStorage.setItem(STORAGE_KEY_REVIEWS + "_" + user.id, JSON.stringify(reviews));
  },

  // Редактирование отзыва
  editReview(reviewId: string, rating: number, text: string): Review | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const reviews = this.getReviews();
    const idx = reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) return null;
    reviews[idx] = { ...reviews[idx], rating, text };
    localStorage.setItem(STORAGE_KEY_REVIEWS + "_" + user.id, JSON.stringify(reviews));
    return reviews[idx];
  },

  // Получение промокодов
  getPromoCodes(): PromoCode[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    return seedPromos(user.id);
  },

  // Отметить промокод как использованный
  usePromoCode(codeId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;
    const promos = this.getPromoCodes().map((p) =>
      p.id === codeId ? { ...p, isUsed: true } : p
    );
    localStorage.setItem(STORAGE_KEY_PROMOS + "_" + user.id, JSON.stringify(promos));
  },

  // Получение избранного
  getWishlist(): number[] {
    const raw = localStorage.getItem(STORAGE_KEY_WISHLIST + "_" + (this.getCurrentUser()?.id ?? ""));
    return raw ? JSON.parse(raw) : [];
  },

  saveWishlist(ids: number[]): void {
    const user = this.getCurrentUser();
    if (!user) return;
    localStorage.setItem(STORAGE_KEY_WISHLIST + "_" + user.id, JSON.stringify(ids));
  },
};


