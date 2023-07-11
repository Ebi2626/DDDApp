# DddappCommon

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

## Code scaffolding

Run `ng generate component component-name --project dddapp-common` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project dddapp-common`.
> Note: Don't forget to add `--project dddapp-common` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build dddapp-common` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build dddapp-common`, go to the dist folder `cd dist/dddapp-common` and run `npm publish`.

## Exporting local package

Go to the `dist/dddapp-common` folder. Pack it with `yarn pack` - it will result with `.tgz` file. Go to the `projects/ui` and `projects/api` and replace in `package.json` source of `dddapp-common`. Reinstall packages eg. `yarn install`.
