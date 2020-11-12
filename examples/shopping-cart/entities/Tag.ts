import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity("tag", { schema: "shop" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "title", length: 75 })
  title: string;

  @Column("varchar", { name: "metaTitle", nullable: true, length: 100 })
  metaTitle: string | null;

  @Column("varchar", { name: "slug", length: 100 })
  slug: string;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
