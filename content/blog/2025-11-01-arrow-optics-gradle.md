---
title: Arrow Optics for Gradle in beta
category: articles
image: /img/arrow-release-ftr.jpg
no_image_on_post: true
tags: [core, articles]
---

# Introducing Arrow Optics for Gradle

In order to unlock the full power of Arrow Optics, lenses and prisms for your
own types must be defined. This is a tedious task, that can be automate with
the help of the `@optics` annotation. Alas, [setting up](/learn/quickstart/#additional-setup-for-optics)
the plug-in is not easy (especially in Multiplatform projects), and the
architecture of the plugin means that you need to write a `companion object`
explicitly on every one of your types.

We've been working on making this process easier, and the result is the
new [Arrow Optics plugin for Gradle](https://plugins.gradle.org/plugin/io.arrow-kt.optics).
This plugin configures your project to process `@optics` annotations,
taking care of all the peculiarities of Kotlin JVM and Multiplatform plugins.
Furthermore, it sets up the Kotlin compiler to generate `companion object`
automatically (if they are not already present), saving time and boilerplate.

This new plugin is in **beta**, the KSP plugin still remains the officially
supported way to generate optics. But we would also love feedback on the
new approach, with the goal of making this simpler option the default.
If you want to try the new plugin, you need to:

- Remove any previous configuration of the Arrow Optics KSP plugin,
- Add `id("io.arrow-kt.optics") version "2.2.0"` to your `plugins` block,
- Call `arrowOptics()` at the **end** of your `kotlin` block.

```kotlin
plugins {
    id("io.arrow-kt.optics") version "2.2.0"
}

kotlin {
    // compiler, target, and source set configuration
    // ...
    arrowOptics()
}
```

Please let us know of any issues you encounter or any feedback on how to
make the process even more approachable, in either our
[issues page](https://github.com/arrow-kt/arrow/issues)
or the `#arrow` channel on [Kotlin Slack](https://slack-chats.kotlinlang.org/c/arrow).
