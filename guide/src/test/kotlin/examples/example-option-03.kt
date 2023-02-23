// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption03

fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()
