import { isAbsolute, resolve, dirname, basename } from 'path';
import { createWriteStream, writeFileSync } from 'fs';
import { get } from 'http';

import { Command, flags } from '@oclif/command';
import * as plantumlEncoder from 'plantuml-encoder';
import { ConnectionOptionsReader, getConnectionManager, Connection } from 'typeorm';

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
			options: [ 'png', 'svg', 'txt', 'puml' ],
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

			const connection = await this.getConnection( args.configName, flags );
			const uml = this.builder.buildUml( connection, flags );
			if ( connection.isConnected ) {
				await connection.close();
			}

			if ( flags.format === 'puml' ) {
				if ( flags.download ) {
					const path = this.getPath( flags.download );
					writeFileSync( path, uml );
				} else {
					process.stdout.write( `${ uml }\n` );
				}
			} else {
				const url = await this.getUrl( uml, flags );
				if ( flags.download ) {
					await this.download( url, flags.download );
				} else {
					process.stdout.write( `${ url }\n` );
				}
			}
		} catch ( e ) {
			this.error( e.message );
		}
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
		let root: string = process.cwd();
		let configName: string = configPath;

		if ( isAbsolute( configName ) ) {
			root = dirname( configName );
			configName = basename( configName );

			process.chdir( root );
		}

		const connectionOptionsReader = new ConnectionOptionsReader( { root, configName } );
		const connectionOptions = await connectionOptionsReader.get( flags.connection );
		return getConnectionManager().create( connectionOptions );
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
		const encodedUml = plantumlEncoder.encode( uml );

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
		return new Promise( ( resolve ) => {
			get( url, ( response ) => {
				response.pipe( createWriteStream( this.getPath( filename ) ) );
				response.on( 'end', resolve );
			} );
		} );
	}

	/**
	 * Get path for file.
	 *
	 * @private
	 * @param {string} filename The output filename.
	 * @returns {string} The resolved full path of file.
	 */
	private getPath( filename: string ): string {
		return !isAbsolute( filename ) ? resolve( process.cwd(), filename ) : filename;
	}

}

export = TypeormUmlCommand;
