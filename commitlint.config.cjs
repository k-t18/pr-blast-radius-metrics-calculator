module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // New feature
                'fix', // Bug fix
                'docs', // Documentation changes
                'style', // Code style changes (formatting, etc.)
                'refactor', // Code refactoring
                'perf', // Performance improvements
                'test', // Adding or updating tests
                'chore', // Maintenance tasks
                'ci', // CI/CD changes
                'config', // Configuration changes
                'build', // Build system changes
                'revert', // Revert a previous commit
                'wip', // Work in progress
            ],
        ],
        'subject-case': [0],
    },
};
