import { isAbsolute, resolve, dirname, basename } from 'path';
import { createWriteStream, writeFileSync } from 'fs';
import { get } from 'http';

import * as plantumlEncoder from 'plantuml-encoder';
import { ConnectionOptionsReader, getConnectionManager, Connection, ConnectionOptions } from 'typeorm';

import { Flags, Format, SkinParams } from '../types';
import { UmlBuilder } from './uml-builder.class';
import { Styles } from './styles.class';
import { MonochromeStyles, TextStyles } from './styles';

export class TypeormUml {

	/**
	 * Builds UML diagram.
	 *
	 * @async
	 * @public
	 * @param {string|Connection} configNameOrConnection The typeorm config filename or connection instance.
	 * @param {Flags} flags Build flags.
	 * @returns {string} Diagram URL or UML code depending on selected format.
	 */
	public async build( configNameOrConnection: string | Connection, flags: Flags ) : Promise<string> {
		const styles = this.getStyles( flags );
		const connection: Connection = typeof configNameOrConnection === 'string'
			? await this.getConnection( configNameOrConnection, flags )
			: configNameOrConnection;

		const builder = new UmlBuilder( connection, flags, styles );
		const uml = await builder.buildUml();

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

	private manageSchema( rawconnectionOptions: ConnectionOptions, flags: Flags ): ConnectionOptions {
		if ( 'schema' in rawconnectionOptions && rawconnectionOptions.schema && flags['ignore-schema'] ) {
			return {
				...rawconnectionOptions,
				schema: '',
			};
		} else {
			return rawconnectionOptions;
		}
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
		const rawconnectionOptions = await connectionOptionsReader.get( flags.connection || 'default' );
		const connectionOptions = this.manageSchema( rawconnectionOptions, flags );
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
		const plantumlUrl = flags['plantuml-url'] || 'http://www.plantuml.com/plantuml';

		return `${ plantumlUrl.replace( /\/$/, '' ) }/${ format }/${ schema }`;
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

	/**
	 * Returns styles for the diagram.
	 *
	 * @private
	 * @param {Flags} flags The current flags to use.
	 * @returns {Styles} An instance of the Styles class.
	 */
	private getStyles( flags: Flags ): Styles {
		const args: SkinParams = {
			direction: flags.direction,
			handwritten: flags.handwritten ? 'true' : 'false',
			colors: flags.colors,
			entityNamesOnly: flags['with-entity-names-only'],
			tableNamesOnly: flags['with-table-names-only'],
		};

		if ( flags.monochrome ) {
			return new MonochromeStyles( args );
		}

		if ( flags.format === Format.TXT ) {
			return new TextStyles( args );
		}

		return new Styles( args );
	}

}
