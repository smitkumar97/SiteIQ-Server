module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reports", "aiRecommendations", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Reports", "aiRecommendations");
  },
};
