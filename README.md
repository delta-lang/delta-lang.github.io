# cx-language.github.io

This repository hosts the website generated from the main repository's
[docs](https://github.com/cx-language/cx/tree/master/docs) directory,
as well as a server that runs an instance of the C* compiler for
executing C* code on the website. The server is deployed to Heroku.

## Contributing

To develop the website locally, edit the sources in the main repository's
[docs](https://github.com/cx-language/cx/tree/master/docs) directory,
and generate the website using the `build-website.sh` script. The CI deploys
the changes to this repository when they're merged to master.

To run the server locally, first install its dependencies with `npm install` and then
run `npm start`. You can supply the path to your local C* compiler executable
as an argument to `npm start`.

To format the code, run `npm run format`.

## License

cx-language.github.io is licensed under the MIT license, a permissive free software
license. See the file [LICENSE.txt](LICENSE.txt) for the full license text.
