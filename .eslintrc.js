module.exports = {
    env: {
        es2020: true,
        node: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },
    rules: {
        'no-console': 'off',
        'generator-star-spacing': 'off',
        'no-mixed-operators': 0,
        'no-tabs': 0,
        quotes: [
            2,
            'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],
        semi: [
            2,
            'never',
            {
                beforeStatementContinuationChars: 'never',
            },
        ],
        'no-delete-var': 2,
        'prefer-const': [
            2,
            {
                ignoreReadBeforeAssign: false,
            },
        ],
        'template-curly-spacing': 'off',
        indent: 'off',
        'import/extensions': 'off',
        'no-restricted-syntax': 'off'
    },
}
