# Changelog

## [Unreleased] - TBD

-

## [v1.6.5] (2022-03-03)

- Updated dependencies to the latest version.
- Fixed issues with the new version of the `ConnectionMetadataBuilder` class.
- Fixed issues that can occur when the `relationMetadata` is undefined.

## [v1.6.4] (2021-07-09)

- Updated dependencies to the latest versions.
- Fixed syntax errors when tables with hypens were used.

## [v1.6.3] (2021-05-24)

- Updated dependencies to the latest versions.
- Updated relationships have `Parent <--> Child` format instead of `Child <--> Parent` which lead to nicer diagrams.

## [v1.6.2] (2020-12-21)

- Updated dependencies to the latest versions.
- Fixed non visible properties issue.

## [v1.6.1] (2020-12-15)

- Updated dependencies to the latest versions.
- Fixed wrong relationship arrow for one-to-one relationships.

## [v1.6.0] (2020-12-10)

- Added `--color` flag to override diagram colors.
- Added `--plantuml-url` flag to override PlantUML server.
- Added `--with-entity-names-only` flag to display only entity names in entity titles.
- Added `--with-table-names-only` flag to display only database table names in entity titles.
- Updated dependencies to the latest versions.
- Updated UML builder to handle styles in a separate class.
- Updated entity titles to display entity names and database tables.
- Updated TypeormUml class to accept either a config path or a connection itself.
- Removed circles from entity titles.

## [v1.5.0] (2020-11-28)

- Added .eslintignore file.
- Updated dependencies to the latest versions.
- Updated Node.js version to be >= 10.0.0.
- Renamed short option name for the `--direction` flag to be `D` instead of `d`.
- Reworked the code base to export builder and allow run it programmatically.
- Fixed compatibility issues with SQLite3 (via [#24](https://github.com/eugene-manuilov/typeorm-uml/pull/24)).

## [v1.4.0] (2020-11-16)
- Added `--direction` flag to define a diagram direction: "top to bottom" or "left to right".
- Added `--handwritten` flag to enable handwritten mode.
- Added `--with-enum-values` flag to show enum values
- Added `<<FK>>` suffix to foreign key columns.
- Updated the default color schema and column icons.
- Fixed the current working directory issue.

## [v1.3.0] (2020-11-12)
- Added an example with a shopping cart database.
- Updated builder to throw an error if no entities have been found.
- Updated builder to use entities instead of classes.
- Updated builder to use entity relationships.
- Fixed issues when the absolute path to the config file was used.
- Fixed issues with foreign keys when sometimes foreign keys were defined before referencing tables.

## [v1.2.1] (2020-06-18)
- Fixed puml diagram downloading issue.

## [v1.2.0] (2020-06-18)
- Added GitHub Actions to check build process on push.
- Added GitHub Actions to check generated UML.
- Added puml format that displays generated UML code.
- Reworked typeorm configuration read to skip connecting to the database.
- Fixed primary column formatting for TXT format (removed HTML tag).

## [v1.1.3] (2020-05-25)
- Fixed typo in the readme file.
- Updated dependencies to the latest versions.

## [v1.1.2] (2020-01-11)
- Fixed UML generation issue.

## [v1.1.1] (2020-01-11)

- Fixed build command issue.

## [v1.1.0] (2020-01-11)

- Added `--download` option to download a diagram.
- Added `--include` option to include only specific entities to the diagram.
- Added `--exclude` option to exclude specific entities from the diagram.

[Unreleased]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.6.4...master
[v1.6.4]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.6.3...v1.6.4
[v1.6.3]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.6.2...v1.6.3
[v1.6.2]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.6.1...v1.6.2
[v1.6.1]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.6.0...v1.6.1
[v1.6.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.5.0...v1.6.0
[v1.5.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.4.0...v1.5.0
[v1.4.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.3.0...v1.4.0
[v1.3.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.2.1...v1.3.0
[v1.2.1]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.2.0...v1.2.1
[v1.2.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.3...v1.2.0
[v1.1.3]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.2...v1.1.3
[v1.1.2]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.1...v1.1.2
[v1.1.1]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.0...v1.1.1
[v1.1.0]: https://github.com/eugene-manuilov/typeorm-uml/releases/tag/v1.1.0
