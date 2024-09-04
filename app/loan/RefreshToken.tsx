const refreshToken = async (navigateToLogin: () => void) => {
  try {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      console.warn("No refresh token found, redirecting to login.");
      navigateToLogin();
      return null;
    }

    const response = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      const { accessToken, refreshToken: newRefreshToken } = data;

      // Save new tokens to localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      console.log("Token successfully refreshed.");
      return accessToken;
    } else {
      console.error(`Failed to refresh token, status code: ${response.status}`);
      navigateToLogin();
      return null;
    }
  } catch (error) {
    console.error("Failed to refresh token due to error:", error);
    navigateToLogin();
    return null;
  }
};

export default refreshToken;
