import { EntityMetadata, Connection } from 'typeorm';
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

import { Flags } from '../types';
import { Styles } from './styles.class';

interface ColumnDataTypeDefaults {
	length?: string,
	width?: number,
	precision?: number,
	scale?: number,
}

export class UmlBuilder {

	/**
	 * Constructor.
	 *
	 * @public
	 * @param {Connection} connection A database connection.
	 * @param {Flags} flags An object with command flags.
	 * @param {Styles} styles Diagram styles.
	 */
	public constructor(
		protected readonly connection: Connection,
		protected readonly flags: Flags,
		protected readonly styles: Styles
	) {}

	/**
	 * Builds database UML and returns it.
	 *
	 * @public
	 * @returns {string} An uml string.
	 */
	public buildUml(): string {
		const connectionMetadataBuilder = new ConnectionMetadataBuilder( this.connection );
		const entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas( this.connection.options.entities || [] );
		if ( !entityMetadatas.length ) {
			throw new Error( 'No entities have been found. Please, check your typeorm config to make sure you have configured it correctly.' );
		}

		let uml = '@startuml\n\n' + this.styles.toString();

		const exclude = ( this.flags.exclude || '' ).split( ',' ).filter( ( item ) => item.trim().length );
		const include = ( this.flags.include || '' ).split( ',' ).filter( ( item ) => item.trim().length );

		let foreignKeys = '';
		for ( let i = 0, len = entityMetadatas.length; i < len; i++ ) {
			const entity = entityMetadatas[i];

			if ( exclude.includes( entity.name ) ) {
				continue;
			}

			if ( include.length && !include.includes( entity.name ) ) {
				continue;
			}

			uml += `\ntable( ${ entity.name }, ${ entity.tableNameWithoutPrefix } ) as ${ entity.tableNameWithoutPrefix } {\n${
				entity.columns.map( this.buildColumn, this ).join( '' )
			}}\n`;

			foreignKeys += this.buildForeignKeys( entity );
		}

		if ( foreignKeys.length > 0 ) {
			uml += `\n${ foreignKeys }\n`;
		}

		uml += '@enduml\n';

		return uml;
	}

	/**
	 * Builds an UML column and returns it.
	 *
	 * @protected
	 * @param {ColumnMetadata} column A column metadata.
	 * @returns {string} An uml column string.
	 */
	protected buildColumn( column: ColumnMetadata ): string {
		let columnName = '';
		let suffix = '';

		if ( column.isPrimary ) {
			columnName = `pkey( ${ column.databaseName } )`;
		} else if ( column.referencedColumn ) {
			suffix += '<<FK>>';
			columnName = `fkey( ${ column.databaseName } )`;
		} else {
			columnName = `column( ${ column.databaseName } )`;
		}

		let length = this.getColumnLength( column );
		const type = this.connection.driver.normalizeType( column );

		if ( !length && this.connection.driver.dataTypeDefaults && this.connection.driver.dataTypeDefaults[type] ) {
			length = this.getColumnLength( ( this.connection.driver.dataTypeDefaults[type] as unknown ) as ColumnDataTypeDefaults );
		}

		if ( length ) {
			length = `(${ length })`;
		}

		return `  ${ columnName }: ${ type.toUpperCase() }${ length } ${ suffix }\n`;
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
		const { columns } = foreignKey;

		const zeroOrMore = '}o';
		const oneOrMore = '}|';

		let relationship = columns.some( ( column ) => !column.isNullable ) ? oneOrMore : zeroOrMore;
		if ( columns.length === 1 && columns[0].relationMetadata.isOneToOne ) {
			relationship = '||';
		}

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

		if ( this.flags['with-enum-values'] && ( column as ColumnMetadata ).enum ) {
			return ( column as ColumnMetadata ).enum.join( ', ' );
		}

		return '';
	}

}
