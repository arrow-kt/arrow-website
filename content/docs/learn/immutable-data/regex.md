---
sidebar_position: 7
---

# Regular expressions

Lenses, prisms, and basic traversals have an important limitation: the only
go _one level deep_ in the data structure. The functions in the
`arrow.optics.regex` package remove that limitation, providing a great
foundation for querying and modifying hierarchical data, such as trees
or JSON documents.

<!--- TEST_NAME OpticsRegex -->

## Repetition

<!--- INCLUDE .*
import arrow.optics.*
import arrow.optics.dsl.*
import arrow.optics.regex.*
import arrow.optics.regex.dsl.*
import io.kotest.matchers.shouldBe
-->

We shall use different forms of trees in the examples below.
The first variation only has data in the leaves.

```kotlin
@optics sealed interface BinaryTree1<out A> {
    companion object
}

@optics data class Node1<out A>(
    val children: List<BinaryTree1<A>>
) : BinaryTree1<A> {
    constructor(vararg children: BinaryTree1<A>) : this(children.toList())

    companion object
}

@optics data class Leaf1<out A>(
    val value: A
) : BinaryTree1<A> {
    companion object
}
```

Suppose we want to increment all the numbers in a binary tree of integers.
The code below attempts to do that, but fails because it only traverses the
children of nodes in one level -- this is why only the last `Leaf1` is
modified after the call.

```kotlin
val exampleTree1 = Node1(Node1(Leaf1(1), Leaf1(2)), Leaf1(3))

fun example() {
    val path = BinaryTree1.node1<Int>().children().every.leaf1().value()
    
    val modifiedTree1 = path.modify(exampleTree1) { it + 1 }
    modifiedTree1 shouldBe Node1(Node1(Leaf1(1), Leaf1(2)), Leaf1(4))
}
```

<!--- KNIT example-optics-regex-01.kt -->
<!--- TEST assert -->

<!--- INCLUDE .*
@optics sealed interface BinaryTree1<out A> {
    companion object
}

@optics data class Node1<out A>(
    val children: List<BinaryTree1<A>>
) : BinaryTree1<A> {
    constructor(vararg children: BinaryTree1<A>) : this(children.toList())

    companion object
}

@optics data class Leaf1<out A>(
    val value: A
) : BinaryTree1<A> {
    companion object
}

val exampleTree1 = Node1(Node1(Leaf1(1), Leaf1(2)), Leaf1(3))
-->

So how should be look at this problem? First, we know that we'll always
end by traversing a final `Leaf1` and the `value` there. In the middle,
we may need to go down the children once or more. In fact, _zero_
times should also be considered, as the binary tree could be just a
single leaf. We can express this idea by wrapping the first segment
of the previous path with `zeroOrMore`.

```kotlin
fun example() {
    val path = zeroOrMore(BinaryTree1.node1<Int>().children().every).leaf1().value()
    
    val modifiedTree1 = path.modify(exampleTree1) { it + 1 }
    modifiedTree1 shouldBe Node1(Node1(Leaf1(2), Leaf1(3)), Leaf1(4))
}
```

<!--- KNIT example-optics-regex-02.kt -->
<!--- TEST assert -->

The functions `zeroOrMore` and `onceOrMore` provide _repetition_ of
a single lens, prims, or traversal, that is applied recursively.
These functions are available on every scenario in which you can 
construct an optics going from a type to itself -- in our example,
`node1<Int>().children().every` focus from `BinaryTree1` into
`BinaryTree1`.

## Combination

Let's now consider another variation of binary trees, in which now
at every step (leaf or node) we find a value.

```kotlin
@optics sealed interface BinaryTree2<out A> {
    companion object
}

@optics data class Node2<out A>(
    val innerValue: A,
    val children: List<BinaryTree2<A>>
) : BinaryTree2<A> {
    constructor(value: A, vararg children: BinaryTree2<A>) : this(value, children.toList())

    companion object
}

@optics data class Leaf2<out A>(
    val value: A
) : BinaryTree2<A> {
    companion object
}
```

