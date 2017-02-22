export default (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        Setting.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Setting;
};
