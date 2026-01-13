import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,

  {
    plugins: {
      react,
    },
    rules: {
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
