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
		'with-enum-values': flags.boolean( {
			description: 'Show possible values for enum type field.',
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

			typeormUml.build(
				args.configName,
				{
					...flags,
					echo: true,
				}
			);
		} catch ( e ) {
			this.error( e.message );
		}
	}

}

export = TypeormUmlCommand;
