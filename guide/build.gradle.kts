@Suppress("DSL_SCOPE_VIOLATION")
plugins {
  id(libs.plugins.kotlin.jvm.get().pluginId)
}

repositories {
  mavenCentral()
}

dependencies {
  testImplementation(libs.kotlin.stdlib)
  testImplementation(libs.kotlinx.knit.test)
  testImplementation(libs.arrow.core)
  testImplementation(libs.arrow.fx.coroutines)
  testImplementation(libs.arrow.fx.resilience)
  testImplementation(libs.arrow.fx.stm)
  testImplementation(libs.kotest.assertions.core)
  testImplementation(libs.kotest.property)
  testImplementation(libs.kotest.runner.junit)
  testImplementation(libs.kotest.framework.engine)
}

sourceSets.test {
  java.srcDirs("examples", "test")
}

tasks {
  withType<Test>().configureEach {
    useJUnitPlatform()
    testLogging {
      setExceptionFormat("full")
      setEvents(listOf("passed", "skipped", "failed", "standardOut", "standardError"))
    }
  }
}
