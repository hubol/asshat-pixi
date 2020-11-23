# asshat-pixi
A base project for browser games

## Dependencies
You will obviously need `npm`!

Please install [sox](http://sox.sourceforge.net/) to run and build the project. You will need a plugin to encode / decode mp3. On my mac I installed sox using brew and it seemed to include this. On Windows you will need to copy [libmp3lame](https://www.rarewares.org/mp3-lame-libraries.php) next to your sox installation.

## Developing
When developing, you'll want to run the `watch-gen:assets` script. This script runs forever and regenerates the `src/musics.ts`, `src/sounds.ts`, and `src/textures.ts` files. It also uses `sox` to convert your audio assets to formats better suited for the web.

You'll also want to run the `serve` script. This will serve your project and open a browser window to it. The page will refresh whenever you make a change!

## Building
When you want to build, you should probably stop the `serve` script. Then you should clear the `dist` directory and run the `build` script.