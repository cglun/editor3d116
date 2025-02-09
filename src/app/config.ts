import { APP_COLOR } from "./type";
let THEME = APP_COLOR.Dark.toString();
export const iconIsFill = false;
export const SPACE = " ";

export function initThemeColor() {
  const themeColor = localStorage.getItem("app_theme");
  if (themeColor !== null) {
    THEME = themeColor;
    document.body.setAttribute("data-bs-theme", themeColor);
  } else {
    document.body.setAttribute("data-bs-theme", "dark");
  }
}
export function getThemeColor() {
  return THEME;
}
export function getButtonColor() {
  const color = THEME === APP_COLOR.Dark ? "light" : "dark";
  return "outline-" + color;
}
export function setThemeColor(color: string) {
  THEME = color;
}
export default THEME;
