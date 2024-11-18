import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('double precision') 
  latitude: number;

  @Column('double precision') 
  longitude: number;

  @Column('float')
  radius: number;
}
