// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            "@typescript-eslint/no-confusing-void-expression": [
                "error",
                {
                    "ignoreArrowShorthand": true,
                    "ignoreVoidOperator": true,
                }
            ],
        },
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }
);
