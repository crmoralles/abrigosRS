module.exports = {
  apps: [
    {
      name: 'SosRS',
      port: 'PORT_NUMBER',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
