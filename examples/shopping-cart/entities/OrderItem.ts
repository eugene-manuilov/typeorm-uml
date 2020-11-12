import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Index("idx_order_item_product", ["productId"], {})
@Index("idx_order_item_order", ["orderId"], {})
@Entity("order_item", { schema: "shop" })
export class OrderItem {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "productId" })
  productId: string;

  @Column("bigint", { name: "orderId" })
  orderId: string;

  @Column("varchar", { name: "sku", length: 100 })
  sku: string;

  @Column("float", { name: "price", precision: 12, default: () => "'0'" })
  price: number;

  @Column("float", { name: "discount", precision: 12, default: () => "'0'" })
  discount: number;

  @Column("smallint", { name: "quantity", default: () => "'0'" })
  quantity: number;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "orderId", referencedColumnName: "id" }])
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "productId", referencedColumnName: "id" }])
  product: Product;
}
