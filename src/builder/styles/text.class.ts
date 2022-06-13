import { Styles } from '../styles.class';

export class TextStyles extends Styles {

	/**
	 * Defines column styles.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineColumns(): IterableIterator<string> {
		yield '!define pkey(x) x';
		yield '!define fkey(x) x';
		yield '!define column(x) x';
		yield '!define rcolumn(x) x';
	}

	/**
	 * Disables class colors.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineColors(): IterableIterator<string> {
		// don't define colors
	}

	/**
	 * Disables skin params.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineSkinParams(): IterableIterator<string> {
		// don't define skin params
	}

}
