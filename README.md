# JSMash0
**Bakes all your javascript files into mash!**
###### This code is no longer being maintained! It is here for compatibility with my other programs.
## What is this?
JSMash0 is a simple (and dirty) script that achieves the goal of "Combining multiple files together into a single file".
## Why is this?
This was designed to allow someone to write modular javascript code and have those modules be bundled into a single file for publishing.
#### Not convinced you should use it?
Well you don't have to be because ***this code is no longer being maintained***!
Yes, this code is only on github because some of my other programs *actually use this thing*.
(Only because it works)
## What it does
Say you had a codebase has a couple files and looks like this
> randomFileNumber1one.js

> randomFileNumber2one.js

> folder/randomFileNumber3two.js

> index.html

## Usage
###### You brave soul.
#### Nodejs is required and not included.
Inside the **build** folder you'll find a file labled
> build.bp

This file will contain your instructions for how you want your javascript files to be mashed.

***Important:*** The instructions must always be inside **build.bp** which must always be inside the same directory as the **build.js** file.

#### Types of Instructions
Every instruction comes as a token pair, a **symbol** and the *instruction parameter*, which are separated by a space. Everything beyond the first two tokens are ignored.

Here is a list of the instructions
>**\*** *comment*  ( A comment. Not really an instruction, just useful. )

>**^** *library/path* ( A source file path using LibraryPath as root. )

>**\+** *source/path* ( A source file using SourceFilePath as root. )

>**=** *output.file* ( File that everything will be mashed into. )

Now, all that being said- I have little idea as to how to configure this because
###### I made it in a single hour and ended up using it for 8 months. :')
But to use it simply copy and paste the build directory into your **project folder**, open a terminal window with the directory set to that same **project folder** and type
> $node build/build.js *[SourceFilePath [LibraryPath]]*

and if everything was setup correctly- you should have all your output files inside the **build** directory.

Cheers.
Good luck
Much love.
Have fun.

