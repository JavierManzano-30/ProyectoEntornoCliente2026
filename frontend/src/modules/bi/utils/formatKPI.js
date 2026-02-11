// Utilidad para formatear valores de KPI
export function formatKPI(value, type = "total") {
  if (type === "variación" || type === "tendencia") {
    return `${value > 0 ? "+" : ""}${value}%`;
  }
  return value;
}
