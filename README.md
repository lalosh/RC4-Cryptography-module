# RC4-Cryptography-module
M.Louay Alosh

RC4 encryption/decryption algorithm module

how to use?

```js	
	let RC4 = require('./RC4.js');
	let RC4Instance = new RC4();

	let cipher = RC4Instance.encrypt('hello man','someAwesomeKey');
	RC4Instance.decrypt(cipher,'someAwesomeKeya');
	RC4Instance.printInfo();
```
