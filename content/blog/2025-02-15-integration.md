---
title: Work on more integration
category: articles
no_image_on_post: true
tags: [core, articles]
---

# Working on more integration

Once Arrow 2.0 is finally [released](https://arrow-kt.io/community/blog/2024/12/05/arrow-2-0/),
a fair question is what are the new goals of the Arrow project.
This post outlines some of the future plans of the maintainer team.
Having said so, Arrow welcomes any contribution — code or ideas —
that fits its goal of being a _companion in the Kotlin journey_.

Apart from the any needed bugfixes, we aim to improve our integration
with the broader Kotlin ecosystem, a line of work we started with
the [optics module for Compose](https://arrow-kt.io/learn/quickstart/compose/#updating-the-model).
One line of work already in progress is better integration with Ktor.
We would really appreciate any input on what integrations you miss
as Arrow user.

At this point, the [`arrow-kt` organization](https://github.com/arrow-kt/)
has more than 50 projects. Of those, only a handful have graduated
from a proof-of-concept into part of Arrow. To make this status
more clear, the `arrow-integrations` and SuspendApp projects are
now hosted in the main `arrow` repository. This means that those
projects become part of the regular Arrow release schedule, instead
of the current model in which some libraries may be outdated for a
few weeks. Furthermore, it removes some burden from maintainers, which
now only need to care about one single repository.

Speaking of maintainance, in the past weeks we have been paying some
of the debt in our build files, that had grown too wild.
Technically, we have moved from separate [`arrow-gradle-config`](https://github.com/arrow-kt/arrow-gradle-config)
into a convention plug-in withing the same repository.
This process has revealed some lack of uniformity between the
different projects, especially with respect to supported platforms.
From now on, all Arrow libraries support Native targets in 
[tiers 1 and 2](https://kotlinlang.org/docs/native-target-support.html),
plus Windows + MinGW.

From the point of view of Arrow users, the only visible part of
this transition is that the next version of Arrow integration modules
and SuspendApp should be 2.1.0, instead of 0.x. Note that no breaking
changes are expected, regardless of the major version bump.
