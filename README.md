# typeorm-uml 1.0.0

A command line tool to generate UML diagrams for Typeorm projects.

## Instalation

```sh-session
npm i -D typeorm-urml
```

## Usage

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

## Contribute

Want to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/typeorm-uml/issues/new) and we can discuss it or submit a pull request.

## License

MIT
