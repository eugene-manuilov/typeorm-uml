import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';

import { User } from './User';
import { OrderItem } from './OrderItem';
import { Transaction } from './Transaction';

@Index( 'idx_order_user', [ 'userId' ], {} )
@Entity( 'order', { schema: 'shop' } )
export class Order {

	@PrimaryGeneratedColumn( { type: 'bigint', name: 'id' } )
	id: string;

	@Column( 'bigint', { name: 'userId', nullable: true } )
	userId: string | null;

	@Column( 'varchar', { name: 'sessionId', length: 100 } )
	sessionId: string;

	@Column( 'varchar', { name: 'token', length: 100 } )
	token: string;

	@Column( 'smallint', { name: 'status', default: () => "'0'" } )
	status: number;

	@Column( 'float', { name: 'subTotal', precision: 12, default: () => "'0'" } )
	subTotal: number;

	@Column( 'float', {
		name: 'itemDiscount',
		precision: 12,
		default: () => "'0'",
	} )
	itemDiscount: number;

	@Column( 'float', { name: 'tax', precision: 12, default: () => "'0'" } )
	tax: number;

	@Column( 'float', { name: 'shipping', precision: 12, default: () => "'0'" } )
	shipping: number;

	@Column( 'float', { name: 'total', precision: 12, default: () => "'0'" } )
	total: number;

	@Column( 'varchar', { name: 'promo', nullable: true, length: 50 } )
	promo: string | null;

	@Column( 'float', { name: 'discount', precision: 12, default: () => "'0'" } )
	discount: number;

	@Column( 'float', { name: 'grandTotal', precision: 12, default: () => "'0'" } )
	grandTotal: number;

	@Column( 'varchar', { name: 'firstName', nullable: true, length: 50 } )
	firstName: string | null;

	@Column( 'varchar', { name: 'middleName', nullable: true, length: 50 } )
	middleName: string | null;

	@Column( 'varchar', { name: 'lastName', nullable: true, length: 50 } )
	lastName: string | null;

	@Column( 'varchar', { name: 'mobile', nullable: true, length: 15 } )
	mobile: string | null;

	@Column( 'varchar', { name: 'email', nullable: true, length: 50 } )
	email: string | null;

	@Column( 'varchar', { name: 'line1', nullable: true, length: 50 } )
	line1: string | null;

	@Column( 'varchar', { name: 'line2', nullable: true, length: 50 } )
	line2: string | null;

	@Column( 'varchar', { name: 'city', nullable: true, length: 50 } )
	city: string | null;

	@Column( 'varchar', { name: 'province', nullable: true, length: 50 } )
	province: string | null;

	@Column( 'varchar', { name: 'country', nullable: true, length: 50 } )
	country: string | null;

	@Column( 'datetime', { name: 'createdAt' } )
	createdAt: Date;

	@Column( 'datetime', { name: 'updatedAt', nullable: true } )
	updatedAt: Date | null;

	@Column( 'text', { name: 'content', nullable: true } )
	content: string | null;

	@ManyToOne( () => User, ( user ) => user.orders, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	} )
	@JoinColumn( [ { name: 'userId', referencedColumnName: 'id' } ] )
	user: User;

	@OneToMany( () => OrderItem, ( orderItem ) => orderItem.order )
	orderItems: OrderItem[];

	@OneToMany( () => Transaction, ( transaction ) => transaction.order )
	transactions: Transaction[];

}
