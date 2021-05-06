module.exports = {
  apps: [
    {
      name: 'http-api',
      script: 'index.js',
      watch: './server',
      node_args: '-r dotenv/config',
      autorestart: true,
      log_file: 'combined.log',
      // combine_logs: true,
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
