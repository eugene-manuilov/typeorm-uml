import { Styles } from '../styles.class';

export class MonochromeStyles extends Styles {

	/**
	 * Overrides class colors.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineColors(): IterableIterator<string> {
		yield 'skinparam monochrome true';
	}

}
