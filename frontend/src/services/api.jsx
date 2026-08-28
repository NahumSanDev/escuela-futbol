const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://escuela-futbol-production.up.railway.app/api";

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("cefor_token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error en la solicitud");
  }

  return data;
}

export const authService = {
  login: (email, password) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    fetchAPI("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  me: () => fetchAPI("/auth/me"),

  forgotPassword: (email) =>
    fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  sendOtp: (email) =>
    fetchAPI("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email, code) =>
    fetchAPI("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    }),

  resetPassword: (token, newPassword) =>
    fetchAPI("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};

export const pagosService = {
  getAll: (page = 1, limit = 10000) => fetchAPI(`/pagos?page=${page}&limit=${limit}`),
  getAllSinLimite: () => fetchAPI("/pagos"),
  create: (data) =>
    fetchAPI("/pagos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/pagos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/pagos/${id}`, { method: "DELETE" }),
  exportExcel: () => fetchAPI("/pagos/export"),
};

export const partidosService = {
  getAll: () => fetchAPI("/partidos"),
  getProximos: () => fetchAPI("/partidos?estado=pendiente"),
  getResultados: () => fetchAPI("/partidos?estado=jugado"),
  create: (data) =>
    fetchAPI("/partidos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/partidos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/partidos/${id}`, { method: "DELETE" }),
};

export const avisosService = {
  getAll: () => fetchAPI("/avisos"),
  create: (data) =>
    fetchAPI("/avisos", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/avisos/${id}`, { method: "DELETE" }),
};

export const comentariosService = {
  getByAviso: (avisoId) => fetchAPI(`/comentarios/aviso/${avisoId}`),
  create: (data) =>
    fetchAPI("/comentarios", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/comentarios/${id}`, { method: "DELETE" }),
};

export const productosService = {
  getAll: () => fetchAPI("/productos"),
  create: (data) =>
    fetchAPI("/productos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/productos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/productos/${id}`, { method: "DELETE" }),
};

export const familiasService = {
  getAll: () => fetchAPI("/familias"),
  delete: (id) => fetchAPI(`/familias/${id}`, { method: "DELETE" }),
};

export const adminService = {
  resetPassword: (usuarioId, newPassword) =>
    fetchAPI("/auth/admin-reset", {
      method: "POST",
      body: JSON.stringify({ usuario_id: usuarioId, newPassword }),
    }),
};

export const eventosService = {
  getAll: () => fetchAPI("/eventos"),
  create: (data) =>
    fetchAPI("/eventos", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/eventos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/eventos/${id}`, { method: "DELETE" }),
};

export const notificacionesService = {
  getAll: () => fetchAPI("/notificaciones"),
  marcarLeida: (id) => fetchAPI(`/notificaciones/${id}/leer`, { method: "PUT" }),
  marcarTodasLeidas: () => fetchAPI("/notificaciones/leer-todas", { method: "PUT" }),
};

export default API_URL;
