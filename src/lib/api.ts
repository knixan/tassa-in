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

export type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
  role: string;
};

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let res: Response;
  try {
    res = await fetch(path, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
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
  },
};
