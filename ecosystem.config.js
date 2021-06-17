module.exports = {
  apps: [
    {
      name: 'http-api',
      script: './dist/index.js',
      node_args: '-r dotenv/config',
      autorestart: true,
      error_file: 'logs/http-error.log',
      out_file: 'logs/http-out.log',
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
