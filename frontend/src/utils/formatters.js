export function statusClass(status) {
  if (status === "Closed") return "status-closed";
  if (status === "Under Investigation") return "status-investigation";
  return "status-open";
}

export function priorityClass(priority) {
  return { Low: "p-low", Medium: "p-med", High: "p-high", Critical: "p-crit" }[priority] || "p-med";
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatFileSize(bytes) {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}
