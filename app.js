async function sha256(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

function normalizedEmail() {
    const rawEmailSplit = $("#inputEmail").val().trim().split("@")
    const host = rawEmailSplit[1].trim().toLowerCase()

    let username = rawEmailSplit[0]
        .trim()
        .toLowerCase()
        .replaceAll(".", "")

    const plusIndex = username.indexOf('+')

    if (plusIndex >= 0) {
        username = username.substring(0, plusIndex)
    }

    return username.concat('@', host)
}

function calculateHash(email, salt) {
    sha256(email.concat(salt)).then((digestHex) => $("#hashOutput").val(digestHex));
}

function validEmail(email) {
    return email.trim() !== "" && email.indexOf('@') >= 0
}

$(".user-input").on("input", function () {
    const email = $("#inputEmail").val().trim()

    if (!validEmail(email)) {
        $("#hashOutput").val("")
        $("#emailOutput").val("")
    } else {
        const normEmail = normalizedEmail()
        $("#emailOutput").val(normEmail)
        calculateHash(normEmail, $("#inputSalt").val().trim())
    }
});

