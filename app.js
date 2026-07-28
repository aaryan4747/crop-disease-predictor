function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) {
    document.body.setAttribute('data-theme', theme);
  }
  localStorage.setItem('crop_theme', theme);

  if (dom.themeIcon && dom.themeText) {
    if (theme === 'light') {
      dom.themeIcon.textContent = '☀️';
      dom.themeText.textContent = 'Light';
    } else {
      dom.themeIcon.textContent = '🌙';
      dom.themeText.textContent = 'Dark';
    }
  }
}
