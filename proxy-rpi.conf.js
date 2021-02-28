const PROXY_CONFIG = [
  {
    context: [
      '/api',
      '/socket.io'
    ],
    target: 'http://192.168.1.200:80',
    secure: false,
    changeOrigin: true
  },
];

module.exports = PROXY_CONFIG;
