export function getFileExtension(filename: String) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

export function checkIsImageFile(filename: String) {
  var ext = getFileExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      //etc
      return true;
  }
  return false;
}

export function checkIsVideoFile(filename: String) {
  var ext = getFileExtension(filename);
  switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      // etc
      return true;
  }
  return false;
}
