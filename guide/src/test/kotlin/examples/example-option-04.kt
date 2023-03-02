// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption04

fun <A : Any> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()
