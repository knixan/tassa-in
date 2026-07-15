export type AvailableSlot = {
  time: string;
  isAvailable: boolean;
  spotsLeft: number;
};

export type DateSlots = {
  date: string;
  slots: AvailableSlot[];
};

export type BookingResponse = {
  id: number;
  startUtc: string;
  endUtc: string;
  serviceType: string;
  petName: string;
  petType: string;
  petBreed: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  message: string | null;
  startLocal: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
};

export type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
  role: string;
};

/** Fired whenever an authenticated admin request comes back 401 (expired/invalid token). */
export const UNAUTHORIZED_EVENT = "admin:unauthorized";

// Empty by default, so local dev keeps hitting relative /api/... paths
// (proxied to the backend by vite.config.ts). Set VITE_API_URL when the
// frontend and backend are deployed to different origins (e.g. Vercel +
// Railway/Render) - the backend's Cors:AllowedOrigins must then include the
// frontend's origin, since this becomes a genuine cross-origin request.
const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Servern svarar inte – kontrollera att API:et är igång.");
    }
    throw new Error("Kunde inte ansluta till servern.");
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // A 401 on an authenticated request means the token expired/is invalid -
    // clear it and let the admin UI drop back to the login screen, in one place
    // instead of every call site guessing at the error message.
    if (res.status === 401 && "Authorization" in headers) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_name");
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  getSlots: (date: string) =>
    request<DateSlots>(`/api/bookings/slots/${date}`),

  createBooking: (data: {
    date: string;
    startTime: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    serviceType?: string;
    petName?: string;
    petType?: string;
    petBreed?: string;
    message?: string;
  }) =>
    request<{ id: number }>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  admin: {
    getBookings: (date?: string) =>
      request<BookingResponse[]>(
        `/api/admin/bookings${date ? `?date=${date}` : ""}`,
        { headers: authHeaders() }
      ),

    deleteBooking: (id: number) =>
      request<void>(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),

    getUsers: () =>
      request<AdminUser[]>("/api/admin/users", { headers: authHeaders() }),

    createUser: (data: { email: string; fullName: string; password: string }) =>
      request<AdminUser>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(),
      }),

    deleteUser: (id: string) =>
      request<void>(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      }),
  },
};
