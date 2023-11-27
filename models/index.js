import { DataTypes } from "sequelize"

const models = async (sequelize)=>{
    const Comment = sequelize.define('Comment', {
        userName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        attachedFile: {
          type: DataTypes.BLOB,
          allowNull: true,
      },
      })
      Comment.hasMany(Comment, {as: 'replies', foreignKey: "parentId"})

      const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
      })

      await sequelize.sync()
}


export default models