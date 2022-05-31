module.exports = (sequelize, Sequelize) => {
  const Contact = sequelize.define('contacts', {
    userId: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    }
  })
    return Contact;
}
