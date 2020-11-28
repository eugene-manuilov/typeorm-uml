import { isAbsolute, resolve, dirname, basename } from 'path';
import { createWriteStream, writeFileSync } from 'fs';
import { get } from 'http';

import * as plantumlEncoder from 'plantuml-encoder';
import { ConnectionOptionsReader, getConnectionManager, Connection } from 'typeorm';

import { Flags, Format } from '../types';
import { UmlBuilder } from './uml-builder.class';

export class TypeormUml {

	/**
	 * Builds UML diagram.
	 *
	 * @async
	 * @public
	 * @param {string} configName The typeorm config filename or path to it.
	 * @param {Flags} flags Build flags.
	 * @returns {string} Diagram URL or UML code depending on selected format.
	 */
	public async build( configName: string, flags: Flags ) : Promise<string> {
		const connection = await this.getConnection( configName, flags );

		const builder = new UmlBuilder( connection, flags );
		const uml = builder.buildUml();

		if ( connection.isConnected ) {
			await connection.close();
		}

		if ( flags.format === Format.PUML ) {
			if ( flags.download ) {
				const path = this.getPath( flags.download );
				writeFileSync( path, uml );
			} else if ( flags.echo ) {
				process.stdout.write( `${ uml }\n` );
			}

			return uml;
		}

		const url = this.getUrl( uml, flags );
		if ( flags.download ) {
			await this.download( url, flags.download );
		} else if ( flags.echo ) {
			process.stdout.write( `${ url }\n` );
		}

		return url;
	}

	/**
	 * Creates and returns Typeorm connection based on selected configuration file.
	 *
	 * @async
	 * @private
	 * @param {string} configPath A path to Typeorm config file.
	 * @param {Flags} flags An object with command flags.
	 * @returns {Connection} A connection instance.
	 */
	private async getConnection( configPath: string, flags: Flags ): Promise<Connection> {
		let root = process.cwd();
		let configName = configPath;

		if ( isAbsolute( configName ) ) {
			root = dirname( configName );
			configName = basename( configName );
		}

		const cwd = dirname( resolve( root, configName ) );
		process.chdir( cwd );

		const connectionOptionsReader = new ConnectionOptionsReader( { root, configName } );
		const connectionOptions = await connectionOptionsReader.get( flags.connection || 'default' );
		return getConnectionManager().create( connectionOptions );
	}

	/**
	 * Builds a plantuml URL and returns it.
	 *
	 * @private
	 * @param {string} uml The UML diagram.
	 * @param {Flags} flags An object with command flags.
	 * @returns {string} A plantuml string.
	 */
	private getUrl( uml: string, flags: Flags ): string {
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
