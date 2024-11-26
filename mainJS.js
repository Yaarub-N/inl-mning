const themeSwitch = document.getElementById("theme-switch");

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme", themeSwitch.checked);
});
