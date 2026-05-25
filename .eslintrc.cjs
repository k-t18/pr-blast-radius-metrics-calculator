/* eslint-disable import/no-commonjs */
/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    env: { browser: true, es2023: true, node: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
    },
    settings: {
        react: { version: 'detect' },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: ['./tsconfig.json', './tsconfig.eslint.json'],
            },
        },
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import', 'prettier', 'unicorn'],
    extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/recommended',
        'plugin:prettier/recommended',
        'plugin:unicorn/recommended',
    ],
    rules: {
        'prettier/prettier': 'error',
        'react/react-in-jsx-scope': 'off',
        'unicorn/no-empty-file': 'off',
        'react/require-default-props': 'off',
        'react/jsx-filename-extension': ['warn', { extensions: ['.tsx', '.jsx'] }],
        'react/jsx-props-no-spreading': ['warn', { custom: 'ignore' }],
        'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never', js: 'never', jsx: 'never' }],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['**/*.test.*', '**/*.spec.*', '**/setupTests.*', '**/*.config.*', 'vite.config.*', 'eslint.config.*'],
            },
        ],
        'import/prefer-default-export': 'off',
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'no-console': 'error',
        'consistent-return': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        'unicorn/no-null': 'off',
        'unicorn/numeric-separators-style': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/explicit-length-check': 'error',
        'unicorn/prevent-abbreviations': ['error', { extendDefaultReplacements: true, checkFilenames: true }],
    },
    overrides: [
        {
            files: ['src/App.tsx'],
            rules: {
                'unicorn/filename-case': [
                    'error',
                    {
                        cases: { pascalCase: true },
                    },
                ],
            },
        },
        // 1) Components anywhere (src/**/components/**) → PascalCase
        {
            files: ['src/**/components/**/*.{ts,tsx,js,jsx}'],
            rules: {
                'unicorn/filename-case': [
                    'error',
                    {
                        cases: { pascalCase: true },
                        ignore: [
                            '^index\\.(ts|tsx|js|jsx)$', // allow index files
                        ],
                    },
                ],
            },
        },

        // 2) Everything else → camelCase (but ignore any components folders + App.tsx)
        {
            files: ['**/*.{ts,tsx,js,jsx}'],
            excludedFiles: [
                'src/**/components/**/*', // <-- key line (covers pages/**/components/** too)
                'src/App.tsx',
                '**/node_modules/**',
            ],
            rules: {
                'unicorn/filename-case': [
                    'error',
                    {
                        cases: { camelCase: true },
                        ignore: [
                            // common config/build filenames you likely want to allow
                            '^(vite|eslint|jest|postcss|tailwind|tsconfig|commitlint)\\..*$',
                            '^\\.eslintrc\\.(cjs|js)$',
                            '^\\.prettierrc\\..*$',
                            '^index\\.(ts|tsx|js|jsx)$',
                        ],
                    },
                ],
            },
        },
    ],

    ignorePatterns: ['dist', 'build', 'coverage', 'node_modules', '*.d.ts'],
};
