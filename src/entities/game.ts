import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  result!: string;

  @Column('int')
  background!: number;

  @Column('int')
  showcase!: number;
}
