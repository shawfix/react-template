'use strict';

import { relative } from 'node:path';

import { ESLint } from 'eslint';

const removeIgnoredFiles = async (files) => {
  const cwd = process.cwd();
  const eslint = new ESLint();
  const relativePaths = files.map((file) => relative(cwd, file));
  const isIgnored = await Promise.all(relativePaths.map((file) => eslint.isPathIgnored(file)));

  const filteredFiles = files.filter((_, i) => !isIgnored[i]);

  return filteredFiles.join(' ');
};

/**
 * Lint Staged Config
 */
const lintStaged = {
  '**/*.{cjs,mjs,js,ts,jsx,tsx,vue}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files);

    return [`npx eslint -c eslint.config.js --max-warnings=0 --fix ${filesToLint}`];
  },
  '**/*.{json,md}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files);

    return [`npx prettier --config .prettierrc --ignore-path --write ${filesToLint}`];
  },
};

export default lintStaged;
