const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {}

// create fields/columns, configure naming conventions, pass the current connection instance
Post.init(
    {
        // id column as the primary key set to auto-increment
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // title column = string value
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // String value, validation that the url is a verified link by setting the isURL property to true
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        // user id column - who posted, references = property est the relationship between this post & user
        // user id defined as the foreign key and will be the mathching link
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    // second parameter - configure the metadata
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;