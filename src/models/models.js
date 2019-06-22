import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'postgres',
  },
);

const models = {
  Account: sequelize.import('./Account'),
  VerificationToken: sequelize.import('./VerificationToken'),
  Category: sequelize.import('./Category')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;