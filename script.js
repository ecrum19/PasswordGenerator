const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboard = document.getElementById('clipboard');
const feedbackE1 = document.getElementById('strength');
const feedback_color = document.querySelector('.pass-indicator');

// Determines the strength of the password generated
// Time to crack passwords from https://www.hivesystems.io/blog/are-your-passwords-in-the-green 
function calculatePasswordScore(password) {

	// Define the types of characters that should be included in a strong password
	const lowercaseLetters = /[a-z]/g;
	const uppercaseLetters = /[A-Z]/g;
	const numbers = /[0-9]/g;
	const symbols = '^*%$!&@#';
	let passwordScore = 0
	
	// Count the number of each type of character in the password
	let lowercaseCount = (password.match(lowercaseLetters) || []).length;
	let uppercaseCount = (password.match(uppercaseLetters) || []).length;
    let numberCount = (password.match(numbers) || []).length;
    
    // simple count of symbols in password
	let symbolCount = 0
    for (i = 0; i < password.length; i++) {
        if (symbols.includes(password[i])) {
            symbolCount += 1;
        }
    }

    // Only numbers are present
    if (lowercaseCount == 0 && uppercaseCount == 0 && numberCount > 0 && symbolCount == 0) {
        passwordScore = Math.floor(password.length / 14);
        if (password.length == 15 || password.length == 16) {
            passwordScore += 1;
        } else if (password.length == 17) {
            passwordScore += 2;
        } else if (password.length == 18) {
            passwordScore += 3;
        } else if (password.length > 18) {
            passwordScore += 3;
        }
    }
    // Only one case of letters are present
    if ((lowercaseCount > 0 && uppercaseCount == 0 && numberCount == 0 && symbolCount == 0) || 
        (lowercaseCount == 0 && uppercaseCount > 0 && numberCount == 0 && symbolCount == 0)) {
        passwordScore = Math.floor(password.length / 10);
        if (password.length == 11) {
            passwordScore += 1;
        } else if (password.length == 12) {
            passwordScore += 2;
        } else if (password.length == 13) {
            passwordScore += 3;
        } else if (password.length == 14) {
            passwordScore += 4;
        } else if (password.length == 15) {
            passwordScore += 5;
        } else if (password.length >= 16) {
            passwordScore += 6;
        }
    }
    // Two cases of letters are present
    if (lowercaseCount > 0 && uppercaseCount > 0 && numberCount == 0 && symbolCount == 0) {
        passwordScore = Math.floor(password.length / 8);
        if (password.length == 9) {
            passwordScore += 1;
        } else if (password.length == 10) {
            passwordScore += 2;
        } else if (password.length == 11) {
            passwordScore += 3;
        } else if (password.length == 12) {
            passwordScore += 4;
        } else if (password.length == 13) {
            passwordScore += 5;
        } else if (password.length >= 14) {
            passwordScore += 6;
        }
    }
    // numbers and two cases of letters are present
    if (lowercaseCount > 0 && uppercaseCount > 0 && numberCount > 0 && symbolCount == 0) {
        passwordScore = Math.floor(password.length / 8);
        if (password.length == 9) {
            passwordScore += 1;
        } else if (password.length == 10) {
            passwordScore += 3;
        } else if (password.length == 11) {
            passwordScore += 4;
        } else if (password.length == 12) {
            passwordScore += 5;
        } else if (password.length >= 13) {
            passwordScore += 6;
        }
    }
    // two cases of letters and symbols are present
    if (lowercaseCount > 0 && uppercaseCount > 0 && numberCount == 0 && symbolCount > 0) {
        passwordScore = Math.floor(password.length / 8);
        if (password.length == 9) {
            passwordScore += 1;
        } else if (password.length == 10) {
            passwordScore += 4;
        } else if (password.length == 12) {
            passwordScore += 5;
        } else if (password.length >= 13) {
            passwordScore += 6;
        }
    }
	// one case of letters, numbers, and symbols are present
    if ((lowercaseCount > 0 && uppercaseCount == 0 && numberCount > 0 && symbolCount > 0) || 
		(lowercaseCount == 0 && uppercaseCount > 0 && numberCount > 0 && symbolCount > 0)) {
        passwordScore = Math.floor(password.length / 8);
        if (password.length == 9) {
            passwordScore += 1;
        } else if (password.length == 10) {
            passwordScore += 4;
        } else if (password.length == 12) {
            passwordScore += 5;
        } else if (password.length >= 13) {
            passwordScore += 6;
        }
    }
	
    // All character types are present
    if (lowercaseCount > 0 && uppercaseCount > 0 && numberCount > 0 && symbolCount > 0) {
        passwordScore = Math.floor(password.length / 8);
        if (password.length == 9) {
            passwordScore += 2;
        } else if (password.length == 10) {
            passwordScore += 3;
        } else if (password.length == 11) {
            passwordScore += 5;
        } else if (password.length >= 12) {
            passwordScore += 6;
        }
    }

	if (passwordScore > 7) {
        passwordScore = 7;
    }

	// Define the estimated cracking times for each password score range (From ChatGPT)
	const crackingTimes = {
		0: "< 1 minute",
		1: "< 1 hour",
		2: "< 1 day",
		3: "< 1 week",
		4: "< 1 year",
		5: "< 1 century",
		6: "> 1 century",
        7: "> 1 millennium"
	}
	  
	// Interprets the password score and return a message indicating the strength of the password
	let crackingTime = crackingTimes[passwordScore];
	feedback_color.id = passwordScore < 3 ? "weak" : passwordScore < 5 ? "moderate" : "strong";
	if (passwordScore < 3) {
		return `WEAK. Takes ${crackingTime} to crack.`;
	} else if (passwordScore >= 3 && passwordScore < 5) {
		return `MODERATE. Takes ${crackingTime} to crack.`;
	} else {
		return `STRONG! Takes ${crackingTime} to crack.`;
	}
} 

// Generates a password from random characters designated
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    // When no options are selected 
    if(typesCount === 0) {
        return 'No Options Selected';
    }
    
    // Generates a password from random characters designated
    for (let i=0; i<length; i++) {
        const funcName = Object.keys(typesArr[Math.floor(Math.random() * typesArr.length)])[0];
        generatedPassword += randomFunc[funcName]();
    }
    const finalPassword = generatedPassword;
    return finalPassword;
}

// For calling the various composition options
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol
}

// For calling the various character types
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
	return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
function getRandomSymbol() {
	const symbols = '^*%$!&@#'
	return symbols[Math.floor(Math.random() * symbols.length)];
}

// For copying the password to the clipboard
clipboard.addEventListener('click', () => {
	const textarea = document.createElement('textarea');
	const password = resultEl.innerText;
	
	if(!password) { return; }
	
	textarea.value = password;
	document.body.appendChild(textarea);
	textarea.select();
	navigator.clipboard.writeText('text to be copied');
	textarea.remove();
	alert('Password copied to clipboard');
});

// For checking which boxes are selected before generating the password on a button click
generate.addEventListener('click', () => {
	const length = +lengthEl.value;
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numbersEl.checked;
	const hasSymbol = symbolsEl.checked;

	const result = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
	resultEl.innerText = result;
	feedbackE1.innerText = calculatePasswordScore(result);
});



