// This file was automatically generated from outcome-progress.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOutcome02

import opensavvy.progress.*
import opensavvy.state.outcome.*
import opensavvy.state.progressive.*

fun <E, A> printProgress(po: ProgressiveOutcome<E, A>) {
    val (current, progress) = po
    when {
        progress is Progress.Loading -> println("loading...")
        current is Outcome.Success -> println("done!")
        current is Outcome.Failure -> println("problem ${current.failure}")
    }
}
