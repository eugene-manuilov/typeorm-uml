#!/usr/bin/env node

const plantuml = require( 'node-plantuml' );
const fs = require( 'fs' );
const path = require( 'path' );
const { createConnection } = require( 'typeorm' );

( async () => {
	const connection = await createConnection( require( path.resolve( process.cwd(), process.argv[2] ) ) );

	let uml = `@startuml\n`;

	connection.entityMetadatas.forEach( ( entity ) => {
		uml += `\nclass ${ entity.tableNameWithoutPrefix } {\n`;

		if ( entity.comment ) {
			uml += `    ${ entity.comment }\n`;
			uml += `    ==\n`;
		}

		entity.columns.forEach( ( column ) => {
			let prefix = '';
			if ( column.isPrimary ) {
				prefix = '+';
			} else if ( Array.isArray( entity.indices ) && entity.indices.length > 0 ) {
				const index = entity.indices.find( ( idx ) => idx.columns.map( column => column.databaseName ).includes( column.databaseName ) );
				if ( index ) {
					prefix = index.isUnique ? '~' : '#';
				}
			}

			uml += `    {method} ${ prefix }${ column.databaseName }: ${ connection.driver.normalizeType( column ) }${ column.length ? `(${ column.length })` : '' }\n`;
		} );

		uml += `}\n\n`;

		entity.foreignKeys.forEach( ( foreignKey ) => {
			uml += `${ entity.tableNameWithoutPrefix } "\*" --> "1" ${ foreignKey.referencedTablePath }\n\n`;
		} );
	} );

	uml += `@enduml\n`;

	// https://github.com/typeorm/typeorm/blob/master/src/schema-builder/RdbmsSchemaBuilder.ts

	const format = 'png';

	plantuml.encode( uml, {}, ( err, data ) => {
		console.log( `http://www.plantuml.com/plantuml/${ format }/${ encodeURIComponent( data ) }` );
	} );

	const gen = plantuml.generate( { format } );
	gen.out.pipe(fs.createWriteStream(`output-file.${ format }`));
	gen.in.write( uml, () => {
		gen.in.end();
		connection.close();
	} );
} )();
