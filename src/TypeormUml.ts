import { isAbsolute, resolve, dirname, basename } from 'path';
import { createWriteStream, writeFileSync } from 'fs';
import { get } from 'http';

import { Command } from '@oclif/command';
import * as plantumlEncoder from 'plantuml-encoder';
import { ConnectionOptionsReader, getConnectionManager, Connection } from 'typeorm';

import { UmlBuilder } from './UmlBuilder';
import { TypeormUmlCommandFlags } from './TypeormUmlCommandFlags';

/**
* Executes this command.
*
* @async
* @param {string} configPath A path to Typeorm config file.
* @param {TypeormUmlCommandFlags} flags An object with command flags.
* @public
*/
export async function runCli( this: Command | void, configPath: string, flags: TypeormUmlCommandFlags ) {
	let inCliContext: boolean;
	if ( this ) {
		inCliContext = Boolean( this.error );
	}

	try {
		const connection = await getConnection( configPath, flags );

		const builder = new UmlBuilder( connection, flags );
		const uml = builder.buildUml();

		if ( connection.isConnected ) {
			await connection.close();
		}

		if ( flags.format === 'puml' ) {
			if ( flags.download ) {
				const path = getPath( flags.download );
				writeFileSync( path, uml );
			} else if ( inCliContext ) {
				process.stdout.write( `${ uml }\n` );
			} else {
				return uml;
			}
		} else {
			const url = await getUrl( uml, flags );
			if ( flags.download ) {
				await download( url, flags.download );
			} else if ( inCliContext ) {
				process.stdout.write( `${ url }\n` );
			} else {
				return url;
			}
		}
	} catch ( e ) {
		if ( this && inCliContext ) this.error( e.message );
		// eslint-disable-next-line no-console
		else console.error( e.message );
	}
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
export async function getUrl( uml: string, flags: TypeormUmlCommandFlags ): Promise<string> {
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
export function download( url: string, filename: string ): Promise<void> {
	return new Promise( ( resolve ) => {
		get( url, ( response ) => {
			response.pipe( createWriteStream( getPath( filename ) ) );
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
export function getPath( filename: string ): string {
	return !isAbsolute( filename ) ? resolve( process.cwd(), filename ) : filename;
}

export async function getConnection( configPath: string, flags: TypeormUmlCommandFlags ): Promise<Connection> {
	let root = process.cwd();
	let configName = configPath;

	if ( isAbsolute( configName ) ) {
		root = dirname( configName );
		configName = basename( configName );
	}

	const cwd = dirname( resolve( root, configName ) );
	process.chdir( cwd );

	const connectionOptionsReader = new ConnectionOptionsReader( { root, configName } );
	const connectionOptions = await connectionOptionsReader.get( flags.connection );
	return getConnectionManager().create( connectionOptions );
}
