"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/humanize-ms";
exports.ids = ["vendor-chunks/humanize-ms"];
exports.modules = {

/***/ "(rsc)/./node_modules/humanize-ms/index.js":
/*!*******************************************!*\
  !*** ./node_modules/humanize-ms/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*!\n * humanize-ms - index.js\n * Copyright(c) 2014 dead_horse <dead_horse@qq.com>\n * MIT Licensed\n */ \n/**\n * Module dependencies.\n */ var util = __webpack_require__(/*! util */ \"util\");\nvar ms = __webpack_require__(/*! ms */ \"(rsc)/./node_modules/ms/index.js\");\nmodule.exports = function(t) {\n    if (typeof t === \"number\") return t;\n    var r = ms(t);\n    if (r === undefined) {\n        var err = new Error(util.format(\"humanize-ms(%j) result undefined\", t));\n        console.warn(err.stack);\n    }\n    return r;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaHVtYW5pemUtbXMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Q0FJQyxHQUVEO0FBRUE7O0NBRUMsR0FFRCxJQUFJQSxPQUFPQyxtQkFBT0EsQ0FBQztBQUNuQixJQUFJQyxLQUFLRCxtQkFBT0EsQ0FBQztBQUVqQkUsT0FBT0MsT0FBTyxHQUFHLFNBQVVDLENBQUM7SUFDMUIsSUFBSSxPQUFPQSxNQUFNLFVBQVUsT0FBT0E7SUFDbEMsSUFBSUMsSUFBSUosR0FBR0c7SUFDWCxJQUFJQyxNQUFNQyxXQUFXO1FBQ25CLElBQUlDLE1BQU0sSUFBSUMsTUFBTVQsS0FBS1UsTUFBTSxDQUFDLG9DQUFvQ0w7UUFDcEVNLFFBQVFDLElBQUksQ0FBQ0osSUFBSUssS0FBSztJQUN4QjtJQUNBLE9BQU9QO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9haS1jb25jZXB0LWNhcmQvLi9ub2RlX21vZHVsZXMvaHVtYW5pemUtbXMvaW5kZXguanM/YzFiMiJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGh1bWFuaXplLW1zIC0gaW5kZXguanNcbiAqIENvcHlyaWdodChjKSAyMDE0IGRlYWRfaG9yc2UgPGRlYWRfaG9yc2VAcXEuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgbXMgPSByZXF1aXJlKCdtcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0KSB7XG4gIGlmICh0eXBlb2YgdCA9PT0gJ251bWJlcicpIHJldHVybiB0O1xuICB2YXIgciA9IG1zKHQpO1xuICBpZiAociA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcih1dGlsLmZvcm1hdCgnaHVtYW5pemUtbXMoJWopIHJlc3VsdCB1bmRlZmluZWQnLCB0KSk7XG4gICAgY29uc29sZS53YXJuKGVyci5zdGFjayk7XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuIl0sIm5hbWVzIjpbInV0aWwiLCJyZXF1aXJlIiwibXMiLCJtb2R1bGUiLCJleHBvcnRzIiwidCIsInIiLCJ1bmRlZmluZWQiLCJlcnIiLCJFcnJvciIsImZvcm1hdCIsImNvbnNvbGUiLCJ3YXJuIiwic3RhY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/humanize-ms/index.js\n");

/***/ })

};
;