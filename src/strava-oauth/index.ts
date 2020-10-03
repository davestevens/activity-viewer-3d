// Performs Strava OAuth process

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REQUIRED_SCOPE = process.env.REQUIRED_SCOPE;
const REDIRECT_URI = window.location.href;

const AUTH_URI = `http://www.strava.com/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=${REQUIRED_SCOPE}`;

(function () {
  const urlParams = new URLSearchParams(window.location.search);

  if (!urlParams.has("state")) {
    window.location.href = AUTH_URI;
    return;
  }

  if (urlParams.has("error")) {
    window.opener.postMessage({
      type: "AUTH",
      error: true,
      data: urlParams.get("error"),
    });
    return;
  }

  if (urlParams.get("scope") !== REQUIRED_SCOPE) {
    window.opener.postMessage({
      type: "AUTH",
      error: true,
      data: "Missing scope",
    });
    return;
  }

  fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: urlParams.get("code"),
      grant_type: "authorization_code",
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network error");
      }
    })
    .then((response) => {
      window.opener.postMessage({ type: "AUTH", error: false, data: response });
    })
    .catch((error) => {
      window.opener.postMessage({ type: "AUTH", error: false, data: error });
    });
})();

export default null;
