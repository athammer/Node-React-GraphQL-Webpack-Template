module.exports = {
  apps : [{
    name: 'server',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    autorestart: true,
    watch: true,
    ignore_watch : ["./node_modules", "./log-combined.log", "./log-error.log", "./log-exceptions.log"],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
