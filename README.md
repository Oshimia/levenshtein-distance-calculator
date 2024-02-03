# Based on the custom starter script for Firebot, you can download the levenshteinDistance.js file and place it directly into the scripts folder, or to build it yourself you can follow instructions below. Make sure you have npm and node.js installed.

### Setup
1. Create a new project from these files. To do this, unpack the .zip where you want to create the new project and open the file in your coding IDE (like Visual Studio). 
2. Type `npm install` into the IDE console and hit enter.

### Building
Dev:
1. Type `npm run build:dev` into the IDE console and hit enter.
- Automatically copies the compiled .js to Firebot's scripts folder.

Release:
1. Type `npm run build` into the IDE console  and hit enter.
- Copy .js from `/dist`

### Note
- Once the .js file is in your scripts folder you will need to go to Firebot settings > Scripts > make sure custom scripts are enabled and then manage startup scripts and place add this script as a startup script.
- Keep the script definition object (that contains the `run`, `getScriptManifest`, and `getDefaultParameters` funcs) in the `index.ts` file as it's important those function names don't get minimized.
- Edit the `"scriptOutputName"` property in `package.json` to change the filename of the outputted script.
