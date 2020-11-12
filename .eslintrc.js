exports.env = {
	es2020: true,
	node: true,
	jest: true,
};

exports.parser = '@typescript-eslint/parser';
exports.parserOptions = {
	ecmaVersion: 11,
	sourceType: 'module'
};

exports.extends = [
	'standard',
];

exports.plugins = [
	'@typescript-eslint',
];

exports.rules = {
	'@typescript-eslint/no-unused-vars': [ 'error' ],
	'array-bracket-spacing': [ 'error', 'always' ],
	'comma-dangle': [ 'error', { arrays: 'always-multiline', objects: 'always-multiline' } ],
	'indent': [ 'error', 'tab', { SwitchCase: 1 } ],
	'no-console': 'error',
	'no-tabs': 'off',
	'no-unused-vars': 'off',
	'no-useless-constructor': 'off',
	'padded-blocks': [ 'error', { classes: 'always' } ],
	'semi': [ 'error', 'always' ],
	'space-before-function-paren': [ 'error', { named: 'never' } ],
	'space-in-parens': [ 'error', 'always' ],
	'template-curly-spacing': [ 'error', 'always' ],
};
