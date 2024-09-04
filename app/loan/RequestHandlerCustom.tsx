import refreshToken from "./RefreshToken";

const requestHandlerCustom = async ({
  subUrl,
  method,
  token,
  navigateToLogin,
  body = null,
}: {
  subUrl: string;
  method: string;
  token: string;
  navigateToLogin: () => void;
  body?: any;
}) => {
  let response: any = await requestFetchWithRetry(
    subUrl,
    method,
    token,
    navigateToLogin,
    body
  );
  if (response.statusCode === 401) {
    const newToken: any = await refreshToken(navigateToLogin);
    if (newToken) {
      response = await requestFetchWithRetry(
        subUrl,
        method,
        newToken,
        navigateToLogin,
        body
      );
    } else {
      return { data: null, statusCode: 401 };
    }
  }
  return response;
};

const requestFetchWithRetry = async (
  subUrl: string,
  method: string,
  token: string,
  navigateToLogin: any,
  body?: any
) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(subUrl, options);
    const statusCode = res.status;
    const data = await res.json();
    return { data, statusCode };
  } catch (error) {
    return { data: null, statusCode: 500 };
  }
};
export default requestHandlerCustom;
