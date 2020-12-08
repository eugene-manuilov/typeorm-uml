import { Command, flags } from '@oclif/command';

import { TypeormUml } from '../builder';
import { Direction, Format } from '../types';

class TypeormUmlCommand extends Command {

	static description = 'Generates a database UML diagram based on Typeorm entities.';

	static args = [
		{
			name: 'configName',
			required: false,
			description: 'Path to the Typeorm config file.',
			default: 'ormconfig.json',
		},
	];

	static flags = {
		connection: flags.string( {
			char: 'c',
			description: 'The connection name.',
			default: 'default',
		} ),
		direction: flags.enum<Direction>( {
			char: 'D',
			description: 'Arrows directions. TB=top to bottom, LR=left to right.',
			default: Direction.TB,
			options: [ Direction.TB, Direction.LR ],
		} ),
		format: flags.enum<Format>( {
			char: 'f',
			description: 'The diagram file format.',
			default: Format.PNG,
			options: [ Format.PNG, Format.SVG, Format.TXT, Format.PUML ],
		} ),
		monochrome: flags.boolean( {
			description: 'Whether or not to use monochrome colors.',
			default: false,
		} ),
		handwritten: flags.boolean( {
			description: 'Whether or not to use handwritten mode.',
			default: false,
		} ),
		download: flags.string( {
			char: 'd',
			description: 'The filename where to download the diagram.',
		} ),
		exclude: flags.string( {
			char: 'e',
			description: 'Comma-separated list of entities to exclude from the diagram.',
		} ),
		include: flags.string( {
			char: 'i',
			description: 'Comma-separated list of entities to include into the diagram.',
		} ),
		color: flags.string( {
			description: 'Custom colors to use for the diagram.',
			helpLabel: '--color',
			helpValue: 'pkey=#aaa',
			multiple: true,
			parse( color ) {
				return color.split( '=', 2 );
			},
		} ),
		'with-entity-names-only': flags.boolean( {
			description: 'Whether or not to display only entity names and hide database table names.',
			default: false,
		} ),
		'with-table-names-only': flags.boolean( {
			description: 'Whether or not to display only database table names and hide entity names.',
			default: false,
		} ),
		'with-enum-values': flags.boolean( {
			description: 'Whether or not to show possible values for the enum type field.',
			default: false,
		} ),
	};

	/**
	 * Executes this command.
	 *
	 * @async
	 * @public
	 */
	public async run(): Promise<any> {
		try {
			const { args, flags } = this.parse( TypeormUmlCommand );

			const typeormUml = new TypeormUml();
			const colors = new Map<string, string>();

			if ( Array.isArray( flags.color ) ) {
				flags.color.forEach( ( color ) => {
					if ( Array.isArray( color ) && color.length === 2 ) {
						colors.set( color[0], color[1] );
					}
				} );
			}

			typeormUml.build(
				args.configName,
				{
					...flags,
					colors,
					echo: true,
				}
			);
		} catch ( e ) {
			this.error( e.message );
		}
	}

}

export = TypeormUmlCommand;
