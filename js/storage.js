const STORAGE_TOKEN = "AHO2E39FRH33P41ZEWL8BLT0RUW60XKH95IOQW2K";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 *
 * @param {saving selceted key in to the remote Storage} key
 * @param {is the value of key} value
 * @returns
 * The function "setItem" is an asynchronous function that takes a key and a value as parameters.
 * It creates a payload object with the provided key, value, and a token.
 * Then, it uses the fetch function to send a POST request to a specified storage URL, sending the payload as JSON in the request body.
 * Finally, it returns the response from the request as a JSON object.
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * @param {getting Array with the key name} key
 * @returns
 * The "getItem" function asynchronously fetches a value for a given key by calling an API endpoint.
 * It constructs a URL containing the key and a token to access the storage.
 * The expected response is a JSON object, and if the "data" property exists, it extracts and returns the associated value.
 * Otherwise, it throws an error message indicating that the data with the specified key could not be found.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      // Verbesserter code
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}