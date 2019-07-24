# Delta Sandbox

An online compiler for the [Delta programming language](https://github.com/delta-lang/delta).
A live instance is running [here](https://delta-lang.github.io/sandbox.html).

The frontend simply sends the submitted code to the backend to be compiled and
run. The backend server is deployed on Heroku.

## Usage

To run the frontend locally, just open the [index.html](index.html) file in a
web browser.

To start the server, first install its dependencies with `npm install` and then
run `npm start`. You can supply the path to your local Delta compiler executable
as an argument to `npm start`.

To format the code, run `npm run format`.

## Contributing

Delta Sandbox is open-source software. Contributions are welcome and encouraged!

## License

Delta Sandbox is licensed under the MIT license, a permissive free software
license. See the file [LICENSE.txt](LICENSE.txt) for the full license text.
