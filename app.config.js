module.exports = ({ config }) => ({
  ...config,
  web: { ...config.web, output: 'single' },
  experiments: {
    ...config.experiments,
    ...(process.env.GITHUB_PAGES === 'true' ? { baseUrl: '/drift' } : {}),
  },
});
