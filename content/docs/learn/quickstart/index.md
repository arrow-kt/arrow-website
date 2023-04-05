---
title: Quickstart
sidebar_custom_props:
  icon: icon-quickstart.svg
  overview: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# <decorated-text icon={frontMatter.sidebar_custom_props.icon}>Quickstart</decorated-text>

Arrow is composed of different libraries; simply select the ones
you need in your project.

:::info Multiplatform-ready

All Arrow libraries are Multiplatform-ready, so you can use them in all of your
[KMP](https://kotlinlang.org/docs/multiplatform.html) projects. Be aware that
some instructions here may need to be slightly changed in that situation.

:::

### Enable the Maven Central repository

Arrow is published in [Maven Central](https://search.maven.org/), so you need to
enable it as a source of dependencies in your build.

<Tabs groupId="build">
  <TabItem value="gradleKotlin" label="Gradle (Kotlin)">

  ```kotlin
  repositories {
    mavenCentral()
  }
  ```

  </TabItem>
  <TabItem value="gradleGroovy" label="Gradle (Groovy)">

  ```groovy
  repositories {
    mavenCentral()
  }
  ```

  </TabItem>
  <TabItem value="maven" label="Maven">

:::info
  
Maven includes the Maven Central repository by default.

:::

  </TabItem>
</Tabs>

### Include the dependencies

You're now ready to include Arrow in your project. You have three possibilities
that correspond to three different ways of handling versioning in your build.

#### One by one

Simply include the desired library in your `dependencies` block or as a
`<dependency>` if you're using Maven.

<Tabs groupId="build">
<TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
dependencies {
  implementation("io.arrow-kt:arrow-core:1.2.0-RC")
  implementation("io.arrow-kt:arrow-fx-coroutines:1.2.0-RC")
}
```

</TabItem>
<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
dependencies {
  implementation 'io.arrow-kt:arrow-core:1.2.0-RC'
  implementation 'io.arrow-kt:arrow-fx-coroutines:1.2.0-RC'
}
```

</TabItem>
<TabItem value="maven" label="Maven">


```xml
<dependency>
  <groupId>io.arrow-kt</groupId>
  <artifactId>arrow-core</artifactId>
  <version>1.2.0-RC</version>
</dependency>
<dependency>
  <groupId>io.arrow-kt</groupId>
  <artifactId>arrow-fx-coroutines</artifactId>
  <version>1.2.0-RC</version>
</dependency>
```

</TabItem>
</Tabs>

#### Using version catalogs

[Version catalogs](https://docs.gradle.org/current/userguide/platforms.html)
provide centralized management of versions. This is especially interesting when
your Gradle build has several subprojects.

<Tabs groupId="build">

<TabItem value="gradleToml" label="libs.version.toml (Common)">

```yaml
[versions]
arrow = "1.2.0-RC"
# other versions

[libraries]
arrow-core = { module = "io.arrow-kt:arrow-core", version.ref = "arrow" }
arrow-fx-coroutines = { module = "io.arrow-kt:arrow-fx-coroutines", version.ref = "arrow" }
# other dependencies
```

</TabItem>

<TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
dependencies {
  implementation(libs.arrow.core)
  implementation(libs.arrow.fx.coroutines)
}
```

</TabItem>

<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
dependencies {
  implementation(libs.arrow.core)
  implementation(libs.arrow.fx.coroutines)
}
```

</TabItem>

<TabItem value="maven" label="Maven">

:::info

Version catalogs are only available in Gradle.

:::

</TabItem>
</Tabs>

#### Using a Bill-of-Materials (BOM)

Another way to keep a single version for all Arrow dependencies in your build is
to include `arrow-stack`, which declares versions for the rest of the components.

<Tabs groupId="build">
<TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
dependencies {
  implementation(platform("io.arrow-kt:arrow-stack:1.2.0-RC"))
  // no versions on libraries
  implementation("io.arrow-kt:arrow-core")
  implementation("io.arrow-kt:arrow-fx-coroutines")
}
```

</TabItem>
<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
dependencies {
  implementation platform('io.arrow-kt:arrow-stack:1.2.0-RC')
  // no versions on libraries
  implementation 'io.arrow-kt:arrow-core'
  implementation 'io.arrow-kt:arrow-fx-coroutines'
}
```

</TabItem>
<TabItem value="maven" label="Maven">


```xml
<dependency>
    <groupId>io.arrow-kt</groupId>
    <artifactId>arrow-stack</artifactId>
    <version>1.2.0-RC</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
<!-- no versions on libraries -->
<dependency>
  <groupId>io.arrow-kt</groupId>
  <artifactId>arrow-core</artifactId>
</dependency>
<dependency>
  <groupId>io.arrow-kt</groupId>
  <artifactId>arrow-fx-coroutines</artifactId>
</dependency>
```

</TabItem>
</Tabs>

### Additional setup for plug-ins

If you're using the Optics component of Arrow, we provide a Kotlin compiler 
plug-in that can derive most of the boilerplate required to use it. This
plug-in is built with [KSP](https://kotlinlang.org/docs/ksp-overview.html),
which requires an additional configuration step.


<Tabs groupId="build">
<TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
plugins {
  id("com.google.devtools.ksp") version "1.8.10-1.0.9"
}

dependencies {
  implementation("io.arrow-kt:arrow-optics:1.2.0-RC")
  ksp("io.arrow-kt:arrow-optics-ksp-plugin:1.2.0-RC")
}
```

</TabItem>
<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
plugins {
  id 'com.google.devtools.ksp' version '1.8.10-1.0.9'
}

dependencies {
  implementation 'io.arrow-kt:arrow-optics:1.2.0-RC'
  ksp 'io.arrow-kt:arrow-optics-ksp-plugin:1.2.0-RC'
}
```

</TabItem>

<TabItem value="maven" label="Maven">

:::caution

There's no official support for KSP in Maven. 
[This project](https://github.com/Dyescape/kotlin-maven-symbol-processing)
provides unofficial support for that scenario.

:::

</TabItem>

</Tabs>

### Alphas (development builds)

For those wanting to live on the edge, we provide alphas of our [development
branch](https://github.com/arrow-kt/arrow). Those are tagged with the upcoming
version, followed by `-alpha.` and the sequence number of the compilation. 
Check [Maven Central](https://central.sonatype.com/artifact/io.arrow-kt/arrow-core/1.1.5/versions)
for the most recent list of available versions.
