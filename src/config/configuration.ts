export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  pg: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  kafka: {
    clientId: 'my-app',
    brokers: [process.env.KAFKA],
  },
});
