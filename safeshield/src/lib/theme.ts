export type Theme = "dark" | "light";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("safeshield_theme") as Theme) ?? "dark";
}

export function setTheme(t: Theme) {
  localStorage.setItem("safeshield_theme", t);
  document.documentElement.setAttribute("data-theme", t);
}

export function applyTheme() {
  document.documentElement.setAttribute("data-theme", getTheme());
}
