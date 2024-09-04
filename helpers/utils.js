export function getCoreUrl() {
  return process.env.NEXT_PUBLIC_API_URL;
}

export function getGlobalVariables() {
  return {
    gStorage: {
      read: (key) => JSON.parse(localStorage.getItem(key)),
    },
  };
}
