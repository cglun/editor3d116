import { APP_COLOR, AppConfig } from '../type';
let THEME = APP_COLOR.Dark.toString();
export const iconIsFill = false;
export const SPACE = ' ';
export const APP_CONFIG: AppConfig = {
  SERVER: location.origin + '/api/v3',
  projectId: '0',
  accessToken: { data: 'data', type: 'type' },
  currentProjectID: '0',
  TOKEN: 'token',
};
export function initThemeColor() {
  const themeColor = localStorage.getItem('app_theme');
  if (themeColor !== null) {
    THEME = themeColor;
    document.body.setAttribute('data-bs-theme', themeColor);
  } else {
    document.body.setAttribute('data-bs-theme', 'dark');
  }
}
export function getThemeColor() {
  return THEME;
}

export function setThemeColor(color: string) {
  THEME = color;
}
export default THEME;
