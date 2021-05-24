const get = async (url) => {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(url, requestOptions);
  return await response.json();
};

export { get };
