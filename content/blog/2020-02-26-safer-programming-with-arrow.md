---
title: What could possibly go wrong? - A safer programming with Arrow
image: https://img.youtube.com/vi/C9SmleSSeGk/maxresdefault.jpg
category: videos
tags: [core, videos]
link: https://youtu.be/C9SmleSSeGk
---
Your Kotlin app grabs data from an API, transforms it and saves the processed data in a database. However, there are so many things that could go wrong at runtime: the API might be inaccessible, the data is not what you expected or the data can't be persisted in the database. You can start adding try catch blocks to your function in your objects, but there is a better way to do it: treat your impure functions as computations with context, pass them around just like other values, and make the necessary unsafe invocation from a single point of your app, your main function.

This talk will walk you through the core functional concepts of Arrow, you will learn how Some, Either and even IO are functor, applicative and monad. You can use the code example from this talk as a starting point for your Arrow-learning, to write safer, simpler and more elegant functional code in Kotlin.
