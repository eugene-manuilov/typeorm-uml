# typeorm-uml 1.0.0

A command line tool to generate UML diagrams for Typeorm projects. It uses [plantuml](https://plantuml.com/) to render diagrams and outputs an URL to a diagram.

## Instalation

Install this command as a development dependency to your project:

```sh-session
npm i -D typeorm-urml
```

## Usage

Add a new script to your `package.json` to be able to run it:

```json
{
    "name": "myproject",
    "scripts": {
        "db:diagram": "typeorm-uml ormconfig.json"
    },
    ...
}
```

Then run `npm run db:diagram` and you will receive an URL to an image with your diagram. You can use this URL to add to your README file or you can download the image and add it to your repository.

## Synopsis

```sh-session
USAGE
  $ typeorm-uml [CONFIGNAME]

ARGUMENTS
  CONFIGNAME  [default: ormconfig.json] Path to the Typeorm config file.

OPTIONS
  -c, --connection=connection  [default: default] The connection name.
  -f, --format=png|svg|txt     [default: png] The diagram file format.
  --monochrome                 Whether or not to use monochrome colors.
```

## Typescript

If you use `.ts` entities in your Typeorm config, then run this command with `ts-node` like this:

```sh-session
ts-node ./node_modules/.bin/typeorm-uml ormconfig.json
```

## Example

[**typeorm/typescript-example**](https://github.com/typeorm/typescript-example)

```sh-session
typeorm-uml --format=svg --monochrome
```

[![typeorm/typescript-example](http://www.plantuml.com/plantuml/png/bP9DIyD048RFpgyOuoMh5edGImXBWrZinKC9ugriibEpD9iDkrj8AFtl9ltGMgZe76SUtcS6PkAyi7wjAu1hIKjL4tgHLnIs38jAE8Sj9Wc6sVtDT9hsnP3pBxHPKJUGISxRv27dK2f9w3nPChvhoEqRIqMLT01kfUf6MA5HczeKfJMwrzar0S3UYeNmz65iXmmtSBNHv4iZjtYtCw6Io6ASlMPX5B6JSIqqnVYMpfzUqdduE1ups7vdDiRv_-LvvQlpm9CfjJx6xFazExSi3kihSelVBndesGNx0Ja6_CHwuqLJS1lWQCGnY8ATu8_eiGameLeEl_09)](http://www.plantuml.com/plantuml/png/bP9DIyD048RFpgyOuoMh5edGImXBWrZinKC9ugriibEpD9iDkrj8AFtl9ltGMgZe76SUtcS6PkAyi7wjAu1hIKjL4tgHLnIs38jAE8Sj9Wc6sVtDT9hsnP3pBxHPKJUGISxRv27dK2f9w3nPChvhoEqRIqMLT01kfUf6MA5HczeKfJMwrzar0S3UYeNmz65iXmmtSBNHv4iZjtYtCw6Io6ASlMPX5B6JSIqqnVYMpfzUqdduE1ups7vdDiRv_-LvvQlpm9CfjJx6xFazExSi3kihSelVBndesGNx0Ja6_CHwuqLJS1lWQCGnY8ATu8_eiGameLeEl_09)

## Contribute

Want to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/typeorm-uml/issues/new) and we can discuss it or submit a pull request.

## License

MIT
