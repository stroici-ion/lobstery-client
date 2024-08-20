const getViews = (views: number) => {
  const arr = views.toString().split('');
  let result = '';
  let f = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    result = arr[i] + result;
    f++;
    if (f === 3) {
      result = ' ' + result;
      f = 0;
    }
  }
  return result;
};

export default getViews;
