import { Styles } from '../styles.class';

export class MonochromeStyles extends Styles {

	/**
	 * Overrides table styles.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineTable(): IterableIterator<string> {
		yield '!define table(x) entity x << (T,#FFAAAA) >>';
	}

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
