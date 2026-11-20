import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
  firstname: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'users', underscored: true });

export const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  useInMenu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'categories', underscored: true });

export const Product = sequelize.define('Product', {
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  useInMenu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  description: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  priceWithDiscount: { type: DataTypes.FLOAT, allowNull: false },
}, { tableName: 'products', underscored: true });

export const ProductImage = sequelize.define('ProductImage', {
  enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  path: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'product_images', underscored: true });

export const ProductOption = sequelize.define('ProductOption', {
  title: { type: DataTypes.STRING, allowNull: false },
  shape: { type: DataTypes.STRING, allowNull: false, defaultValue: 'square', validate: { isIn: [['square', 'circle']] } },
  radius: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'text', validate: { isIn: [['text', 'color']] } },
  values: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'product_options', underscored: true });

Category.belongsToMany(Product, { through: 'product_categories', foreignKey: 'category_id', otherKey: 'product_id' });
Product.belongsToMany(Category, { through: 'product_categories', foreignKey: 'product_id', otherKey: 'category_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id' });
