import { Direction } from './direction.enum';

export interface SkinParams {
	direction?: Direction,
	roundcorner?: number,
	linetype?: 'ortho' | 'polyline',
	shadowing?: 'true' | 'false',
	handwritten?: 'true' | 'false',
	colors?: Map<string, string>,
}
