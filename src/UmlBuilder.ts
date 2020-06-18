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
	 * Builds database uml and returns it.
	 *
	 * @public
	 * @param {Connection} connection A database connection.
	 * @param {TypeormUmlCommandFlags} flags An object with command flags.
	 * @returns {string} An uml string.
	 */
	public buildUml( connection: Connection, flags: TypeormUmlCommandFlags ): string {
		let uml = `@startuml\n\n`;

		uml += `!define table(x) class x << (T,#FFAAAA) >>\n`;
		if ( flags.format === 'txt' ) {
			uml += `!define pkey(x) x\n`;
		} else {
			uml += `!define pkey(x) <b>x</b>\n`;
		}

		uml += `hide stereotypes\n`;
		uml += `hide fields\n\n`;

		if ( flags.monochrome ) {
			uml += `skinparam monochrome true\n\n`;
		}

		const exclude = ( flags.exclude || '' ).split( ',' ).filter( ( item ) => item.trim().length );
		const include = ( flags.include || '' ).split( ',' ).filter( ( item ) => item.trim().length );

		const connectionMetadataBuilder = new ConnectionMetadataBuilder( connection );
		const entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas( connection.options.entities || [] );

		for ( let i = 0, len = entityMetadatas.length; i < len; i++ ) {
			const entity = entityMetadatas[i];

			if ( exclude.includes( entity.name ) ) {
				continue;
			}

			if ( include.length && ! include.includes( entity.name ) ) {
				continue;
			}
			
			uml += this.buildClass( entity, connection );
		}

		uml += `@enduml\n`;

		return uml;
	}

	/**
	 * Builds an uml class for an entity and returns it.
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

		uml += `}\n\n`;

		for ( let i = 0, len = entity.foreignKeys.length; i < len; i++ ) {
			uml += this.buildForeignKeys( entity.foreignKeys[i], entity );
		}

		return uml;
	}

	/**
	 * Builds an uml column and returns it.
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

		if ( column.isPrimary ) {
			prefix = '+';
			columnName = `pkey( ${ columnName } )`;
		} else if ( Array.isArray( entity.indices ) && entity.indices.length > 0 ) {
			const index = entity.indices.find( ( idx ) => idx.columns.map( column => column.databaseName ).includes( column.databaseName ) );
			if ( index ) {
				prefix = index.isUnique ? '~' : '#';
			}
		}

		let length = this.getColumnLength( column );
		const type = connection.driver.normalizeType( column );

		if ( ! length && connection.driver.dataTypeDefaults[type] ) {
			length = this.getColumnLength( ( connection.driver.dataTypeDefaults[type] as unknown ) as ColumnDataTypeDefaults );
		}

		if ( length ) {
			length = `(${ length })`;
		}

		return `\t{method} ${ prefix }${ columnName }: ${ type.toUpperCase() }${ length }\n`;
	}

	/**
	 * Builds am uml connection string and returns it.
	 *
	 * @protected
	 * @param {ForeignKeyMetadata} foreignKey A foreign key metadata.
	 * @param {EntityMetadata} entity An entity metadata.
	 * @returns {string} An uml connection string.
	 */
	protected buildForeignKeys( foreignKey: ForeignKeyMetadata, entity: EntityMetadata ): string {
		return `${ entity.tableNameWithoutPrefix } "\*" --> "1" ${ foreignKey.referencedTablePath }\n\n`;
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
