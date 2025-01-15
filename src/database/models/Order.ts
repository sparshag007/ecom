import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'orders' })
class Order extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: false })
  userId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: false })
  productId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: false })
  quantity!: number;

  @Column({ type: DataType.FLOAT, allowNull: false, unique: false })
  totalPrice!: number;

  @Column({
    type: DataType.ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'), // Allowed values
    allowNull: false,
    defaultValue: 'Pending', // Default status
  })
  status!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  location!: string;
}

export { Order };
