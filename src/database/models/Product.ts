import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'products' })
class Product extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: false })
  description!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  category!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price!: number;

  @Column({ type: DataType.NUMBER, allowNull: false })
  quantity!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  active!: boolean;
}

export { Product };