If we construct a path similar to the previous one, we shall only
focus on those values in leaves, as we can see in the example below.

```kotlin
val exampleTree2 = Node2(1, Node2(2, Leaf2(3), Leaf2(4)), Leaf2(5))

fun example() {
    val path = zeroOrMore(BinaryTree2.node2<Int>().children().every).leaf2().value()
    
    val modifiedTree2 = path.modify(exampleTree2) { it + 1 }
    modifiedTree2 shouldBe Node2(1, Node2(2, Leaf2(4), Leaf2(5)), Leaf2(6))
}
```

<!--- KNIT example-optics-regex-03.kt -->
<!--- TEST assert -->

<!--- INCLUDE .*
@optics sealed interface BinaryTree2<out A> {
    companion object
}

@optics data class Node2<out A>(
    val innerValue: A,
    val children: List<BinaryTree2<A>>
) : BinaryTree2<A> {
    constructor(value: A, vararg children: BinaryTree2<A>) : this(value, children.toList())

    companion object
}

@optics data class Leaf2<out A>(
    val value: A
) : BinaryTree2<A> {
    companion object
}

val exampleTree2 = Node2(1, Node2(2, Leaf2(3), Leaf2(4)), Leaf2(5))
-->

The solution in this case is to _combine_ two different traversals into a single one.
In the code below we build `nodeValues`, that focuses on values found in nodes,
and `leafValues`, that focuses on those values in the leaves. Then we combine them
using the `and` infix function from the library.

```kotlin
fun example() {
    val nodeValues = zeroOrMore(BinaryTree2.node2<Int>().children().every).node2().innerValue()
    val leafValues = zeroOrMore(BinaryTree2.node2<Int>().children().every).leaf2().value()
    val path = nodeValues and leafValues
    
    val modifiedTree2 = path.modify(exampleTree2) { it + 1 }
    modifiedTree2 shouldBe Node2(2, Node2(3, Leaf2(4), Leaf2(5)), Leaf2(6))
}
```

<!--- KNIT example-optics-regex-04.kt -->
<!--- TEST assert -->

It is also possible to remove some of the duplication in the code above.
In particular, we can separate the "digging" in the binary tree (the part where
we use `zeroOrMore`) from obtaining the value by either looking at the one
on a node or at the one on a leaf.

```kotlin
fun example() {
    val pathToValue = BinaryTree2.node2<Int>().innerValue() and BinaryTree2.leaf2<Int>().value()
    val path = zeroOrMore(BinaryTree2.node2<Int>().children().every) compose pathToValue
    
    val modifiedTree2 = path.modify(exampleTree2) { it + 1 }
    modifiedTree2 shouldBe Node2(2, Node2(3, Leaf2(4), Leaf2(5)), Leaf2(6))
}
```

<!--- KNIT example-optics-regex-05.kt -->
<!--- TEST assert -->

Unfortunately, with this refactor we no longer can use the chained syntax
using `.` all the time. We need to resort to `compose` instead.

:::info Regular expressions?

You might be wondering why we call `zeroOrMore`, `onceOrMore`, and `and` the
_regular expression_ functions. To understand this, we need to view _paths_
to data as "strings" in which each "letter" represent one single optic.

For example, if we use `n` for `node1`, `c` for `children`, `e` for `every`,
`l` for `leaf1`, and `v` for `value`, the "strings" we want to use to access
all the values are those of the form:

```
lv
ncelv
ncencelv
ncencencelv
...
```

From that point of view, the regular expression that matches all the possible
paths we want to take is `(nce)*lv`, where `*` is the regular expression
operator that matches that string zero or more times.

Similarly, `onceOrMore` corresponds to `+`. The `and` functions corresponds
to `+`, since it allows choosing between several matches, that in turn
correspond to different possible paths to focus on the data.

:::
