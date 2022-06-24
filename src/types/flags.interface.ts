import { Colors } from './colors.interface';
import { Direction } from './direction.enum';
import { Format } from './format.enum';

export interface Flags {
	colors?: Map<keyof Colors, string>,
	connection?: string,
	direction?: Direction,
	download?: string,
	echo?: boolean,
	exclude?: string,
	format?: Format,
	handwritten?: boolean,
	include?: string,
	monochrome?: boolean,
	['plantuml-url']?: string,
	['with-entity-names-only']?: boolean,
	['with-table-names-only']?: boolean,
	['with-enum-values']?: boolean,
	['omit-columns']?: boolean,
	['omit-generated-pivot-tables']?: boolean
}
