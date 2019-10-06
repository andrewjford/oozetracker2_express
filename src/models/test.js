module.exports = {
  apps : [{
    name: 'cashtracker_API',
    script: 'dist/server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      SECRET_KEY: 'kkB/9JrO3kDA8gZqmArbEPXjr5pn/xSsC3FvecRT+wkpKgMi41hGFpY4K8Kvruq38RZ4z3hJRfk9UYTS5U3WAuX0WeiUcImEmAI2wCaniTPweNX+ZPtGqI/EH9JrBbbtCiZFfpVWk6ie$
      EMAIL_VERIFICATION_TOKEN: '95e944bfd09cdcfea297e9a4248350630d3afffe16d44daa6ff7dde9dc344d31cab4bf249ae4763b70c7eb60d02f48656d35460e81317c18dc1e7d390659c5$
      SENDGRID_API_KEY: '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',
      HOST_URL: 'https://cashtracker.club',
      DATABASE_URL: 'postgres://admin2:howard@localhost:5432/cashtracker'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'admin2',
      host : '45.79.227.61',
      ref  : 'origin/master',
      repo : 'git@github.com:andrewjford/oozetracker2_express.git',
      path : '/home/admin2/oozetracker2',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production && pm2 save'
    }
  }
};