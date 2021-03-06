function Services() {
  let token = "pene";
  function Auth() {
    const { POST } = Fetch();
    return {
      signIn: async (username, password) => {
        try {
          const res = await POST(
            "auth/login",
            { username, password },
            { auth: false }
          );
          if (res.success) {
            token = res.body.user.token;
          }
          return res;
        } catch (e) {
          console.error("could not sign in", e);
        }
      },
      register: async (username, password) => {
        try {
          const res = await POST(
            "auth/signup",
            { username, password },
            { auth: false }
          );
          if (res.success) {
            token = res.body.user.token;
          }
          return res;
        } catch (e) {
          console.error("could not register");
        }
      },
    };
  }
  function Fetch() {
    return {
      GET: async (url, params, options = { auth: true }) => {
        const headers = {
          "Content-Type": "application/json",
        };
        if (options.auth) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/${
            options.auth ? "api/" : ""
          }${url}/${queryParams(params)}`,
          {
            method: "GET",
            headers,
          }
        );
        return await parseResponse(res);
      },
      POST: async (url, body, options = { auth: true }) => {
        const headers = {
          "Content-Type": "application/json",
        };
        if (options.auth) {
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/${
            options.auth ? "api/" : ""
          }${url}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          }
        );
        return await parseResponse(res);
      },
    };
  }
  return {
    Auth,
    Fetch,
  };
}

function queryParams(params) {
  if (params) {
    return Object.keys(params).reduce(
      (accum, curr) => `${accum}&${curr}=${params[curr].toString()}`,
      "?"
    );
  } else {
    return "";
  }
}

const services = new Services();

module.exports.useAuth = services.Auth;
module.exports.useFetch = services.Fetch;

async function parseResponse(res) {
  const json = await res.json();
  if (res.ok) {
    return {
      success: true,
      body: json.data,
    };
  } else {
    return {
      success: false,
      errors: json.errors,
    };
  }
}
