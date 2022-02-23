const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
    // static keyword to indicate upvote method is one based on the Post Model not an instance method
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user.id,
            post_id: body.post_id
        })
        .then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

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
        // timestamps: false = do not timestamp attributes(updated_at, created_at)
        // timestamps: true = will timestamp attributes updated_at and created_at
        // freezeTableName true = system will not default to plural table name
        freezeTableName: true,
        // underscored - system will automatically camelCase names 
        // true = will use underscores if entered that way
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;