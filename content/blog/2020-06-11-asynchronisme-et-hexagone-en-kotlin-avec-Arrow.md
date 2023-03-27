---
title: Asynchronisme et hexagone en Kotlin avec ArrowKt
image: https://img.youtube.com/vi/moJpV-BgezM/hqdefault.jpg
category: videos
tags: [core, videos]
link: https://youtu.be/moJpV-BgezM
event: Lambda Lille
---
J'aime bien le DDD et surtout les architectures hexagonales. Avoir un domaine auto-portant et non couplé à des blocs techniques comme Spring (ou autres) apporte beaucoup dans la testabilité et l'évolutivité de l'application.
Les modèles d'asynchronismes (programmation réactive, retardée, coroutines...) empêchent la dissociation stricte de notre modèle métier et de notre code infra dans un langage comme Kotlin.
Obligé d'utiliser une lib de coroutine ou autre programmation reactive.
Deux solutions s'offrent alors :
- Définir que les modèles d'asynchronisme sont des invariants de notre domaine et accepter ce couplage
- Chercher comment modéliser notre domaine comme un ensemble de comportements asynchrones
Dans ce talk nous allons voir comment réaliser la deuxième solution en utilisant la librairie Arrow et son modèle conceptuel d'asynchronisme pour nous permettre de découpler notre domaine de toute logique d'infrastructure.
