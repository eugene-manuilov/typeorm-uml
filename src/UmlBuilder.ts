import { EntityMetadata, Connection } from 'typeorm';
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

import { TypeormUmlCommandFlags } from './TypeormUmlCommandFlags';

interface ColumnDataTypeDefaults {
	length?: string,
	width?: number,
	precision?: number,
	scale?: number,
}

export class UmlBuilder {

	/**
	 * Builds database UML and returns it.
	 *
	 * @public
	 * @param {Connection} connection A database connection.
	 * @param {TypeormUmlCommandFlags} flags An object with command flags.
	 * @returns {string} An uml string.
	 */
	public buildUml( connection: Connection, flags: TypeormUmlCommandFlags ): string {
		let uml = '@startuml\n\n';

		if ( flags.format === 'txt' ) {
			uml += '!define pkey(x) x\n';
		} else {
			uml += '!define pkey(x) <b>x</b>\n';
		}
		uml += '!define table(x) entity x << (T,#FFAAAA) >>\n\n';

		uml += 'hide stereotypes\n';
		uml += 'hide methods\n\n';

		const direction = flags.direction.toUpperCase();
		if ( direction === 'LR' ) {
			uml += 'left to right direction\n';
		} else if ( direction === 'TB' ) {
			uml += 'top to bottom direction\n';
		}

		uml += 'skinparam linetype ortho\n';
		if ( flags.monochrome ) {
			uml += 'skinparam monochrome true\n';
		}

		const exclude = ( flags.exclude || '' ).split( ',' ).filter( ( item ) => item.trim().length );
		const include = ( flags.include || '' ).split( ',' ).filter( ( item ) => item.trim().length );

		const connectionMetadataBuilder = new ConnectionMetadataBuilder( connection );
		const entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas( connection.options.entities || [] );
		if ( !entityMetadatas.length ) {
			throw new Error( 'No entities have been found. Please, check your typeorm config to make sure you have configured it correctly.' );
		}

		let foreignKeys = '';
		for ( let i = 0, len = entityMetadatas.length; i < len; i++ ) {
			const entity = entityMetadatas[i];

			if ( exclude.includes( entity.name ) ) {
				continue;
			}

			if ( include.length && !include.includes( entity.name ) ) {
				continue;
			}

			uml += this.buildClass( entity, connection );
			foreignKeys += this.buildForeignKeys( entity );
		}

		if ( foreignKeys.length > 0 ) {
			uml += `\n${ foreignKeys }\n`;
		}

		uml += '@enduml\n';

		return uml;
	}

	/**
	 * Builds an UML class for an entity and returns it.
	 *
	 * @protected
	 * @param {EntityMetadata} entity An entity metadata.
	 * @param {Connection} connection A database connection.
	 * @returns {string} An uml class string.
	 */
	protected buildClass( entity: EntityMetadata, connection: Connection ): string {
		let uml = `\ntable( ${ entity.tableNameWithoutPrefix } ) {\n`;

		for ( let i = 0, len = entity.columns.length; i < len; i++ ) {
			uml += this.buildColumn( entity.columns[i], entity, connection );
		}

		uml += '}\n';

		return uml;
	}

	/**
	 * Builds an UML column and returns it.
	 *
	 * @protected
	 * @param {ColumnMetadata} column A column metadata.
	 * @param {EntityMetadata} entity An entity metadata.
	 * @param {Connection} connection A database connection.
	 * @returns {string} An uml column string.
	 */
	protected buildColumn( column: ColumnMetadata, entity: EntityMetadata, connection: Connection ): string {
		let columnName = column.databaseName;
		let prefix = '';
		let suffix = '';

		if ( column.isPrimary ) {
			prefix = '+';
			columnName = `pkey( ${ columnName } )`;
		} else if ( Array.isArray( entity.indices ) && entity.indices.length > 0 ) {
			const index = entity.indices.find( ( idx ) => idx.columns.map( column => column.databaseName ).includes( column.databaseName ) );
			if ( index ) {
				prefix = index.isUnique ? '~' : '#';
			}
		}

		if ( column.referencedColumn ) {
			suffix = '<<FK>>';
		}

		let length = this.getColumnLength( column );
		const type = connection.driver.normalizeType( column );

		if ( !length && connection.driver.dataTypeDefaults[type] ) {
			length = this.getColumnLength( ( connection.driver.dataTypeDefaults[type] as unknown ) as ColumnDataTypeDefaults );
		}

		if ( length ) {
			length = `(${ length })`;
		}

		return `  ${ prefix }${ columnName }: ${ type.toUpperCase() }${ length } ${ suffix }\n`;
	}

	/**
	 * Builds UML connection strings and returns it.
	 *
	 * @protected
	 * @param {EntityMetadata} entity An entity metadata.
	 */
	protected buildForeignKeys( entity: EntityMetadata ) {
		let uml = '';

		if ( entity.foreignKeys.length > 0 ) {
			for ( let i = 0, len = entity.foreignKeys.length; i < len; i++ ) {
				uml += this.buildForeignKey( entity.foreignKeys[i], entity );
			}
		}

		return uml;
	}

	/**
	 * Builds an UML connection string and returns it.
	 *
	 * @protected
	 * @param {ForeignKeyMetadata} foreignKey A foreign key metadata.
	 * @param {EntityMetadata} entity An entity metadata.
	 * @returns {string} An uml connection string.
	 */
	protected buildForeignKey( foreignKey: ForeignKeyMetadata, entity: EntityMetadata ): string {
		const zeroOrMore = '}o';
		const oneOrMore = '}|';
		const relationship = foreignKey.columns.some( ( column ) => !column.isNullable ) ? oneOrMore : zeroOrMore;

		return `${ entity.tableNameWithoutPrefix } ${ relationship }--|| ${ foreignKey.referencedTablePath }\n`;
	}

	/**
	 * Returns a column size or default size if not provided.
	 *
	 * @protected
	 * @param {ColumnMetadata | ColumnDataTypeDefaults} column The column instance or data type defaults.
	 * @returns {string} The column size on success, otherwise empty string.
	 */
	protected getColumnLength( column: ColumnMetadata | ColumnDataTypeDefaults ): string {
		if ( column.length ) {
			return column.length;
		}

		if ( column.width ) {
			return column.width.toString();
		}

		if ( column.precision ) {
			if ( column.scale ) {
				return `${ column.precision }, ${ column.scale }`;
			}

			return column.precision.toString();
		}

		return '';
	}

}
