/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 4,
  singleQuote: true,
  trailingComma: "es5",
  bracketSameLine: true,
  printWidth: 120,
  arrowParens: "always"
};

export default config;
