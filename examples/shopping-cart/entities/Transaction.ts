import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';

import { Order } from './Order';
import { User } from './User';

@Index( 'idx_transaction_user', [ 'userId' ], {} )
@Index( 'idx_transaction_order', [ 'orderId' ], {} )
@Entity( 'transaction', { schema: 'shop' } )
export class Transaction {

	@PrimaryGeneratedColumn( { type: 'bigint', name: 'id' } )
	id: string;

	@Column( 'bigint', { name: 'userId' } )
	userId: string;

	@Column( 'bigint', { name: 'orderId' } )
	orderId: string;

	@Column( 'varchar', { name: 'code', length: 100 } )
	code: string;

	@Column( 'smallint', { name: 'type', default: () => "'0'" } )
	type: number;

	@Column( 'smallint', { name: 'mode', default: () => "'0'" } )
	mode: number;

	@Column( 'smallint', { name: 'status', default: () => "'0'" } )
	status: number;

	@Column( 'datetime', { name: 'createdAt' } )
	createdAt: Date;

	@Column( 'datetime', { name: 'updatedAt', nullable: true } )
	updatedAt: Date | null;

	@Column( 'text', { name: 'content', nullable: true } )
	content: string | null;

	@ManyToOne( () => Order, ( order ) => order.transactions, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	} )
	@JoinColumn( [ { name: 'orderId', referencedColumnName: 'id' } ] )
	order: Order;

	@ManyToOne( () => User, ( user ) => user.transactions, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT',
	} )
	@JoinColumn( [ { name: 'userId', referencedColumnName: 'id' } ] )
	user: User;

}
