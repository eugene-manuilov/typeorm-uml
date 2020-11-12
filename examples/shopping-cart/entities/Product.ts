import {
	Column,
	Entity,
	Index,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';

import { CartItem } from './CartItem';
import { OrderItem } from './OrderItem';
import { User } from './User';
import { Category } from './Category';
import { ProductMeta } from './ProductMeta';
import { ProductReview } from './ProductReview';
import { Tag } from './Tag';

@Index( 'uq_slug', [ 'slug' ], { unique: true } )
@Index( 'idx_product_user', [ 'userId' ], {} )
@Entity( 'product', { schema: 'shop' } )
export class Product {

	@PrimaryGeneratedColumn( { type: 'bigint', name: 'id' } )
	id: string;

	@Column( 'bigint', { name: 'userId' } )
	userId: string;

	@Column( 'varchar', { name: 'title', length: 75 } )
	title: string;

	@Column( 'varchar', { name: 'metaTitle', nullable: true, length: 100 } )
	metaTitle: string | null;

	@Column( 'varchar', { name: 'slug', unique: true, length: 100 } )
	slug: string;

	@Column( 'tinytext', { name: 'summary', nullable: true } )
	summary: string | null;

	@Column( 'smallint', { name: 'type', default: () => "'0'" } )
	type: number;

	@Column( 'varchar', { name: 'sku', length: 100 } )
	sku: string;

	@Column( 'float', { name: 'price', precision: 12, default: () => "'0'" } )
	price: number;

	@Column( 'float', { name: 'discount', precision: 12, default: () => "'0'" } )
	discount: number;

	@Column( 'smallint', { name: 'quantity', default: () => "'0'" } )
	quantity: number;

	@Column( 'tinyint', { name: 'shop', width: 1, default: () => "'0'" } )
	shop: boolean;

	@Column( 'datetime', { name: 'createdAt' } )
	createdAt: Date;

	@Column( 'datetime', { name: 'updatedAt', nullable: true } )
	updatedAt: Date | null;

	@Column( 'datetime', { name: 'publishedAt', nullable: true } )
	publishedAt: Date | null;

	@Column( 'datetime', { name: 'startsAt', nullable: true } )
	startsAt: Date | null;

	@Column( 'datetime', { name: 'endsAt', nullable: true } )
	endsAt: Date | null;

	@Column( 'text', { name: 'content', nullable: true } )
	content: string | null;

	@OneToMany( () => CartItem, ( cartItem ) => cartItem.product )
	cartItems: CartItem[];

	@OneToMany( () => OrderItem, ( orderItem ) => orderItem.product )
	orderItems: OrderItem[];

	@ManyToOne( () => User, ( user ) => user.products, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	} )
	@JoinColumn( [ { name: 'userId', referencedColumnName: 'id' } ] )
	user: User;

	@ManyToMany( () => Category, ( category ) => category.products )
	categories: Category[];

	@OneToMany( () => ProductMeta, ( productMeta ) => productMeta.product )
	productMetas: ProductMeta[];

	@OneToMany( () => ProductReview, ( productReview ) => productReview.product )
	productReviews: ProductReview[];

	@ManyToMany( () => Tag, ( tag ) => tag.products )
	@JoinTable( {
		name: 'product_tag',
		joinColumns: [ { name: 'productId', referencedColumnName: 'id' } ],
		inverseJoinColumns: [ { name: 'tagId', referencedColumnName: 'id' } ],
		schema: 'shop',
	} )
	tags: Tag[];

}
