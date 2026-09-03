export const formatCurrency = (amount) => {
  // Formato americano: $1500.00 (punto para decimales, sin separador de miles)
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `$${formatted}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  // Evitar el desfase de zona horaria: usar solo la parte de fecha YYYY-MM-DD
  const datePart = dateString.toString().split("T")[0].split(" ")[0];
  const parts = datePart.split("-");
  if (parts.length !== 3) return dateString;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
};
