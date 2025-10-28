// This file was automatically generated from regex.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOpticsRegex05

import arrow.optics.*
import arrow.optics.dsl.*
import arrow.optics.regex.*
import arrow.optics.regex.dsl.*
import io.kotest.matchers.shouldBe
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

fun example() {
    val pathToValue = BinaryTree2.node2<Int>().innerValue() and BinaryTree2.leaf2<Int>().value()
    val path = zeroOrMore(BinaryTree2.node2<Int>().children().every) compose pathToValue
    
    val modifiedTree2 = path.modify(exampleTree2) { it + 1 }
    modifiedTree2 shouldBe Node2(2, Node2(3, Leaf2(4), Leaf2(5)), Leaf2(6))
}
