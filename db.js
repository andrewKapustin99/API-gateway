const { Sequelize, DataTypes } = require("sequelize");

const shard1 = new Sequelize(
  "postgres://postgres:Napoleon1703@db_shard_1:5432/test_shard_1",
  {
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
const shard2 = new Sequelize(
  "postgres://postgres:Napoleon1703@db_shard_2:5433/test_shard_2",
  {
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
const shard3 = new Sequelize(
  "postgres://postgres:Napoleon1703@db_shard_3:5434/test_shard_3",
  {
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const shard4 = new Sequelize(
  "postgres://postgres:Napoleon1703@db_shard_4:5435/test_shard_4",
  {
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const shard5 = new Sequelize(
  "postgres://postgres:Napoleon1703@db_shard_5:5436/test_shard_5",
  {
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const shards = { shard1, shard2, shard3, shard4, shard5 };

function selectShard(userId) {
  const shardIndex = userId % 5;
  switch (shardIndex) {
    case 0:
      return shards.shard1;
    case 1:
      return shards.shard2;
    case 2:
      return shards.shard3;
    case 3:
      return shards.shard4;
    case 4:
      return shards.shard5;
    default:
      return shards.shard1;
  }
}

Object.values(shards).forEach((shard) => {
  const Attachment = shard.define(
    'attachment',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },
    message_id: {
      type: DataTypes.INTEGER,
    },

    user_id: {
      type: DataTypes.UUID,
    },

    file_id: {
      type: DataTypes.UUID,
    },
    originalFilePath: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    encupsFile: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
  )

  const User = shard.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,

        defaultValue: DataTypes.UUIDV4,
      },

      phone: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
      },

      discription: {
        type: DataTypes.STRING,
        allowNull: true,

        defaultValue: "",
      },

      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      second_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false,

        defaultValue: "",
      },

      notificationToken: {
        type: DataTypes.STRING,
        allowNull: false,

        defaultValue: "",
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,

        defaultValue: 0,
      },

      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      messages_count: {
        type: DataTypes.INTEGER,
        allowNull: false,

        defaultValue: 0,
      },

      login: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },

      hash: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },

      secret_key: {
        type: DataTypes.BLOB,
        allowNull: true,
      },

      vox: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      vox_pwd: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  const Contact = shard.define(
    "Contact",
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      contact_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,

        defaultValue: 0,
      },
      user_alias: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  const Encrypt = shard.define(
    "Encrypt",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      key: {
        type: DataTypes.BLOB,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      timestamps: false,
    }
  );

  const File = shard.define(
    "File",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,

        defaultValue: DataTypes.UUIDV4,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      originalFilePath: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      encupsFile: {
        type: DataTypes.STRING(256),
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  const PersonalMessage = shard.define(
    "PersonalMessage",
    {
      message_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      contact_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,

        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  const UserMessage = shard.define(
    "UserMessage",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,

        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.UUID,
      },

      text: {
        type: DataTypes.STRING(10000),
        allowNull: true,
      },
      forwardMessage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      answerMessage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      replaces: {
        type: DataTypes.INTEGER,

        defaultValue: 0,
      },

      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,

        defaultValue: false,
      },

      send: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      shared_secret: {
        type: DataTypes.BLOB,
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      timestamps: false,
    }
  );

  const UserReadMessageMtm = shard.define(
    "UserReadMessageMtm",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,

        autoIncrement: true,
      },
      message_id: {
        type: DataTypes.INTEGER,
      },
      author_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reader_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  User.hasMany(Contact, { foreignKey: "user_id", as: "Contacts" });
  Encrypt.belongsTo(User, { foreignKey: "user_id" });
  User.hasOne(Encrypt, { foreignKey: "user_id" });

  Attachment.belongsTo(UserMessage, { foreignKey: 'message_id' });
  UserMessage.hasMany(Attachment, { foreignKey: 'message_id' });

  UserMessage.belongsTo(User, { foreignKey: "user_id" });
  UserReadMessageMtm.belongsTo(UserMessage, { foreignKey: "message_id" });
  UserMessage.hasMany(UserReadMessageMtm, { foreignKey: "message_id" });
  UserReadMessageMtm.belongsTo(User, { foreignKey: "author_id" });
  UserReadMessageMtm.belongsTo(User, { foreignKey: "reader_id" });

  PersonalMessage.belongsTo(User, { foreignKey: "user_id", as: "user" });
  PersonalMessage.belongsTo(User, { foreignKey: "contact_id", as: "contact" });
  PersonalMessage.belongsTo(UserMessage, {
    foreignKey: "message_id",
    as: "userMessage",
  });

  UserMessage.belongsTo(UserMessage, {
    foreignKey: "forwardMessage",
    as: "ForwardedMessage",
  });
  UserMessage.belongsTo(UserMessage, {
    foreignKey: "answerMessage",
    as: "AnsweredMessage",
  });
});

module.exports = { shards, selectShard };