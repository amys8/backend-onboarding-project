import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  itemId: string

  @Column()
  userId: string

  @CreateDateColumn()
  createdAt: Date
}