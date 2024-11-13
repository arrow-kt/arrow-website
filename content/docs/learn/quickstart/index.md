---
title: Quickstart
sidebar_custom_props:
  icon: icon-quickstart.svg
  overview: true
position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# <decorated-text icon={frontMatter.sidebar_custom_props.icon}>Quickstart</decorated-text>

Arrow aims to be the _perfect companion_ to your Kotlin journey. That means it focuses on tasks most developers dealt with, like modifying data or managing resources. Given these aims, Arrow strives to provide _idiomatic_ solutions and integrate with core Kotlin concepts such as coroutines.

Arrow is inspired by the great work made in other programming language communities, especially from _functional_, _data-oriented_ and _concurrent_ programming. This doesn't mean you need to know any of those ideas to use the libraries; Arrow exposes these concepts in ways that do not feel alien to Kotlin programmers.

:::info Where to start?

- Look at the [list of libraries](../quickstart/libs) and see how Arrow can help in your project
- Our [summary](../summary) is designed to help you find your way in the Arrow ecosystem.
- Look at some [example projects](../design/projects/) using Arrow in both frontend and backend.
- Learn about [design and architecture](../design) using functional and data-oriented programming concepts.

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

All Arrow libraries are Multiplatform-ready, so you can use them in all of your
[KMP](https://kotlinlang.org/docs/multiplatform.html) projects. Be aware that
some instructions here may need to be slightly changed in that situation.

#### One by one

Simply include the desired library in your `dependencies` block or as a
`<dependency>` if you're using Maven.

<Tabs groupId="build">
<TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
dependencies {
  implementation("io.arrow-kt:arrow-core:1.2.4")
  implementation("io.arrow-kt:arrow-fx-coroutines:1.2.4")
}
```

</TabItem>
<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
dependencies {
  implementation 'io.arrow-kt:arrow-core:1.2.4'
  implementation 'io.arrow-kt:arrow-fx-coroutines:1.2.4'
}
```

</TabItem>
<TabItem value="maven" label="Maven">


```xml
<dependency>
  <groupId>io.arrow-kt</groupId>
  <artifactId>arrow-core</artifactId>
  <version>1.2.4</version>
</dependency>
<dependency>
  <groupId>io.arrow-kt</groupId>
  <artifactId>arrow-fx-coroutines</artifactId>
  <version>1.2.4</version>
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
arrow = "1.2.4"
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
  implementation(platform("io.arrow-kt:arrow-stack:1.2.4"))
  // no versions on libraries
  implementation("io.arrow-kt:arrow-core")
  implementation("io.arrow-kt:arrow-fx-coroutines")
}
```

</TabItem>
<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
dependencies {
  implementation platform('io.arrow-kt:arrow-stack:1.2.4')
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
    <version>1.2.4</version>
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

:::caution Eager dependency update policy

The Arrow team follows an eager dependency update policy. That means that Arrow libraries always depend on the most up-to-date version of the dependencies at the moment of release. In most cases, it is fine to use older versions of the dependencies; but in rare cases, the conflict leads to [`NoClassDefFoundError`](https://docs.oracle.com/javase/8/docs/api/java/lang/NoClassDefFoundError.html)s. If that happens, please try to update your dependencies to a more recent version, or [open an issue](https://github.com/arrow-kt/arrow/issues).

:::

### Additional setup for plug-ins

If you're using the Optics component of Arrow, we provide a Kotlin compiler 
plug-in that can derive most of the boilerplate required to use it. This
plug-in is built with [KSP](https://kotlinlang.org/docs/ksp-overview.html),
which requires an additional configuration step.


<Tabs groupId="build">
<TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
plugins {
  id("com.google.devtools.ksp") version "1.9.24-1.0.20"
}

dependencies {
  implementation("io.arrow-kt:arrow-optics:1.2.4")
  ksp("io.arrow-kt:arrow-optics-ksp-plugin:1.2.4")
}
```

</TabItem>
<TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
plugins {
  id 'com.google.devtools.ksp' version '1.9.24-1.0.20'
}

dependencies {
  implementation 'io.arrow-kt:arrow-optics:1.2.4'
  ksp 'io.arrow-kt:arrow-optics-ksp-plugin:1.2.4'
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

### Plug-in for IntelliJ-based IDEs

If you are using an [IntelliJ IDEA](https://www.jetbrains.com/idea/) or any
other IDE from JetBrains, we strongly recommend installing the
[Arrow plug-in](https://plugins.jetbrains.com/plugin/24550-arrow).
The plug-in helps fix common problems, especially in the realm of
[typed errors](../typed-errors/index.md) and suggests more idiomatic
alternatives when available.

### Alphas (development builds)

For those wanting to live on the edge, we provide alphas of our [development
branch](https://github.com/arrow-kt/arrow). Those are tagged with the upcoming
version, followed by `-alpha.` and the sequence number of the compilation. 
Check [Maven Central](https://central.sonatype.com/artifact/io.arrow-kt/arrow-core/versions)
for the most recent list of available versions.
