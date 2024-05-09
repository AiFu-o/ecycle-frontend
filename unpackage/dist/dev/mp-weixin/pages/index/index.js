"use strict";
const global_mixin_themeMixin = require("../../global/mixin/theme-mixin.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  mixins: [global_mixin_themeMixin.themeMixin],
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {
  },
  methods: {}
};
if (!Array) {
  const _component_up_button = common_vendor.resolveComponent("up-button");
  _component_up_button();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.title),
    b: common_vendor.t("主题" + _ctx.cTheme),
    c: common_vendor.o(_ctx.cToggleTheme),
    d: common_vendor.p({
      text: "修改主题"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/joker/my/myProject/ecycle/ecycle-frontend/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
