import { Colors } from './colors.interface';
import { Direction } from './direction.enum';

export interface SkinParams {
	colors?: Map<keyof Colors, string>,
	direction?: Direction,
	entityNamesOnly?: boolean,
	handwritten?: 'true' | 'false',
	linetype?: 'ortho' | 'polyline',
	roundcorner?: number,
	shadowing?: 'true' | 'false',
	tableNamesOnly?: boolean,
	omitColumns?: boolean,
}
