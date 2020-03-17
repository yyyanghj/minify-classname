let map = {};

exports.getMap = () => map;

exports.setMap = _map => {
  map = { ...map, ..._map };
};
