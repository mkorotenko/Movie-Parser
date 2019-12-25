const PROXY_CONFIG = [
  {
    context: [
      '/docs'
    ],
    target: 'http://localhost:3500',
    secure: false,
    changeOrigin: true
  },
];

module.exports = PROXY_CONFIG;
