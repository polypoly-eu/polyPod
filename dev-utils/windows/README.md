# Building on Windows

We aim to support building on Windows, but rarely test it - so if these
instructions don't work, or if you can think of ways to improve the situation on
Windows, contributions would be highly welcome!

For now, you will have to make a few manual preparations:

1. Open _cmd_ with administrator privileges (Right click on _cmd_ -> _run as
   administrator_).
2. Set your current working directory to this one: `cd path\to\polyPod\dev-utils\windows`.
3. Run `node convert-symlinks.js`.
4. Now you can go back to the polyPod root folder (`cd ../..`) and run `node build.js`.
