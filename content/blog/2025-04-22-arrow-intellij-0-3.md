---
title: Arrow plug-in for IntelliJ 0.3
category: articles
image: /img/arrow-release-ftr.jpg
no_image_on_post: true
tags: [intellij, articles]
---

# Arrow plug-in for IntelliJ 0.3

The new version of the [Arrow plug-in for IntelliJ](https://plugins.jetbrains.com/plugin/24550-arrow) (and compatible IDEs) is out! This release fixes some problems in inspections related to `Raise`, and brings **compatibility with 2025.1**. The plug-in is compatible with **both K1 and K2 mode** of the Kotlin plug-in.

This release also brings new **gutter icons** inspired by the "suspended function" and "recursive function" icons in the Kotlin plug-in. These gutter icons highlight uses of `Raise` functions, and delayed computations with `Eval`. Our goal is to make a bit more explicit what the surface syntax of Kotlin keeps implicit.

<center>

![Gutter icon for Raise](/img/blog/gutter-raise.png) <br /> _Gutter icon for `Raise`_

![Gutter icons for Eval](/img/blog/gutter-eval.png) <br /> _Gutter icons for `Eval.later` and `Eval.always`_

</center>
