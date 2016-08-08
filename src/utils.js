function getPath(element) {
  var path = [];
  while (element !== null) {
    path.push(element);
    element = element.host || element.parentNode || null;
  }

  if (element !== window) {
  	path.push(window);
  }
  return path;
}

module.exports = {
  getPath: getPath
};
