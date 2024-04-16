/**
 * Encrypt the payload
 */
async function encryptPayload(foo, bar) {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("jwk", key);

  console.log("exportedKey: ", exportedKey);

  const encoded = encodePayload(foo, bar);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypt = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );

  return exportedKey.k + btoa(encrypt);
}

/**
 * Encode the payload
 */
function encodePayload(foo, bar) {
  const enc = new TextEncoder();
  const message = { foo: foo, bar: bar };

  const jsonString = JSON.stringify(message);
  const encodedMessage = enc.encode(jsonString);

  return encodedMessage.buffer;
}

encryptPayload(foo, bar)
  .then((result) => {
    this.wsBot.payload = result;
  })
  .catch((error) => {
    console.error("Error:", error);
    throw error;
  });
