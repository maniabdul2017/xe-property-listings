
export function formatPrice(price, type) {
  if (price === null || price === undefined) return null;

  const formatted = new Intl.NumberFormat("el-GR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

  return type === "rent" ? `${formatted} / month` : formatted;
}


export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}