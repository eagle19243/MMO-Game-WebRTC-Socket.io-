export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: DataTypes.STRING,
    username: DataTypes.STRING,
    displayName: DataTypes.STRING,
    provider: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Setting);
      }
    }
  });
  return User;
};
