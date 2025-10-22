// ---------- Transposition Cipher ----------
function transpositionEncrypt(text, key) {
  const numCols = key.length;
  const numRows = Math.ceil(text.length / numCols);
  const grid = Array.from({ length: numRows }, () => Array(numCols).fill(''));

  let index = 0;
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (index < text.length) {
        grid[r][c] = text[index++];
      }
    }
  }

  const keyOrder = key.split('').map((ch, i) => ({ ch, i }))
    .sort((a, b) => a.ch.localeCompare(b.ch));

  let cipher = '';
  for (const { i } of keyOrder) {
    for (let r = 0; r < numRows; r++) {
      cipher += grid[r][i] || '';
    }
  }
  return cipher;
}

function transpositionDecrypt(cipher, key) {
  const numCols = key.length;
  const numRows = Math.ceil(cipher.length / numCols);
  const grid = Array.from({ length: numRows }, () => Array(numCols).fill(''));

  const keyOrder = key.split('').map((ch, i) => ({ ch, i }))
    .sort((a, b) => a.ch.localeCompare(b.ch));

  let index = 0;
  for (const { i } of keyOrder) {
    for (let r = 0; r < numRows; r++) {
      if (index < cipher.length) {
        grid[r][i] = cipher[index++];
      }
    }
  }

  return grid.flat().join('');
}

// ---------- Caesar Cipher ----------

// Encrypt function
function caesarEncrypt(text, shift) {
  // Ensure shift is a number
  shift = parseInt(shift, 10);

  let result = "";

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (/[A-Z]/.test(c)) {
      // Uppercase letter (A=65)
      result += String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
    } 
    else if (/[a-z]/.test(c)) {
      // Lowercase letter (a=97)
      result += String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97);
    } 
    else {
      // Non-letters (spaces, punctuation) stay the same
      result += c;
    }
  }

  return result;
}

// Decrypt function
function caesarDecrypt(cipher, shift) {
  return caesarEncrypt(cipher, (26 - shift) % 26);
}

// ---------- Vigenère Cipher ----------
function vigenereEncrypt(text, key) {
  key = key.toUpperCase();
  let result = '';
  let keyIndex = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (/[A-Za-z]/.test(c)) {
      const shift = key.charCodeAt(keyIndex % key.length) - 65;
      const base = c === c.toUpperCase() ? 65 : 97;
      result += String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
      keyIndex++;
    } else {
      result += c;
    }
  }
  return result;
}

function vigenereDecrypt(cipher, key) {
  key = key.toUpperCase();
  let result = '';
  let keyIndex = 0;
  for (let i = 0; i < cipher.length; i++) {
    const c = cipher[i];
    if (/[A-Za-z]/.test(c)) {
      const shift = key.charCodeAt(keyIndex % key.length) - 65;
      const base = c === c.toUpperCase() ? 65 : 97;
      result += String.fromCharCode(((c.charCodeAt(0) - base - shift + 26) % 26) + base);
      keyIndex++;
    } else {
      result += c;
    }
  }
  return result;
}

// ---------- Button Handlers ----------
document.getElementById("encryptBtn").addEventListener("click", () => {
  const text = document.getElementById("plainText").value;
  const algo = document.getElementById("algorithm").value;
  const key = document.getElementById("keyInput").value;

  if (!text) return alert("Please enter text!");
  if (!algo) return alert("Please select an algorithm!");
  if (!key && (algo !== "transposition")) return alert("Please enter a key!");

  let result = "";
  if (algo === "transposition") result = transpositionEncrypt(text, key || "KEY");
  else if (algo === "Ceaser") result = caesarEncrypt(text, key);
  else if (algo === "vigenere") result = vigenereEncrypt(text, key);

  document.getElementById("cipherText").value = result;
});

document.getElementById("decryptBtn").addEventListener("click", () => {
  const text = document.getElementById("cipherText").value;
  const algo = document.getElementById("algorithm").value;
  const key = document.getElementById("keyInput").value;

  if (!text) return alert("Please enter ciphertext!");
  if (!algo) return alert("Please select an algorithm!");
  if (!key && (algo !== "transposition")) return alert("Please enter a key!");

  let result = "";
  if (algo === "transposition") result = transpositionDecrypt(text, key || "KEY");
  else if (algo === "Ceaser") result = caesarDecrypt(text, key);
  else if (algo === "vigenere") result = vigenereDecrypt(text, key);

  document.getElementById("cipherText").value = result;
});

// Copy Text
document.getElementById("copyBtn").addEventListener("click", () => {
  const text = document.getElementById("cipherText").value;
  if (!text) return alert("Nothing to copy!");
  navigator.clipboard.writeText(text);
  alert("Text copied to clipboard!");
});
