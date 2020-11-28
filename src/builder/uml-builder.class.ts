import { EntityMetadata, Connection } from 'typeorm';
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';

import { Direction, Flags, Format } from '../types';

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
	 */
	public constructor(
		protected readonly connection: Connection,
		protected readonly flags: Flags
	) {}

	/**
	 * Builds database UML and returns it.
	 *
	 * @public
	 * @returns {string} An uml string.
	 */
	public buildUml(): string {
		let uml = '@startuml\n\n';

		if ( this.flags.format === Format.TXT ) {
			uml += '!define pkey(x) x\n';
			uml += '!define fkey(x) x\n';
			uml += '!define column(x) x\n';
		} else {
			uml += '!define pkey(x) <b><color:DarkGoldenRod><&key></color> x</b>\n';
			uml += '!define fkey(x) <color:#AAAAAA><&key></color> x\n';
			uml += '!define column(x) <color:#EFEFEF><&media-record></color> x\n';
		}
		uml += `!define table(x) entity x << (T,${ this.flags.monochrome ? '#FFAAAA' : 'white' }) >>\n\n`;

		uml += 'hide stereotypes\n';
		uml += 'hide methods\n\n';

		const direction = this.flags.direction.toUpperCase();
		if ( direction === Direction.LR ) {
			uml += 'left to right direction\n';
		} else if ( direction === Direction.TB ) {
			uml += 'top to bottom direction\n';
		}

		uml += 'skinparam roundcorner 5\n';
		uml += 'skinparam linetype ortho\n';
		uml += 'skinparam shadowing false\n';
		uml += `skinparam handwritten ${ this.flags.handwritten ? 'true' : 'false' }\n`;
		if ( this.flags.monochrome ) {
			uml += 'skinparam monochrome true\n';
		} else {
			uml += 'skinparam class {\n';
			uml += '    BackgroundColor white\n';
			uml += '    ArrowColor seagreen\n';
			uml += '    BorderColor seagreen\n';
			uml += '}\n';
		}

		const exclude = ( this.flags.exclude || '' ).split( ',' ).filter( ( item ) => item.trim().length );
		const include = ( this.flags.include || '' ).split( ',' ).filter( ( item ) => item.trim().length );

		const connectionMetadataBuilder = new ConnectionMetadataBuilder( this.connection );
		const entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas( this.connection.options.entities || [] );
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

			uml += `\ntable( ${ entity.tableNameWithoutPrefix } ) {\n${
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

		if ( this.flags['with-enum-values'] && ( column as ColumnMetadata ).enum ) {
			return ( column as ColumnMetadata ).enum.join( ', ' );
		}

		return '';
	}

}
