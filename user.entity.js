async function findUserByPhone(phone, shard) {
  try {
    const user = await shard.model('User').findOne({
      where: { phone },
    });

    return user || null;
  } catch (error) {
    throw error;
  }
}

async function createUser(userData, shard) {
  try {
    const newUser = await shard.model('User').create(userData);
    return newUser;
  } catch (error) {
    throw error;
  }
}

module.exports = { findUserByPhone, createUser };
