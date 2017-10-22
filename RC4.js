/*
M.Louay Alosh

RC4 encryption/decryption algorithm module

how to use?

///////////////////////////////
//test.js
	
	let RC4 = require('./RC4.js');
	let RC4Instance = new RC4();

	let cipher = RC4Instance.encrypt('hello man','someAwesomeKey');
	RC4Instance.decrypt(cipher,'someAwesomeKeya');
	RC4Instance.printInfo();

//////////////////////////////

*/

//add swap function to all Arrays from now on..
if(!(Array.prototype.swap)){
	
	Array.prototype.swap = function (index1, index2){
		
		if(typeof index1 !== 'number') return;
		if(typeof index2 !== 'number') return;

		let tmp = this[index1];
		this[index1] = this[index2];
		this[index2] = tmp;
	}
}

function stringToByteArray(text){
	
	let textInBytes = text
						.split('')
						.map(
							function(input){
								return input.charCodeAt(0)
							});
						// .join('');


	return textInBytes;
}


function RC4(){

	//return object literal to make many RC4 instances with `new` keyword
	// --> which is amazing!
	return {

		secretKey: '',
		
		encryptOutput:{
			plainText: '',
			cipherText: '',
		},
		
		decryptOutput:{
			plainText: '',
			cipherText: '',
		},
		
		//identity permutaion
		identityPermutationON: function identityPermutationON(s, k, keyInBytes){
			for (let i = 0; i < 255; i++) {
				s.push(i);
				k.push(keyInBytes[i%keyInBytes.length])
			}
		},

		//RC4 - Key Scheduling Algorithm (KSA)
		KSA: function KSA(s, k){
		    let j = 0;
		    for (let i = 0; i < 255; i++) {
		    	j = (j + s[i] + k[i]) % 256;
		    	s.swap(i, j);
		    }
		},

	    //RC4 - Pseudo-Random Generation Algorithm (PRGA)
		PRGA: function PRGA(s, keyStream, textInBytes){
		    let i = 0; 
		    j = 0;
		    for (let l = 0; l < textInBytes.length; l++) {
		        i = (l+1) % 256;
		        j = (j+s[i]) % 256;
		        s.swap(i, j);
		        keyStream.push( s[ (s[i] + s[j]) % 256 ] );
		    }
		},

	    //generating the cipher text
		generateCipher: function generateCipher(plainText, secretKey){
			let cipher = [];
		    for (let i = 0; i < secretKey.length; i++) {
		        cipher.push( secretKey[i] ^ plainText[i]);
		    }
		    return cipher;
		},

		encrypt: function(text, key){
			
			//Entity authentication(checking input)
			if(typeof text !== 'string') return;
			if(typeof key !== 'string') return;

			this.encryptOutput.plainText = text;
			
			if(!this.secretKey)	
				this.secretKey = key;
			else	
				if(this.secretKey !== key) {
					console.log('cannot encrypt:keys are not identical');
					return;
				}

			//convert strings to array of bytes
			let textInBytes = stringToByteArray(text);
			let keyInBytes = stringToByteArray(key);

			let s = [];
			let k = [];

			this.identityPermutationON(s, k, keyInBytes);
			this.KSA(s, k);

		    let keyStream = [];
		    this.PRGA(s, keyStream, textInBytes);

		    let cipher = this.generateCipher(textInBytes, keyStream);

		    this.encryptOutput.cipherText = cipher;

		    return cipher;
		},

		decrypt: function(cipherText, key){
			

			//Entity authentication(checking input)
			if(typeof key !== 'string') return;

			this.decryptOutput.cipherText = cipherText;

			if(!this.secretKey)
				this.secretKey = key;
			else
				if(this.secretKey != key){
					console.log('cannot decrypt:keys not identical');
					return;
				}

			//convert strings to array of bytes
			let keyInBytes = stringToByteArray(key);

			let s = [];
			let k = [];

			this.identityPermutationON(s, k, keyInBytes);
			this.KSA(s, k);

			let keyStream = [];
			this.PRGA(s, keyStream, cipherText);

			let plainText = this.generateCipher(cipherText, keyStream);

			plainText = plainText.map(
										function(input){
											return String.fromCharCode(input);
									})
								  .join("");
			
			this.decryptOutput.plainText = plainText;

			return plainText;
		},

		printInfo: function(){
			console.log('--------info-----------');
			console.log('key =  ', this.secretKey);
			console.log();

			console.log('encryptOutput:');
			console.log('text = ', this.encryptOutput.plainText);
			console.log('cipherText = ', this.encryptOutput.cipherText);
			
			console.log();
			
			console.log('decryptOutput');
			console.log('text = ', this.decryptOutput.plainText);
			console.log('cipherText = ', this.decryptOutput.cipherText);
			
			console.log();
		},
		
	}//object literal end >_<

};

module.exports = RC4;