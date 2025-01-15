import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'sales_insight', timestamps: true })
export class SalesInsight extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalSales!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  location!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  timePeriod!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  mostSoldProduct!: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt!: Date;
}
