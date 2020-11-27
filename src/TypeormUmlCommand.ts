import { Command, flags } from '@oclif/command';
import { Connection } from 'typeorm';
import { runCli, getConnection, getUrl, download, getPath } from './TypeormUml';

import { TypeormUmlCommandFlags } from './TypeormUmlCommandFlags';

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
		direction: flags.string( {
			char: 'D',
			description: 'Arrows directions. TB=top to bottom, LR=left to right.',
			default: 'TB',
		} ),
		format: flags.string( {
			char: 'f',
			description: 'The diagram file format.',
			default: 'png',
			options: [ 'png', 'svg', 'txt', 'puml' ],
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
		const { args, flags } = this.parse( TypeormUmlCommand );
		await runCli.call( this, args.configName, flags );
	}

	/**
	 * Creates and returns Typeorm connection based on selected configuration file.
	 *
	 * @async
	 * @private
	 * @param {string} configPath A path to Typeorm config file.
	 * @param {TypeormUmlCommandFlags} flags An object with command flags.
	 * @returns {Connection} A connection instance.
	 */
	private async getConnection( configPath: string, flags: TypeormUmlCommandFlags ): Promise<Connection> {
		return getConnection( configPath, flags );
	}

	/**
	 * Builds a plantuml URL and returns it.
	 *
	 * @async
	 * @private
	 * @param {string} uml The UML diagram.
	 * @param {TypeormUmlCommandFlags} flags An object with command flags.
	 * @returns {string} A plantuml string.
	 */
	private async getUrl( uml: string, flags: TypeormUmlCommandFlags ): Promise<string> {
		return getUrl( uml, flags );
	}

	/**
	 * Downloads image into a file.
	 *
	 * @private
	 * @param {string} url The URL to download.
	 * @param {string} filename The output filename.
	 * @returns {Promise} A promise object.
	 */
	private download( url: string, filename: string ): Promise<void> {
		return download( url, filename );
	}

	/**
	 * Get path for file.
	 *
	 * @private
	 * @param {string} filename The output filename.
	 * @returns {string} The resolved full path of file.
	 */
	private getPath( filename: string ): string {
		return getPath( filename );
	}

}

export = TypeormUmlCommand;
