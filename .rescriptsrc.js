module.exports = [
	[
		'use-babel-config',
		{
			presets: [
				'@babel/preset-env',
				'@babel/preset-react',
				'@babel/preset-typescript',
			],
			plugins: [
				'@babel/plugin-proposal-class-properties',
				[
					'babel-plugin-module-resolver',
					{
						root: '.',
						alias: {
							'@lib': './src/lib',
						},
					},
				],
			],
		},
	]
];
