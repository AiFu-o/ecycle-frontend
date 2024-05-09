"use strict";
const common_vendor = require("../../common/vendor.js");
console.log("on theme agency run init");
let cThemeControl = "OS";
let cTheme = "light";
const themeControlEnum = ["OS", "fixed"];
const themeEnum = ["light", "dark"];
const LOCAL_KEY_THEME_CONTROL = "__rd_theme_control__";
const LOCAL_KEY_THEME = "__rd_theme__";
checkAll();
cThemeControl = common_vendor.index.getStorageSync(LOCAL_KEY_THEME_CONTROL);
cTheme = common_vendor.index.getStorageSync(LOCAL_KEY_THEME);
function checkAll() {
  checkAndFixTheme(themeControlEnum, LOCAL_KEY_THEME_CONTROL);
  checkAndFixTheme(themeEnum, LOCAL_KEY_THEME);
}
function checkAndFixTheme(_list, _storageKey) {
  if (!common_vendor.index.getStorageSync(_storageKey) || !_list.includes(common_vendor.index.getStorageSync(_storageKey))) {
    common_vendor.index.setStorageSync(_storageKey, _list[0]);
    return false;
  }
  return true;
}
common_vendor.index.onThemeChange((_r) => {
  handleThemeChange(_r);
});
function handleThemeChange(_r, _coercive) {
  if (!_coercive && cThemeControl == "fixed") {
    return;
  }
  if (_r.includes("dark")) {
    cTheme = "dark";
  } else {
    cTheme = "light";
  }
  common_vendor.index.setStorageSync(LOCAL_KEY_THEME, cTheme);
}
function useTheme() {
  return {
    theme: cTheme,
    toggleTheme() {
      handleThemeChange(cTheme == "dark" ? "light" : "dark");
    }
  };
}
exports.useTheme = useTheme;
