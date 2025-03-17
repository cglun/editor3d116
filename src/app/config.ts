import { APP_COLOR } from "./type";

export const SPACE = " ";

export function getButtonColor(theme: APP_COLOR) {
  const color = theme === "dark" ? "light" : "dark";
  return "outline-" + color;
}
