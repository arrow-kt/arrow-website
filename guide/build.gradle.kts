import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

@Suppress("DSL_SCOPE_VIOLATION")
plugins {
  alias(libs.plugins.kotlin.jvm)
  alias(libs.plugins.ksp)
  alias(libs.plugins.kotlinx.serialization)
}

repositories {
  mavenCentral()
}

dependencies {
  testImplementation(libs.kotlin.stdlib)
  testImplementation(libs.kotlin.test)
  testImplementation(libs.coroutines.test)
  testImplementation(libs.kotlinx.knit.test)
  testImplementation(libs.arrow.core.lib)
  testImplementation(libs.arrow.core.highArity)
  testImplementation(libs.arrow.core.serialization)
  testImplementation(libs.arrow.fx.coroutines)
  testImplementation(libs.arrow.autoclose)
  testImplementation(libs.arrow.resilience)
  testImplementation(libs.arrow.atomic)
  testImplementation(libs.arrow.fx.stm)
  testImplementation(libs.arrow.optics.lib)
  testImplementation(libs.arrow.optics.reflect)
  // testImplementation(libs.arrow.optics.compose)
  testImplementation(libs.arrow.collectors)
  testImplementation(libs.arrow.eval)
  testImplementation(libs.arrow.functions)
  testImplementation(libs.arrow.cache4k)
  testImplementation(libs.kotest.assertions.core)
  testImplementation(libs.kotest.property)
  testImplementation(libs.suspendapp)
  testImplementation(libs.kafka.kotlin)
  testImplementation(libs.cache4k)
  ksp(libs.arrow.optics.plugin)
}

tasks {
  withType<Test>().configureEach {
    useJUnitPlatform()
    testLogging {
      setExceptionFormat("full")
      setEvents(listOf("passed", "skipped", "failed", "standardOut", "standardError"))
    }
  }

  withType<KotlinCompile>().configureEach {
    compilerOptions.freeCompilerArgs.add("-Xconsistent-data-class-copy-visibility"  )
  }
}
