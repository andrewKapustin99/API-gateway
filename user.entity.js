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


async function addMessageToPersonalChat(
  contactId,
  forwardMessage,
  answerMessageId,
  attachments,
  text,
  user_id
) {
  try {
    console.log('addMessageToPersonalChat START !!!!!!!!!!!!');
    const user = await shard.model('User').findByPk(user_id);

    console.log("My USER !!!!!!!!!!!!!!!!!!", user);

    if (!user) {
      throw { code: 403, message: 'Пользователь не был найден' };
    }

    const encryptKey = await shard.model('Encrypt').findOne({
      where: { user_id: user_id },
      attributes: ['key'],
    });

    let answerMessage = null;

    const findUser = await shard.model('User').findByPk(user_id, {
      attributes: ['id', 'phone'],
    });

    const userMessage = await shard.model('UserMessage').create({
      user_id: user_id,
      text,
      forwardMessage,
      answerMessage: answerMessageId,
      // shared_secret: encryptKey.key,
      shared_secret: "encryptKey.key",
    });

    let attachmentsData;

    if (attachments !== null && attachments.length !== 0) {
      for (const { id } of attachments) {
        const file = await File.findOne({
          where: { id },
        });

        await shard.model('Attachment').create({
          message_id: userMessage.id,
          user_id: user_id,
          file_id: id,
          originalFilePath: file.originalFilePath,
          encupsFile: file.encupsFile,
        });
      }

      attachmentsData = await shard.model('File').findAll({
        where: { id: attachments.map(attach => attach.id) },
        attributes: ['id', 'type', 'name', 'originalFilePath', 'encupsFile'],
      });
    }

    await shard.model('PersonalMessage').create({
      message_id: userMessage.id,
      user_id: user_id,
      contact_id: contactId,
    });
    return {
      users: [{ id: contactId }, { id: user.id }],
      data: {
        user_id: user_id,
        chat_id: contactId,
        is_personal: true,
        message: {
          message_id: userMessage.id,
          text: userMessage.text,
          time: userMessage.send,
          forwardMessage: userMessage.forwardMessage,
          answerMessage,
          phone: findUser.dataValues.phone,

          attachments: attachmentsData
            ? attachmentsData
                .map(a => {
                  return {
                    file_id: a.id,
                    type: findFileType(a.type),
                    name: a.name,
                    originalFilePath: a.originalFilePath,
                    encupsFile: a.encupsFile,
                  };
                })
                .reverse()
            : null,
        },
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  } catch (error) {
    console.log(error);
    throw { status: 500, message: error };
  }
}

module.exports = { findUserByPhone, createUser, addMessageToPersonalChat };
