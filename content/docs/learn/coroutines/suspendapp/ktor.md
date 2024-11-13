---
title: ... with Ktor
sidebar_position: 1
---

# SuspendApp with Ktor

There are some cases where it is convenient to gracefully shutdown a Ktor server. Basically, it is about giving some
time to the server to finish some pending processing before turning it off.

Kubernetes is a good example of this need. When we're working with Kubernetes we often need to
support [Graceful Shutdown](https://cloud.google.com/blog/products/containers-kubernetes/kubernetes-best-practices-terminating-with-grace).
Kubernetes sends `SIGTERM` to our _Pod_ to signal it needs to gracefully shutdown.
However, there is an issue which doesn't allow us to immediately shutdown when we receive `SIGTERM` from Kubernetes.
Our pod can still receive traffic **after** `SIGTERM`, so we need to apply additional back-pressure to delay graceful
shutdown.

:::info Additional reading

More information on this can be found in this blog by [Phil Pearl](https://philpearl.github.io/post/k8s_ingress/),
and on [learnk8s.io](https://learnk8s.io/graceful-shutdown).

:::

The module `suspendapp-ktor` provides a `server` constructor that lifts the Ktor `ApplicationEngine` in to a Resource,
representing the _Engine_ running an `Application`(i.e `Netty`) while supporting [auto-reload](https://ktor.io/docs/auto-reload.html).
The example below introduces graceful shutdown for Kubernetes;
we additionally use `awaitCancellation` to _await_ `SIGTERM`, `SIGINT` or other shutdown hooks.

```kotlin
fun main() = SuspendApp {
  resourceScope {
    server(Netty) {
      routing {
        get("/ping") {
          call.respond("pong")
        }
      }
    }
    awaitCancellation()
  }
}
```

When the `release` function of our `ApplicationEngine` is called, there is a `wait` period before the beginning of the stop
process (defaulted to `30.seconds`), this gives Kubernetes enough time to do all its network management before we shut down.
Two more parameters are available:
- `grace` which sets the number of seconds during which already inflight requests are allowed to continue before the shutdown process begins,
- `timeout` which sets the number of seconds after which the server will be forceably shutdown.

:::note Development mode

In the case that Ktor server is set in
[development mode](https://ktor.io/docs/development-mode.html), the `wait` period is ignored.

:::
