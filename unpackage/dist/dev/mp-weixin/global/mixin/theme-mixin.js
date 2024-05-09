"use strict";
const global_agency_themeAgency = require("../agency/theme-agency.js");
const { theme, toggleTheme } = global_agency_themeAgency.useTheme();
const themeMixin = {
  data() {
    return {
      cTheme: theme
    };
  },
  methods: {
    cToggleTheme: function() {
      toggleTheme();
    }
  }
};
exports.themeMixin = themeMixin;
