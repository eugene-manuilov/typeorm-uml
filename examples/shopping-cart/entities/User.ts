import {
	Column,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';

import { Cart } from './Cart';
import { Order } from './Order';
import { Product } from './Product';
import { Transaction } from './Transaction';

export enum UserRole {
	ADMIN = "admin",
	EDITOR = "editor",
	GHOST = "ghost"
}

@Index( 'uq_mobile', [ 'mobile' ], { unique: true } )
@Index( 'uq_email', [ 'email' ], { unique: true } )
@Entity( 'user', { schema: 'shop' } )
export class User {

	@PrimaryGeneratedColumn( { type: 'bigint', name: 'id' } )
	id: string;

	@Column({
		type: "enum",
		enum: UserRole,
		default: UserRole.GHOST
	})
	role: UserRole

	@Column( 'varchar', { name: 'firstName', nullable: true, length: 50 } )
	firstName: string | null;

	@Column( 'varchar', { name: 'middleName', nullable: true, length: 50 } )
	middleName: string | null;

	@Column( 'varchar', { name: 'lastName', nullable: true, length: 50 } )
	lastName: string | null;

	@Column( 'varchar', {
		name: 'mobile',
		nullable: true,
		unique: true,
		length: 15,
	} )
	mobile: string | null;

	@Column( 'varchar', {
		name: 'email',
		nullable: true,
		unique: true,
		length: 50,
	} )
	email: string | null;

	@Column( 'varchar', { name: 'passwordHash', length: 32 } )
	passwordHash: string;

	@Column( 'tinyint', { name: 'admin', width: 1, default: () => "'0'" } )
	admin: boolean;

	@Column( 'tinyint', { name: 'vendor', width: 1, default: () => "'0'" } )
	vendor: boolean;

	@Column( 'datetime', { name: 'registeredAt' } )
	registeredAt: Date;

	@Column( 'datetime', { name: 'lastLogin', nullable: true } )
	lastLogin: Date | null;

	@Column( 'tinytext', { name: 'intro', nullable: true } )
	intro: string | null;

	@Column( 'text', { name: 'profile', nullable: true } )
	profile: string | null;

	@OneToMany( () => Cart, ( cart ) => cart.user )
	carts: Cart[];

	@OneToMany( () => Order, ( order ) => order.user )
	orders: Order[];

	@OneToMany( () => Product, ( product ) => product.user )
	products: Product[];

	@OneToMany( () => Transaction, ( transaction ) => transaction.user )
	transactions: Transaction[];

}
