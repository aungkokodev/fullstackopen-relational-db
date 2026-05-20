const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {
  toJSON() {
    const values = { ...this.get() }
    delete values.passwordHash
    delete values.createdAt
    delete values.updatedAt
    return values
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'username must be a valid email',
        },
        notNull: {
          msg: 'username is required',
        },
      },
    },
    passwordHash: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name is required',
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  },
)

module.exports = User
