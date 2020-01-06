import { Command, flags } from '@oclif/command';
import * as plantumlEncoder from 'plantuml-encoder';
import { resolve, dirname } from 'path';
import { createConnection, EntityMetadata, Connection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

class TypeormUmlCommand extends Command {

	static description = 'Generates a database UML diagram based on Typeorm entities';

	static args = [
		{
			name: 'ormconfig',
			required: true,
			description: 'Path to Typeorm config file',
		},
	];

	static flags = {
		format: flags.string( {
			char: 'f',
			description: 'The diagram file format.',
			default: 'png',
			options: ['png', 'svg', 'txt'],
		} ),
	};

	/**
	 * Executes this command.
	 * 
	 * @async
	 */
	public async run(): Promise<any> {
		const { args, flags } = this.parse( TypeormUmlCommand );

		const configPath = resolve( process.cwd(), args.ormconfig );
		process.chdir( dirname( configPath ) );

		const url = await this.getUrl( configPath, flags.format );

		// https://github.com/typeorm/typeorm/blob/master/src/schema-builder/RdbmsSchemaBuilder.ts

		process.stdout.write( `${ url }\n` );
	}

	/**
	 * Builds a plantuml URL and returns it.
	 * 
	 * @async
	 * @param {string} configPath A path to Typeorm config file.
	 * @param {string} format A diagram file format.
	 * @returns {string} A plantuml string.
	 */
	private async getUrl( configPath: string, format: string ): Promise<string> {
		const connection = await createConnection( require( configPath ) );
		const uml = this.buildUml( connection );
		const encodedUml = plantumlEncoder.encode( uml );

		connection.close();

		return `http://www.plantuml.com/plantuml/${ encodeURIComponent( format ) }/${ encodeURIComponent( encodedUml ) }`;
	}

	/**
	 * Builds database uml and returns it.
	 * 
	 * @param {Connection} connection A database connection.
	 * @returns {string} An uml string.
	 */
	private buildUml( connection: Connection ): string {
		let uml = `@startuml\n`;

		for ( let i = 0, len = connection.entityMetadatas.length; i < len; i++ ) {
			uml += this.buildClass( connection.entityMetadatas[i], connection );
		}

		uml += `@enduml\n`;

		return uml;
	}

	/**
	 * Builds an uml class for an entity and returns it.
	 * 
	 * @param {EntityMetadata} entity An entity metadata.
	 * @param {Connection} connection A database connection.
	 * @returns {string} An uml class string.
	 */
	private buildClass( entity: EntityMetadata, connection: Connection ): string {
		let uml = `\nclass ${ entity.tableNameWithoutPrefix } {\n`;

		for ( let i = 0, len = entity.columns.length; i < len; i++ ) {
			uml += this.buildColumn( entity.columns[i], entity, connection );
		}

		uml += `}\n\n`;

		for ( let i = 0, len = entity.foreignKeys.length; i < len; i++ ) {
			uml += this.buildForeignKeys( entity.foreignKeys[i], entity );
		}

		return uml;
	}

	/**
	 * Builds an uml column and returns it.
	 * 
	 * @param {ColumnMetadata} column A column metadata.
	 * @param {EntityMetadata} entity An entity metadata.
	 * @param {Connection} connection A database connection.
	 * @returns {string} An uml column string.
	 */
	private buildColumn( column: ColumnMetadata, entity: EntityMetadata, connection: Connection ): string {
		let prefix = '';
		if ( column.isPrimary ) {
			prefix = '+';
		} else if ( Array.isArray( entity.indices ) && entity.indices.length > 0 ) {
			const index = entity.indices.find( ( idx ) => idx.columns.map( column => column.databaseName ).includes( column.databaseName ) );
			if ( index ) {
				prefix = index.isUnique ? '~' : '#';
			}
		}

		return `    {method} ${ prefix }${ column.databaseName }: ${ connection.driver.normalizeType( column ) }${ column.length ? `(${ column.length })` : '' }\n`;
	}

	/**
	 * Builds am uml connection string and returns it.
	 * 
	 * @param {ForeignKeyMetadata} foreignKey A foreign key metadata.
	 * @param {EntityMetadata} entity An entity metadata.
	 * @returns {string} An uml connection string.
	 */
	private buildForeignKeys( foreignKey: ForeignKeyMetadata, entity: EntityMetadata ): string {
		return `${ entity.tableNameWithoutPrefix } "\*" --> "1" ${ foreignKey.referencedTablePath }\n\n`;
	}

}

export = TypeormUmlCommand;
