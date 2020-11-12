import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { CartItem } from "./CartItem";

@Index("idx_cart_user", ["userId"], {})
@Entity("cart", { schema: "shop" })
export class Cart {
	@PrimaryGeneratedColumn({ type: "bigint", name: "id" })
	id: string;

	@Column("bigint", { name: "userId", nullable: true })
	userId: string | null;

	@Column("varchar", { name: "sessionId", length: 100 })
	sessionId: string;

	@Column("varchar", { name: "token", length: 100 })
	token: string;

	@Column("smallint", { name: "status", default: () => "'0'" })
	status: number;

	@Column("varchar", { name: "firstName", nullable: true, length: 50 })
	firstName: string | null;

	@Column("varchar", { name: "middleName", nullable: true, length: 50 })
	middleName: string | null;

	@Column("varchar", { name: "lastName", nullable: true, length: 50 })
	lastName: string | null;

	@Column("varchar", { name: "mobile", nullable: true, length: 15 })
	mobile: string | null;

	@Column("varchar", { name: "email", nullable: true, length: 50 })
	email: string | null;

	@Column("varchar", { name: "line1", nullable: true, length: 50 })
	line1: string | null;

	@Column("varchar", { name: "line2", nullable: true, length: 50 })
	line2: string | null;

	@Column("varchar", { name: "city", nullable: true, length: 50 })
	city: string | null;

	@Column("varchar", { name: "province", nullable: true, length: 50 })
	province: string | null;

	@Column("varchar", { name: "country", nullable: true, length: 50 })
	country: string | null;

	@Column("datetime", { name: "createdAt" })
	createdAt: Date;

	@Column("datetime", { name: "updatedAt", nullable: true })
	updatedAt: Date | null;

	@Column("text", { name: "content", nullable: true })
	content: string | null;

	@ManyToOne(() => User, (user) => user.carts, {
		onDelete: "RESTRICT",
		onUpdate: "RESTRICT",
	})
	@JoinColumn([{ name: "userId", referencedColumnName: "id" }])
	user: User;

	@OneToMany(() => CartItem, (cartItem) => cartItem.cart)
	cartItems: CartItem[];
}
