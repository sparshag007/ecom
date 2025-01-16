import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'product_views' })
class ProductView extends Model {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  views!: number;
}

export { ProductView };
