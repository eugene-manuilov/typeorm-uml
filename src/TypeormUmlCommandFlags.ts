export interface TypeormUmlCommandFlags {
	format?: string,
	monochrome?: boolean,
	handwritten?: boolean,
	connection?: string,
	direction?: string,
	include?: string,
	exclude?: string,
	['with-enum-values']?: boolean,
}
