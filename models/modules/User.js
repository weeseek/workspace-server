const { DataTypes} = require('sequelize');
const { sequelize } = require('../../config/db')

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        validate: {
            isUrl: true
        }
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
        defaultValue: null
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        defaultValue: null,
        validate: {
            isNumeric: true
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        allowNull: false,
        defaultValue: 'active'
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    timestamps: true
});

module.exports = User;
