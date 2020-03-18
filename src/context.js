const context = {
  index: 0,
  map: {},
  options: {
    ignorePrefix: null,
  },
};

module.exports = {
  getContext: () => context,
  setContext: callback => callback(context),
};
