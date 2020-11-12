# typeorm-uml 1.3.0

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/typeorm-uml.svg)](https://www.npmjs.com/package/typeorm-uml)
[![Downloads/week](https://img.shields.io/npm/dw/typeorm-uml.svg)](https://www.npmjs.com/package/typeorm-uml)
[![License](https://img.shields.io/npm/l/typeorm-uml.svg)](https://github.com/eugene-manuilov/mynewcli/blob/master/package.json)

A command line tool to generate UML diagrams for Typeorm projects. It uses [plantuml](https://plantuml.com/) to render diagrams and outputs an URL to a diagram.

## Instalation

Install this command as a development dependency to your project:

```sh-session
npm i -D typeorm-uml
```

## Usage

Add a new script to your `package.json` to be able to run it:

```json
{
    "name": "myproject",
    "scripts": {
        "db:diagram": "typeorm-uml ormconfig.json"
    }
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
  -c, --connection=connection    [default: default] The connection name.
  -d, --download=download        The filename where to download the diagram.
  -e, --exclude=exclude          Comma-separated list of entities to exclude from the diagram.
  -f, --format=png|svg|txt|puml  [default: png] The diagram file format.
  -i, --include=include          Comma-separated list of entities to include into the diagram.
  --monochrome                   Whether or not to use monochrome colors.
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

[![typeorm/typescript-example](http://www.plantuml.com/plantuml/png/XL7DIyCm5B-_l-A9bmOTCc6NKigAEDp5moZYRQJhquOrIKdUeCNkVpVT5rhyo2s_xv2vP-bufsk0gvBUb25ijjH5hS2aIDlahaWl1CkYfe4XmuexR359CCflhnUBB1o1QGfGgPBGCpcot3NaZu0chcpf0VnMcKOwgR4EaOC2hGlS5q9ROpULipeqkXq177jn8vdUhUjGu0SWtXnseYfHnBXypgFfL0JOI4qnlcIhXwTi5TtFPWBsbuZ6UlxR7XvMZ_q1fPPZp1zVyr7O-ZHAaL__l6zGBKSb9-fi-4w7Wb-Jz_raqlU7p7z5vpl0d4mv_F0d)](http://www.plantuml.com/plantuml/png/XL7DIyCm5B-_l-A9bmOTCc6NKigAEDp5moZYRQJhquOrIKdUeCNkVpVT5rhyo2s_xv2vP-bufsk0gvBUb25ijjH5hS2aIDlahaWl1CkYfe4XmuexR359CCflhnUBB1o1QGfGgPBGCpcot3NaZu0chcpf0VnMcKOwgR4EaOC2hGlS5q9ROpULipeqkXq177jn8vdUhUjGu0SWtXnseYfHnBXypgFfL0JOI4qnlcIhXwTi5TtFPWBsbuZ6UlxR7XvMZ_q1fPPZp1zVyr7O-ZHAaL__l6zGBKSb9-fi-4w7Wb-Jz_raqlU7p7z5vpl0d4mv_F0d)

## Contribute

Want to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/typeorm-uml/issues/new) and we can discuss it or submit a pull request.

## License

MIT
