module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reports", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      url: {  
        type: Sequelize.STRING,
        allowNull: false,
      },
      performanceScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seoScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      accessibilityScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bestPracticesScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recommendations: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Reports");
  },
};
