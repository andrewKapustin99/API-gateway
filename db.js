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
  shard.define(
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
});

module.exports = { shards, selectShard };

