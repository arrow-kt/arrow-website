// This file was automatically generated from regex.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOpticsRegex01

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

fun example() {
    val path = BinaryTree1.node1<Int>().children().every.leaf1().value()
    
    val modifiedTree1 = path.modify(exampleTree1) { it + 1 }
    modifiedTree1 shouldBe Node1(Node1(Leaf1(1), Leaf1(2)), Leaf1(4))
}
