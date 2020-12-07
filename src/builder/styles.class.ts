import { Direction, SkinParams } from '../types';

export class Styles {

	/**
	 * Joins styles and returns as a single string.
	 *
	 * @static
	 * @protected
	 * @param {IterableIterator<string>} iterator Styles iterator.
	 * @returns {string} Styles string.
	 */
	protected static glueStyles( iterator: IterableIterator<string> ): string {
		return Array.from( iterator )
			.map( ( line ) => line + '\n' )
			.join( '' );
	}

	/**
	 * Constructor.
	 *
	 * @public
	 * @param {SkinParams} skinParams Skin parameters.
	 */
	public constructor( protected readonly skinParams: SkinParams ) {}

	/**
	 * Defines table styles.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineTable(): IterableIterator<string> {
		yield '!define table(x) entity x << (T,white) >>';
	}

	/**
	 * Defines column styles.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineColumns(): IterableIterator<string> {
		yield '!define pkey(x) <b><color:DarkGoldenRod><&key></color> x</b>';
		yield '!define fkey(x) <color:#AAAAAA><&key></color> x';
		yield '!define column(x) <color:#EFEFEF><&media-record></color> x';
	}

	/**
	 * Defines general skin params.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineSkinParams(): IterableIterator<string> {
		yield `skinparam roundcorner ${ this.skinParams.roundcorner || 5 }`;
		yield `skinparam linetype ${ this.skinParams.linetype || 'ortho' }`;
		yield `skinparam shadowing ${ this.skinParams.shadowing || 'false' }`;
		yield `skinparam handwritten ${ this.skinParams.handwritten || 'false' }`;
	}

	/**
	 * Defines class colors.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineColors(): IterableIterator<string> {
		yield 'skinparam class {';
		yield '    BackgroundColor white';
		yield '    ArrowColor seagreen';
		yield '    BorderColor seagreen';
		yield '}';
	}

	/**
	 * Defines the diagram direction.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * defineDirection(): IterableIterator<string> {
		if ( this.skinParams.direction === Direction.LR ) {
			yield 'left to right direction';
		} else if ( this.skinParams.direction === Direction.TB ) {
			yield 'top to bottom direction';
		}
	}

	/**
	 * Hides elements not needed on the diagram.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	protected * hideNotNeededUI(): IterableIterator<string> {
		yield 'hide stereotypes';
		yield 'hide methods';
	}

	/**
	 * Composes all styles and yields it.
	 *
	 * @generator
	 * @protected
	 * @returns {IterableIterator<string>} Styles iterator.
	 */
	public * print(): IterableIterator<string> {
		yield Styles.glueStyles( this.defineTable() );
		yield Styles.glueStyles( this.defineColumns() );

		yield Styles.glueStyles( this.hideNotNeededUI() );

		yield Styles.glueStyles( this.defineDirection() );
		yield Styles.glueStyles( this.defineSkinParams() );
		yield Styles.glueStyles( this.defineColors() );
	}

	/**
	 * Returns all styles as a single string.
	 *
	 * @public
	 * @returns {string} All styles.
	 */
	public toString(): string {
		return Styles.glueStyles( this.print() );
	}

}
