# typeorm-uml

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/typeorm-uml.svg)](https://www.npmjs.com/package/typeorm-uml)
[![Downloads/week](https://img.shields.io/npm/dw/typeorm-uml.svg)](https://www.npmjs.com/package/typeorm-uml)
[![License](https://img.shields.io/npm/l/typeorm-uml.svg)](https://github.com/eugene-manuilov/typeorm-uml/blob/master/package.json)

A command line tool to generate UML diagrams for Typeorm projects. It uses [plantuml](https://plantuml.com/) to render diagrams and outputs an URL to a diagram.

## Installation

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
  -D, --direction=(TB|LR)          [default: TB] Arrows directions. TB=top to bottom, LR=left to right.
  -c, --connection=connection      [default: default] The connection name.
  -d, --download=download          The filename where to download the diagram.
  -e, --exclude=exclude            Comma-separated list of entities to exclude from the diagram.
  -f, --format=(png|svg|txt|puml)  [default: png] The diagram file format.
  -i, --include=include            Comma-separated list of entities to include into the diagram.
  --color=pkey=#aaa                Custom colors to use for the diagram.
  --handwritten                    Whether or not to use handwritten mode.
  --monochrome                     Whether or not to use monochrome colors.
  --with-enum-values               Whether or not to show possible values for the enum type field.
  --plantuml-url                   [default: http://www.plantuml.com/plantuml] URL of the plantuml server to use.
```

## Defining custom colors

If you want to override colors used in the diagram, you can do it using `--color` flag. It accepts the key-value pair where key is an element and value is a color. You can use multiple `--color` flags to override multiple elements. For example:

```sh-session
typeorm-uml path/to/ormconfig.json --color class.ArrowColor=#ff9900 --color class.BorderColor=#ff9900 --color class.BackgroundColor=#efefef --color column=#ddd
```

You can use `pkey`, `fkey` and `column` colors to override entity column icons, and `class.BackgroundColor`, `class.BorderColor`, `class.ArrowColor` to override enity class styles.

## Typescript

If you use `.ts` entities in your Typeorm config, then run this command with `ts-node` like this:

```sh-session
ts-node ./node_modules/.bin/typeorm-uml ormconfig.json
```

## PlantUML

Under the hood, this library uses [PlantUML](https://plantuml.com/) to generate diagrams.

By default it uses the [official plantuml server](http://www.plantuml.com/plantuml).

If you want to use a custom server, use the `plantuml-url` flag and omit the trailing slash.


## Run Programmatically

You can also import the `TypeormUml` class from this package and build UML diagrams in your code. See this small example:

```typescript
import { EOL } from 'os';
import { join } from 'path';

import { Direction, Flags, Format, TypeormUml } from 'typeorm-uml';

const configPath = join( __dirname, 'path/to/ormconfig.json' );
const flags: Flags = {
    direction: Direction.LR,
    format: Format.SVG,
    handwritten: true,
};

const typeormUml = new TypeormUml();
typeormUml.build( configPath, flags ).then( ( url ) => {
    process.stdout.write( 'Diagram URL: ' + url + EOL );
} );
```

## Example

[**typeorm/typescript-example**](https://github.com/typeorm/typescript-example)

```sh-session
typeorm-uml --format=svg
```

[![typeorm/typescript-example](http://www.plantuml.com/plantuml/svg/ZLFTIyCm47_FNt4Yo0gEeR0NAMLppeyN7yOGtoHjRcjecol9ZMqu_tVJrCqo9veyzNvVTpawSYmjhwfIY3E52sqGwWAtlKq4SPh46PLaR-waBHweL6Xcf9BumXEIU12m13Rn84qEuiLUt2hFn-7yq1pulh2gJ5SnlM-kLrIejEnRpCYgKrAMQOcD4Wrhti86uXXwyyjrhXaZI18XSgqG7AD5ucsDhYrKo3af9mHJ3KoG4ZDLeBJFOar6k4ARMbfPWQMLKRu1WnQ6dNhf6sWSWQptwW0kbuhMsYnX8Kk77IINHgsjPaRp0yjAwHoy2_3dLcR5CkHEceaXZ1EGiRMqReiEvT8YcbRX7mZj4V3XnmiF19baN9BTGXGImdf1AuXkuEbvthkwYi2NlnO1HbROG2_ZsUHnFEjT3uSU_tQhoV7_dFnIoXDM7G9kkC7dqzVvSSJRLzSQtTl90HhIqt5q2-tvHx0F-DNvOzVlxtR1z4_I_bk84HhL_3gV)](http://www.plantuml.com/plantuml/svg/ZLFTIyCm47_FNt4Yo0gEeR0NAMLppeyN7yOGtoHjRcjecol9ZMqu_tVJrCqo9veyzNvVTpawSYmjhwfIY3E52sqGwWAtlKq4SPh46PLaR-waBHweL6Xcf9BumXEIU12m13Rn84qEuiLUt2hFn-7yq1pulh2gJ5SnlM-kLrIejEnRpCYgKrAMQOcD4Wrhti86uXXwyyjrhXaZI18XSgqG7AD5ucsDhYrKo3af9mHJ3KoG4ZDLeBJFOar6k4ARMbfPWQMLKRu1WnQ6dNhf6sWSWQptwW0kbuhMsYnX8Kk77IINHgsjPaRp0yjAwHoy2_3dLcR5CkHEceaXZ1EGiRMqReiEvT8YcbRX7mZj4V3XnmiF19baN9BTGXGImdf1AuXkuEbvthkwYi2NlnO1HbROG2_ZsUHnFEjT3uSU_tQhoV7_dFnIoXDM7G9kkC7dqzVvSSJRLzSQtTl90HhIqt5q2-tvHx0F-DNvOzVlxtR1z4_I_bk84HhL_3gV)

## Contribute

Want to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/typeorm-uml/issues/new) and we can discuss it or submit a pull request.

## License

MIT
