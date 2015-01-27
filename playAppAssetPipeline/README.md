# Asset Fingerprinting issues in Play 2.3
---

####The point of this "Hello World" application is to display the error with asset fingerprinting when testing in development mode

The main issue lies with the following. When running the app in production mode (via sbt start or sbt dist), the asset fingerprinting works fine. This is done with the following asset pipeline in build.sbt:
```
pipelineStages := Seq(rjs, digest)
```
When I run this in development mode (via sbt run), the versioned assets are not generated. According to the [sbt-web plugin documentation](https://github.com/sbt/sbt-web/blob/master/README.md), you can produce the versioned assets in your development environment by prepending 'in Assets' to the asset pipeline. This doesn't seem to be working and throws a 'Boxed Error' exception. The following is the pipeline for testing in development mode in build.sbt:
```
pipelineStages in Assets := Seq(rjs, digest)
```
---
#####Below is a list of directions that I followed to create this application so that you can reproduce this error. I used activator to initialize my Play application so please make sure you have this installed before you begin. Install [Activator](https://typesafe.com/get-started).

######1. Start by creating a new Play 2.3 application. Run the following:
```
activator new playApp
```
######2. Once you change directories to your new app, you will want to generate project files for your IDE. I used Eclipse running the following:
```
activator eclipse
```
You will want to install Scala's build tool. You can download it from [here](http://www.scala-sbt.org/) or install it manually with gem or brew:
```
gem install sbt
or
brew install sbt
```
Once you run activator the first time, you will be able to use Scala's build tool (sbt) to clean, compile, run the app. Click for more info on [sbt](http://www.scala-sbt.org/0.13/tutorial/).
######3. From here, I made sure the app built properly by running:
```
sbt clean compile
```
and then:
```
sbt run
```
This should run the basic Play app in your browser on localhost:9000. Open your browser and make sure that it is displaying properly.
######4. After you've verified that the app is building and running properly, import the project into Eclipse for editing. From here, I made the following changes:

4.1 In conf/routes, I switched to versioned assets using the following:
```
GET     /                           @controllers.Application.index()
GET     /assets/*file               controllers.Assets.versioned(path="/public", file: Asset)
```

4.2 In build.sbt, I removed unneeded dependencies, added plugins to root, and added the asset pipeline. This should look like this:
```
name := """playApp"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava, SbtWeb, net.litola.SassPlugin)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
    cache
)

pipelineStages := Seq(rjs, digest)
```

4.3 In project/plugins.sbt, I added a few plugins:
```
addSbtPlugin("net.litola" % "play-sass" % "0.4.0")

addSbtPlugin("com.typesafe.sbteclipse" % "sbteclipse-plugin" % "3.0.0")
```

4.4 In app/controllers/Application.java, I updated what is being sent to the scala template:
```
package controllers;

import play.mvc.Result;

import views.html.index;

public class Application extends play.mvc.Controller {

    public Result index() {
        return ok(index.render("Hello World!"));
    }

}
```

4.5 In app/views/main.scala.html, I updated the linked assets accordingly:
```
@(title: String)(content: Html)

<!DOCTYPE html>

<html>
    <head>
        <title>@title</title>
        <link rel="stylesheet" media="screen" href="@routes.Assets.versioned("stylesheets/style.css")">
        <link rel="shortcut icon" type="image/png" href="@routes.Assets.versioned("images/favicon.png")">
        <script src="@routes.Assets.versioned("javascripts/index.js")" type="text/javascript"></script>
    </head>
    <body>
        @content
    </body>
</html>
```

4.6 In app/views/index.scala.html, I customized the display:
```
@(message: String)

@main("Welcome to Play") {

    <div>
        <h1>@message</h1>
    </div>

}
```

4.7 I added a coffeescript to output a simple message to the console when loaded, also acts as another asset to version. I added the following to /app/assets/javascripts/index.coffee:
```
console.log "Welcome to Hello World Play App!"  if window.console
```

4.8 I also decided to use SASS for the styling so you will want to add the following to app/assets/stylesheets/style.scss:
```
@import "layouts/base";
```
and the following to app/assets/stylesheets/layouts/_base.scss:
```
/* Base */

body {
  background-color:#fff;
}
h1 {
  color:red;
}
```
Using SASS is optional. I added it to show additional assets that are being versioned (or should be versioned) and to practice with a very versatile css extention.

######5. At this point, you should have everything you need to replicate my error. Please test the following:

5.1 First you should test the asset pipeline in development mode with the following:
```
sbt run
```
You should see the app running in the browser on *localhost:9000*. Now check and make sure that the target/web/digest/ folder does not exist. This shouldn't be generated until the asset fingerprinting is actually being used.

5.2 Now we will test and make sure that the asset fingerprinting is working correctly when in production mode with the following:
```
sbt start
```
You should find that your app is running on *localhost:9000* and if you look in your target/web/digest/ folder, you should see three folders (stylesheets, javascripts, and images). Inside these folders you should see the assets that you created, but with a different file format, similiar to this:
```
9aa8984f1a41c22287fc844e8033ec0c-style.scss
style.scss.md5
```
This concludes that the assets are being versioned properly while in production mode.

5.3 Lastly, you will test the app with the suggested solution using the following pipeline in build.sbt:
```
pipelineStages in Assets := Seq(rjs, digest)
```
After running the following, you should get a "Boxed Error exception" in your browser:
```
sbt run
```
This concludes the issue that I've been having with using asset fingerprinting in development mode.

---

If you have had this issue or know of a solution to this problem, please feel free to get in touch with me or fork this repository with a fix.

Thanks!