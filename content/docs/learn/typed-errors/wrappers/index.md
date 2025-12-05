---
title: Wrapper types
---

import { useCurrentSidebarCategory } from '@docusaurus/theme-common';
import DocCardList from '@theme/DocCardList';

# Wrapper types

There are many different way a failure is represented using a _wrapper type_.
Arrow strives to provide a uniform approach by using different builder functions
(such as the `either` build for the `Either` wrapper type).

In this section you can find a reference of the different wrapper types
supported by Arrow and sister libraries. Also, you can find more information
about particular wrapper types, and how to choose between them.

| Type                                 | Failure                                                                 | Additional states?                                   | Lives in                                                                                                                    |
|--------------------------------------|-------------------------------------------------------------------------|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `A?`                                 | `null`                                                                  | No                                                   | <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Kodee-mascot-petite.svg" style={{height: '20px'}} /> (stdlib) |
| `Option<A>`                          | `None`                                                                  | No                                                   | <img src="/img/arrow-brand-icon.svg" style={{height: '20px'}} /> (core)                                                     |
| `Result<A>`                          | `Failure` contains a `Throwable`, <br /> inspection possible at runtime | No                                                   | <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Kodee-mascot-petite.svg" style={{height: '20px'}} /> (stdlib) |
| `Either<E, A>`                       | `Left` contains value of type `E`                                       | No                                                   | <img src="/img/arrow-brand-icon.svg" style={{height: '20px'}} /> (core)                                                     |
| `Ior<E, A>`                          | `Left` contains value of type `E`                                       | Simultaneous success and <br /> failure using `Both` | <img src="/img/arrow-brand-icon.svg" style={{height: '20px'}} /> (core)                                                     |
| `Result<A, E>`                       | `Failure` contains value of type `E`                                     | No                                                   | [Result4k](https://github.com/fork-handles/forkhandles/tree/trunk/result4k)                                                 |
| `Outcome<E, A>`                      | `Failure` contains value of type `E` | `Absent` value                                       | [Quiver](https://block.github.io/quiver/)                                                                                   |
| `Progressive` <br /> `Outcome<E, A>` | `Failure` contains value of type `E` | `Incomplete` value                                   | [Pedestal State](https://opensavvy.gitlab.io/groundwork/pedestal/api-docs/state/index.html)                                                                           |

<DocCardList />
