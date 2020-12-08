import { Direction } from './direction.enum';

export interface SkinParams {
	colors?: Map<string, string>,
	direction?: Direction,
	entityNamesOnly?: boolean,
	handwritten?: 'true' | 'false',
	linetype?: 'ortho' | 'polyline',
	roundcorner?: number,
	shadowing?: 'true' | 'false',
	tableNamesOnly?: boolean,
}
