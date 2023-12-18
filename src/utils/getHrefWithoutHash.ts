export const getHrefWithoutHash = () => {
  let url = window.location.href;
  let hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
};
