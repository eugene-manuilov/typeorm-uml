import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";

@Index("uq_product_meta", ["productId", "key"], { unique: true })
@Index("idx_meta_product", ["productId"], {})
@Entity("product_meta", { schema: "shop" })
export class ProductMeta {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("bigint", { name: "productId" })
  productId: string;

  @Column("varchar", { name: "key", length: 50 })
  key: string;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @ManyToOne(() => Product, (product) => product.productMetas, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "productId", referencedColumnName: "id" }])
  product: Product;
}
