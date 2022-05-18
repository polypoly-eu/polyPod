# Building on Windows

For now, you will have to make a few manual preparations:

1. Open _cmd_ with administrator privileges (Right click on _cmd_ -> _run as
   administrator_).
2. Set your current working directory to this one: `cd path\to\polyPod\dev-utils\windows`.
3. Run `node convert-symlinks.js`.
4. Now you can go back to the polyPod root folder (`cd ../..`) and run `node build.js`.
