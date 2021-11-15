# imagemin

> Minify images seamlessly using commonjs modules


<br>

## Warning

This repo is only for development purposes and not intended to be used in production enviroments.

## Usage

```js
const imagemin = require('imagemin');
const imageminSvgo = require('imagemin-svgo');

const files = await imagemin(['images/*.{svg}'], {
	destination: 'build/images',
	plugins: [
		imageminSvgo(),
	]
});

```

## API

### imagemin(input, options?)

Returns `Promise<object[]>` in the format `{data: Buffer, sourcePath: string, destinationPath: string}`.

#### input

Type: `string[]`

File paths or [glob patterns](https://github.com/mrmlnc/fast-glob#globbing-patterns).

#### options

Type: `object`

##### destination

Type: `string`

Set the destination folder to where your files will be written. If no destination is specified, no files will be written.

##### glob

Type: `boolean`\
Default: `true`

Enable globbing when matching file paths.

### imagemin.buffer(buffer, options?)

Returns `Promise<Buffer>`.

#### buffer

Type: `Buffer`

Buffer to optimize.

#### options

Type: `object`

##### plugins

Type: `Array`

[Plugins](https://www.npmjs.com/browse/keyword/imageminplugin) to use.

## Related

- [imagemin](https://github.com/imagemin/imagemin) - Original Repository
- [imagemin-cli](https://github.com/imagemin/imagemin-cli) - CLI for this module
- [imagemin-app](https://github.com/imagemin/imagemin-app) - GUI app for this module
- [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) - Gulp plugin
- [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin) - Grunt plugin
