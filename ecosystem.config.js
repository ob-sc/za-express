module.exports = {
  apps: [
    {
      name: 'http-api',
      script: './dist/index.js',
      node_args: '-r dotenv/config',
      autorestart: true,
      log_file: 'logs/combined.log',
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
