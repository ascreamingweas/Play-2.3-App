name := """playAppAssetPipeline"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava, SbtWeb, net.litola.SassPlugin)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  cache
)

// Configure the steps of the asset pipeline
// See https://www.playframework.com/documentation/2.3.x/Assets
// By appending 'in Assets, it also builds the concatenated minified js file in dev mode too
//pipelineStages in Assets := Seq(rjs, digest)
pipelineStages := Seq(rjs, digest)
