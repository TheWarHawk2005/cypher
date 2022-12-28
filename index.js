const outputEncryptedString = function() {
	let input = document.getElementById('plaintextMessage').value
	document.getElementById('encryptedOutput').innerHTML = encrypt(input)
}

const outputDecryptedString = function() {
	let input = document.getElementById('codeMessage').value
	document.getElementById('decryptedOutput').innerHTML = decrypt(input)
}

var key
const updateKey = function() {
	let passcode = document.getElementById('passcode').value
	key = cyrb53(passcode).toString()
	console.log(key)
}

// VIC CHECKERBOARD
// second and third rows have the ID of the blank indexes in the first row
const checkerboard = 
[	//0   1   2  3  4   5   6   7   8   9
	["E","T","","A","O","N","","R","I","S"],
	["B","C","D","F","G","H","J","K","L","M"],//2
	["P","Q"," ","U","V","W","X","Y","Z","."]//6
]

// ENCRYPTION ALGORYTHM
const encrypt = function(str) {
	var cypheroutput = ''
	var cypherletter
	for (i=0;i<str.length;i++) {
		if (checkerboard[0].indexOf(str[i]) != -1) {
			cypherletter = checkerboard[0].indexOf(str[i]) // stri[i] is a common letter
		} else {
			if (checkerboard[1].indexOf(str[i]) != -1) {
				cypherletter = `2${checkerboard[1].indexOf(str[i])}` // str[i] is in the second row (with ID "2")
			} else {
				if (checkerboard[2].indexOf(str[i]) != -1) {
					cypherletter = `6${checkerboard[2].indexOf(str[i])}` // str[i] is in the second row (with ID "6")
				}
			}
		}
		cypheroutput = `${cypheroutput}${cypherletter}`
	}
	var encryptionoutput = ''
	var encryptionnumber
	var keyindex = 0
	for (i=0;i<cypheroutput.length;i++) {
		encryptionnumber = parseInt(cypheroutput[i]) + parseInt(key[keyindex])
		if (encryptionnumber>9) {encryptionnumber = encryptionnumber.toString()[1]} //if number > 10, dicard 1s digit.
		encryptionoutput = `${encryptionoutput}${encryptionnumber}`
		if (keyindex == key.toString().length - 1) {keyindex = 0} else {keyindex++} //loop key index
	}
	return encryptionoutput
}

// DECRYPTION ALGORYTHM
const decrypt = function(str) {
	var subtractedoutput = ''
	var subtractednumber
	var keyindex = 0
	//str = str.toString()
	for (i=0;i<str.length;i++) {
		subtractednumber = parseInt(str[i]) - parseInt(key[keyindex])
		if (subtractednumber<0) {subtractednumber = subtractednumber + 10} //if number is negative, add 10.
		subtractedoutput = `${subtractedoutput}${subtractednumber}`
		if (keyindex == key.toString().length - 1) {keyindex = 0} else {keyindex++} //loop key index
	}
	var decryptedstring = ''
	var decryptedchar
	for (var i=0;i<subtractedoutput.length;i++) {
		if(subtractedoutput[i] !== '2' && subtractedoutput[i] !== '6') { //number is common, only one digit
			decryptedchar = checkerboard[0][subtractedoutput[i]]
		} else {
			if(subtractedoutput[i] == '2') {
				decryptedchar = checkerboard[1][subtractedoutput[i + 1]]
			} else {
				if(subtractedoutput[i] == '6') {
					decryptedchar = checkerboard[2][subtractedoutput[i + 1]]
				}
			}
			i++
		}
		decryptedstring = `${decryptedstring}${decryptedchar}`
	}
	return decryptedstring
}

// HASH ALGORYTHM
const cyrb53 = function(str, seed = 0) { //cyrb53 (c) 2018 bryc (github.com/bryc)
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};