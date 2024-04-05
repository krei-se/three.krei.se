module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-multi-spaces': 'off', // ['error', { ignoreEOLComments: true, exceptions: { VariableDeclarator: true } }],
    'padded-blocks': 'off',
    'brace-style': 'off',
    'no-unused-vars': 'warning'
  }
}
