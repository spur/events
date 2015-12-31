function getPath(element) {
  var path = [];
  while (element !== null) {
    path.push(element);
    element = element.parentElement;
  }
  return path;
}

module.exports = {
  getPath: getPath
};
