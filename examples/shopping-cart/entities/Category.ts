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

import { Product } from './Product';

@Index( 'idx_category_parent', [ 'parentId' ], {} )
@Entity( 'category', { schema: 'shop' } )
export class Category {

	@PrimaryGeneratedColumn( { type: 'bigint', name: 'id' } )
	id: string;

	@Column( 'bigint', { name: 'parentId', nullable: true } )
	parentId: string | null;

	@Column( 'varchar', { name: 'title', length: 75 } )
	title: string;

	@Column( 'varchar', { name: 'metaTitle', nullable: true, length: 100 } )
	metaTitle: string | null;

	@Column( 'varchar', { name: 'slug', length: 100 } )
	slug: string;

	@Column( 'text', { name: 'content', nullable: true } )
	content: string | null;

	@ManyToOne( () => Category, ( category ) => category.categories, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	} )
	@JoinColumn( [ { name: 'parentId', referencedColumnName: 'id' } ] )
	parent: Category;

	@OneToMany( () => Category, ( category ) => category.parent )
	categories: Category[];

	@ManyToMany( () => Product, ( product ) => product.categories )
	@JoinTable( {
		name: 'product_category',
		joinColumns: [ { name: 'categoryId', referencedColumnName: 'id' } ],
		inverseJoinColumns: [ { name: 'productId', referencedColumnName: 'id' } ],
		schema: 'shop',
	} )
	products: Product[];

}
