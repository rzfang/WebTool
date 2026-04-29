import css from '@eslint/css';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

import jsonConfig from 'rzjs/eslint/config.json.mjs';
import jsStrictConfig from 'rzjs/eslint/config.js.strict.mjs';
import jsStyleConfig from 'rzjs/eslint/config.js.style.mjs';
import mdConfig from 'rzjs/eslint/config.markdown.mjs';
import r4fConfig from 'riot-4-fun/eslint/config.mjs';

export default defineConfig([
  globalIgnores ([ '**/*.riot.*.mjs', 'package-lock.json', '.r4f' ]),
  {
    files: [ '**/*.{js,mjs,cjs}' ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  jsonConfig,
  jsStrictConfig,
  jsStyleConfig,
  mdConfig,
  r4fConfig,
  {
    extends: [ 'css/recommended' ],
    files: [ '**/*.css' ],
    language: 'css/css',
    plugins: { css },
    rules: {
      'css/use-baseline': [ 'error', { allowSelectors: [ 'nesting' ] } ],
    },
  },
]);
