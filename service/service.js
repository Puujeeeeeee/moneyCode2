export async function getService(url, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch("https://gateway.invescore.mn/api/", options);
  return response.json();
}
