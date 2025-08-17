module.exports = (sequelize, DataTypes) => {
  const Mahal = sequelize.define("Mahal", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // 👈 Match your Users model/table name
        key: "id"
      },
      onDelete: "CASCADE"
    }
  }, {
    tableName: 'mahals',
    timestamps: true, // includes createdAt and updatedAt
    underscored: true
  });

  return Mahal;
};
