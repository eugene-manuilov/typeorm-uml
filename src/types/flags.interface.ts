import { Direction } from './direction.enum';
import { Format } from './format.enum';

export interface Flags {
	connection?: string,
	direction?: Direction,
	download?: string,
	echo?: boolean,
	exclude?: string,
	format?: Format,
	handwritten?: boolean,
	include?: string,
	monochrome?: boolean,
	['with-entity-names-only']?: boolean,
	['with-table-names-only']?: boolean,
	['with-enum-values']?: boolean,
	colors?: Map<string, string>,
}
