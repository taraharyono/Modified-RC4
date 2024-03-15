function RC4(plaintext, key) {
    // Inisialisasi S-box
    let sbox = [];
    for (let i = 0; i < 256; i++) {
        sbox[i] = i;
    }

    // Key-Scheduling Algorithm (KSA)
    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + sbox[i] + key.charCodeAt(i % key.length)) % 256;
        
        // Menggabungkan dengan konsep vigenere (sbox[i] ditambahkan dengan key)
        let keyChar = key.charCodeAt(i % key.length);
        sbox[i] = (sbox[i] + keyChar);

        // Pertukarkan nilai sbox[i] dan sbox[j]
        let temp = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = temp;
    }

    // Pseudo-random generation algorithm (PRGA) and encryption
    let ciphertext = "";
    let i = 0;
    let l = 0;
    for (let k = 0; k < plaintext.length; k++) {
        i = (i + 1) % 256;
        l = (l + sbox[i]) % 256;

        // Pertukarkan nilai sbox[i] dan sbox[l]
        let temp = sbox[i];
        sbox[i] = sbox[l];
        sbox[l] = temp;
        
        // Generate byte ke-k dari aliran
        let t = (sbox[i] + sbox[l]) % 256;
        let keystreamByte = sbox[t];
        ciphertext += String.fromCharCode(keystreamByte ^ plaintext.charCodeAt(k));
    }
    return ciphertext;
}

// Contoh penggunaan
let key = "wiu";
let plaintext = "hilmibaskara";
console.log("Plaintext: " + plaintext);

// Print Cipher Text
let ciphertext = RC4(plaintext, key);
console.log("Ciphertext: " + ciphertext);
let ciphertextBase64 = Buffer.from(ciphertext, 'binary').toString('base64');
console.log("Ciphertext (Base64): " + ciphertextBase64);

// Print plain text balik
let decryptedText = RC4(ciphertext, key);
console.log("Decrypted Text: " + decryptedText);