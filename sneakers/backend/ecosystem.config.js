module.exports = {
  apps: [
    {
      name: 'sneakers',
      script: 'index.js',
      watch: 'index.js',
      env: {
        PROD: true,
      },
    },
  ],
};
