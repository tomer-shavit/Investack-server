import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import Crypto from "./Crypto";
import Stock from "./Stock";
import Transaction from "./Transaction";

@Entity()
@ObjectType()
class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  userId: number;

  @Field(() => [Stock])
  @Column("simple-array", { default: [] })
  @OneToMany(() => Stock, (stock: Stock) => stock.portfolio, { cascade: true })
  stocks: Stock[];

  @Field(() => [Crypto])
  @Column("simple-array", { default: [] })
  @OneToMany(() => Crypto, (crypto) => crypto.portfolio, { cascade: true })
  crypto: Crypto[];

  @Field(() => [Transaction])
  @Column("simple-array", { default: [] })
  @OneToMany(
    () => Transaction,
    (transaction: Transaction) => transaction.portfolio
  )
  transactions: Transaction[];

  @OneToOne(() => User, (user) => user.portfolio, {
    onDelete: "CASCADE",
  })
  @Field(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ default: 0, type: "real" })
  @Field(() => Number)
  stocksValue: string;

  @Column({ default: 0, type: "real" })
  @Field(() => Number)
  cryptoValue: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: Date;
}

export default Portfolio;
