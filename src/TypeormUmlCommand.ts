import { isAbsolute, resolve } from 'path';
import { createWriteStream } from 'fs';
import { get } from 'http';

import { Command, flags } from '@oclif/command';
import * as plantumlEncoder from 'plantuml-encoder';
import { createConnection, ConnectionOptionsReader } from 'typeorm';

import { UmlBuilder } from './UmlBuilder';
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
		format: flags.string( {
			char: 'f',
			description: 'The diagram file format.',
			default: 'png',
			options: ['png', 'svg', 'txt'],
		} ),
		monochrome: flags.boolean( {
			description: 'Whether or not to use monochrome colors.',
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
	};

	protected readonly builder = new UmlBuilder();

	/**
	 * Executes this command.
	 * 
	 * @async
	 * @public
	 */
	public async run(): Promise<any> {
		try {
			const { args, flags } = this.parse( TypeormUmlCommand );
			const url = await this.getUrl( args.configName, flags );
			if ( flags.download ) {
				await this.download( url, flags.download );
			} else {
				process.stdout.write( `${ url }\n` );
			}
		} catch ( e ) {
			this.error( e.message );
		}
	}

	/**
	 * Builds a plantuml URL and returns it.
	 *
	 * @async
	 * @private
	 * @param {string} configName A path to Typeorm config file.
	 * @param {TypeormUmlCommandFlags} flags An object with command flags.
	 * @returns {string} A plantuml string.
	 */
	private async getUrl( configName: string, flags: TypeormUmlCommandFlags ): Promise<string> {
		const connectionOptionsReader = new ConnectionOptionsReader( {
			root: process.cwd(),
			configName,
		} );

		const connectionOptions = await connectionOptionsReader.get( flags.connection );
		const connection = await createConnection( connectionOptions );

		const uml = this.builder.buildUml( connection, flags );
		const encodedUml = plantumlEncoder.encode( uml );

		connection.close();

		const format = encodeURIComponent( flags.format );
		const schema = encodeURIComponent( encodedUml );

		return `http://www.plantuml.com/plantuml/${ format }/${ schema }`;
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
		const path = ! isAbsolute( filename ) ? resolve( process.cwd(), filename ) : filename;

		return new Promise( ( resolve ) => {
			get( url, ( response ) => {
				response.pipe( createWriteStream( path ) );
				response.on( 'end', resolve );
			} );
		} );
	}

}

export = TypeormUmlCommand;
