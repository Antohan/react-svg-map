module.exports = {
  "ecmaFeatures": {
    "jsx": true,
    "modules": true
  },
  "parser": "babel-eslint",
  "rules": {
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/react-in-jsx-scope": 2,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/sort-comp": 0,
    "react/no-array-index-key": 0,
    "react/forbid-prop-types": 0,
    "import/no-extraneous-dependencies": 0,
  },
  "extends": "airbnb",
};
