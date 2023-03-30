---
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Java support

:::caution

This is still an alpha feature.

:::

## Adding the plug-in

:::info

Unfortunately, you have to depend on the Kotlin standard library explicitly; otherwise strange errors pop up during the compilation process.

:::

<Tabs groupId="build">
  <TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
buildscript {
  dependencies {
    classpath("io.arrow-kt.analysis.java:io.arrow-kt.analysis.java.gradle.plugin:2.0")
  }
}

apply(plugin = "io.arrow-kt.analysis.java")

dependencies {
  implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.10")
}
```

  </TabItem>
  <TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
buildscript {
  dependencies {
    classpath 'io.arrow-kt.analysis.java:io.arrow-kt.analysis.java.gradle.plugin:2.0'
  }
}

apply plugin: 'io.arrow-kt.analysis.java'

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:1.8.10'
}
```

  </TabItem>
</Tabs>

## Examples

### Functions

The usage of Arrow Analysis in Java code is very similar to Kotlin. Note that you **must** import `pre` and `post` functions using `import static` for them to be considered by the plug-in. Following Kotlin's lead, the messages must be represented as lambdas, as we do below.

```java
import static arrow.analysis.RefinementDSLKt.post;
import static arrow.analysis.RefinementDSLKt.pre;

public class Example {
    public int f(int x) {
        pre(x > 0, () -> "x must be positive");
        return post(x + 1, r -> r > 0, () -> "result is positive");
    }
}
```

### Class invariants

You can also define invariants for your class. In that case, the invariants go in so-called _instance initializers_, which are just blocks which appear within the class body. Note that mutable fields are **not** supported, so you need to mark those as `final`.

```java
import static arrow.analysis.RefinementDSLKt.*;

final class Positive {
    private final int n;
  
    public Positive(int value) {
        pre(value >= 0, () -> "value is positive");
        this.n = value;
    }
  
    public int getValue() {
        return n;
    }
  
    {
        // this is the class invariant
        assert this.getValue() >= 0 : "value is positive";
    }
}
```

Note that Arrow Analysis considers parameterless functions starting with `get` as fields. In the snippet above we use `getValue` in that fashion.
