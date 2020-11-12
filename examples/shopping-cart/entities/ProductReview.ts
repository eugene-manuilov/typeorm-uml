import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';

import { Product } from './Product';

@Index( 'idx_review_product', [ 'productId' ], {} )
@Index( 'idx_review_parent', [ 'parentId' ], {} )
@Entity( 'product_review', { schema: 'shop' } )
export class ProductReview {

	@PrimaryGeneratedColumn( { type: 'bigint', name: 'id' } )
	id: string;

	@Column( 'bigint', { name: 'productId' } )
	productId: string;

	@Column( 'bigint', { name: 'parentId', nullable: true } )
	parentId: string | null;

	@Column( 'varchar', { name: 'title', length: 100 } )
	title: string;

	@Column( 'smallint', { name: 'rating', default: () => "'0'" } )
	rating: number;

	@Column( 'tinyint', { name: 'published', width: 1, default: () => "'0'" } )
	published: boolean;

	@Column( 'datetime', { name: 'createdAt' } )
	createdAt: Date;

	@Column( 'datetime', { name: 'publishedAt', nullable: true } )
	publishedAt: Date | null;

	@Column( 'text', { name: 'content', nullable: true } )
	content: string | null;

	@ManyToOne(
		() => ProductReview,
		( productReview ) => productReview.productReviews,
		{ onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
	)
	@JoinColumn( [ { name: 'parentId', referencedColumnName: 'id' } ] )
	parent: ProductReview;

	@OneToMany( () => ProductReview, ( productReview ) => productReview.parent )
	productReviews: ProductReview[];

	@ManyToOne( () => Product, ( product ) => product.productReviews, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	} )
	@JoinColumn( [ { name: 'productId', referencedColumnName: 'id' } ] )
	product: Product;

}
