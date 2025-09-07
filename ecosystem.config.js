require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'MyLoca-Backoffice-backend',
      script: 'dist/main.js',
      cwd: '/var/www/MyLoca-Backoffice-Backend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      }
    }
  ]
}