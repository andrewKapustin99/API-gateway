const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function signToken(id, phone, hash, secret, expiresIn) {
    return jwt.sign({ id, phone, hash }, secret, { expiresIn });
}

// Обновленные функции
async function findUserByPhone(phone, shard) {
    return shard.model('User').findOne({ where: { phone } });
}

async function createUser(userData, shard) {
    return shard.model('User').create(userData);
}

// Измененная функция регистрации
async function registerWithoutDescript(data, shard) {
    const { phone, hash } = data;

    try {
        const isPhoneUsed = await findUserByPhone(phone, shard);
        if (isPhoneUsed) {
            throw new Error('Пользователь с таким номером телефона уже существует');
        }
        const hashedPassword = await bcrypt.hash(hash, 2);
        const newUser = await createUser({ ...data, hash: hashedPassword }, shard);

        const token = await signToken(newUser.id, phone, hash, process.env.SECRET_KEY, '7d');
        const refreshToken = await signToken(newUser.id, phone, hash, process.env.REFRESH_SECRET_KEY, '30d');

        return { status: 200, message: {...newUser.toJSON(), token, refreshToken } };
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerWithoutDescript };
