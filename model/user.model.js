module.exports = (sequelize, Sequelize) => {
  const User= sequelize.define('user', {

    name: {
      type: Sequelize.STRING
    },
    hash: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
      email: {
        type: Sequelize.STRING
      },
      role: {
          type: Sequelize.STRING
      }
  })
    return User;
}
