const regEx = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d");
function jsonDateReviver(key, value) {
  if (regEx.test(value)) {
    return new Date(value);
  }
  return value;
}

export default async function GraphQLFetch(
  query,
  variables = {},
  showError = null
) {
  try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === "BAD_USER_INPUT") {
        const details = error.extensions.exception.errors.join("\n");
        if (showError) showError(`${error.message}: \n ${details}`);
      } else if (showError) {
        showError(`${error.extensions.code}:${error.message}`);
      }
    }
    return result.data;
  } catch (error) {
    if (showError)
      showError(`Error in sending data to server :${error.message}`);
    return null;
  }
}
