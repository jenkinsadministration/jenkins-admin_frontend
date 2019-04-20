# Jenkins Management by Code - FrontEnd

> VueJs Application

When you have multiples projects to maintenance, you start thinking about templates
to generate projects and edit all of then with a simple line of code and not doing
it manually.

![img](https://i.imgur.com/S1Muty9.png)

## The Concept

A website to store the configuration to easily replicate in case of recreate the
server, to prevent human mistakes and depend of the memory of one team member.


## Requirements

 - Node 8 or above
 - A Firebase account
 
## Configuration
### Step 1

Enable Google authentication method in the  [Firebase console](https://console.firebase.google.com/) 

### Step 2

Initialize Firebase at ``main.js`` with your [Firebase Credentials](https://console.firebase.google.com/)
``` bash
firebase.initializeApp({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: ''
})
```

### Step 3

Setup your api endpoints at the ``config`` folder you'll found two files for ``dev``
and ``prod`` environment. Both of them have the attribute ``API_URI`` that point to the api. 

## Installation

``` bash

# install dependencies
npm install || yarn install

# serve with hot reload at localhost:8080
npm run dev || yarn dev

# build for production with minification and to build Progressive Web Apps
npm run build || yarn build

```
## Tests

> 404 - No tests found

## Authors

 - [Javier Hernán Caballero García](https://javiercaballero.info) - [@caballerojavier13](https://github.com/caballerojavier13) - `AR`

## Contributing

All the contributions are welcome. Feel free to create a Pull Request.

## License
MIT © Javier Caballero

