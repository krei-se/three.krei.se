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
  },
  globals: {
    suncalc: 'writable',
    sunposition: 'writable',
    brightness: 'writable',
    time: 'writable',
    rhythms: 'writable',
    colorSchemes: 'writable',
    colorScheme: 'writable',

    autoplay: 'writable',

    debug: 'writable',

    clientInterface: 'writable',

    renderer: 'writable',
    scene: 'writable',
    camera: 'writable',
    clock: 'writable'
    /* var2: 'readonly' */
  }
}
