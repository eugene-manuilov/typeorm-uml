# Changelog

## [Unreleased] - TBD
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

[Unreleased]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.3.0...master
[v1.3.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.2.1...v1.3.0
[v1.2.1]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.2.0...v1.2.1
[v1.2.0]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.3...v1.2.0
[v1.1.3]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.2...v1.1.3
[v1.1.2]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.1...v1.1.2
[v1.1.1]: https://github.com/eugene-manuilov/typeorm-uml/compare/v1.1.0...v1.1.1
[v1.1.0]: https://github.com/eugene-manuilov/typeorm-uml/releases/tag/v1.1.0
