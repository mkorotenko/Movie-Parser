const PROXY_CONFIG = [
  {
    context: [
      '/docs', '/socket'
    ],
    target: 'http://192.168.1.101:3000',
    secure: false,
    changeOrigin: true
  },
];

module.exports = PROXY_CONFIG;
