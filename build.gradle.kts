import kotlinx.knit.KnitPluginExtension

buildscript {
  dependencies { classpath(libs.kotlinx.knit) }
}

repositories {
  mavenCentral()
}

plugins {
  alias(libs.plugins.kotlin.jvm)
}

apply(plugin = libs.plugins.kotlinx.knit.get().pluginId)

configure<KnitPluginExtension> {
  siteRoot = "https://arrow-kt.io/"

  files = fileTree(project.rootDir) {
    include("**/*.md")
    exclude("**/quickstart/index.md")
    exclude("**/node_modules/**/*.md")
  }
}

group = "io.arrow-kt"
version = "1.0"
