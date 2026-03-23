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
};

export const pagosService = {
  getAll: () => fetchAPI("/pagos"),
  create: (data) =>
    fetchAPI("/pagos", { method: "POST", body: JSON.stringify(data) }),
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

export default API_URL;
