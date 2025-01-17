import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  name: string

  @Column()
  description: string

  @Column({ type: 'float' })
  price: number

  @CreateDateColumn()
  createdAt: Date
}