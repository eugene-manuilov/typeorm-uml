import { Command } from '@oclif/command';
import * as plantumlEncoder from 'plantuml-encoder';
import { resolve, dirname } from 'path';
import { createConnection, EntityMetadata } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

class TypeormUmlCommand extends Command {

	static description = 'Generates a database UML diagram based on Typeorm entities';

	static args = [
		{
			name: 'ormconfig',
			required: true,
			description: 'Path to Typeorm config file',
		},
	];

	async run(): Promise<any> {
		const { args } = this.parse( TypeormUmlCommand );

		const configPath = resolve( process.cwd(), args.ormconfig );
		process.chdir( dirname( configPath ) );

		const connection = await createConnection( require( configPath ) );

		let uml = `@startuml\n`;

		connection.entityMetadatas.forEach( ( entity: EntityMetadata ) => {
			uml += `\nclass ${ entity.tableNameWithoutPrefix } {\n`;

			entity.columns.forEach( ( column: ColumnMetadata ) => {
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

		process.stdout.write( `http://www.plantuml.com/plantuml/png/${ encodeURIComponent( plantumlEncoder.encode( uml ) ) }\n` );

		connection.close();
	}

}

export = TypeormUmlCommand;
