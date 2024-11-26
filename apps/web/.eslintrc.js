/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Supports modern JavaScript syntax (e.g., ES2021)
    sourceType: 'module', // Allows `import` and `export`
    project: './tsconfig.json', // Required for TypeScript integration
    tsconfigRootDir: __dirname,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Recommended rules for TypeScript
    'plugin:react/recommended', // For React projects
    'plugin:next/recommended', // For Next.js projects
  ],
  overrides: [
    {
      files: ['*.js'], // Apply settings for JavaScript files
      parser: 'espree', // Use the default JS parser
      parserOptions: {
        ecmaVersion: 2021, // Support modern JavaScript
        sourceType: 'module', // Allows `import`/`export`
      },
    },
  ],
 
};
