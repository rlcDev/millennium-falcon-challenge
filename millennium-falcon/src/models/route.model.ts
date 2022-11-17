import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Route extends Model {
  @Column
  origin: string;

  @Column
  destination: string;

  @Column
  travel_time: number;
}
