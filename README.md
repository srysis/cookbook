# Cookbook

A 'recipe book' website where you can store your own collection of your favorite recipes.


## Key features

- Create recipes with an ability to edit or delete them later on
- Search recipes by providing a list of ingredients and the website will display recipes that contain them
- Multi-language support without the need to reload the page (English, Czech and Russian are currently supported)
- Responsive layout


## Technical information

The Front-End side of this web-application was written using React.js framework.  
It uses 'Browser Router' from 'React-Router' package to allow client-side navigation, making it a Single Page Application, without a need for a page reload.
For 'requests' it uses Axios library. It also uses 'Axios requests interceptors' to verify every request from an authenticated user. 
Front-End side is hosted on Netlify.

The Back-End was written with Node.js with installed Express package to handle client requests and respond back with data, fetched from MySQL database in a desired format.
Authentication was implemented via HTTP-only cookies and JWT(JSON Web Tokens). User passwords are being hashed using 'bcrypt' package, used for data hashing.
Back-End is hosted on Vercel.

Finally, as the database it utilizes the MySQL database hosted remotely on Aiven.


## Link

The latest version of this app can be viewed [here](https://srysis-cookbook.netlify.app/).