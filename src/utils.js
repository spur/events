function getPath(element) {
  var path = [];
  while (element !== null) {
    path.push(element);
    element = element.parentNode;
  }

  if (element !== window) {
  	path.push(window);
  }
  return path;
}

module.exports = {
  getPath: getPath
};
