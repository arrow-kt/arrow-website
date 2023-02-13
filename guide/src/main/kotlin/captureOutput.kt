package arrow.website

import java.io.*

val STDOUT_ENABLED_DEFAULT =
  try { java.lang.Boolean.getBoolean("kotlinx.knit.test.stdout") }
  catch (e: SecurityException) { false }

/**
 * Captures stdout and stderr of the specified block of code.
 *
 * The [name] is used to display which test is being run.
 * When [stdoutEnabled] is true, then everything is displayed to stdout when then code runs, too.
 */
public inline fun captureOutput(
  name: String,
  stdoutEnabled: Boolean = STDOUT_ENABLED_DEFAULT,
  main: (out: PrintStream) -> Unit
): List<String> {
  val oldOut = System.out
  val oldErr = System.err
  val logOut = if (stdoutEnabled) oldOut else NullOut
  val bytesOut = ByteArrayOutputStream()
  val tee = TeeOutput(bytesOut, logOut)
  val ps = PrintStream(tee)
  logOut.println("--- Running $name")
  System.setErr(ps)
  System.setOut(ps)
  val bytes: ByteArray
  try {
    try {
      main(logOut)
    } catch (e: Throwable) {
      System.err.print("Exception in thread \"main\" ")
      e.printStackTrace()
    }
    // capture output
    bytes = bytesOut.toByteArray()
    if (tee.flushLine()) logOut.println()
    logOut.println("--- done")
  } finally {
    System.setOut(oldOut)
    System.setErr(oldErr)
  }
  return ByteArrayInputStream(bytes).bufferedReader().readLines()
}

object NullOut : PrintStream(NullOutputStream())

class NullOutputStream : OutputStream() {
  override fun write(b: Int) = Unit
}

class TeeOutput(
  private val bytesOut: OutputStream,
  private val oldOut: PrintStream
) : OutputStream() {
  val limit = 200
  var lineLength = 0

  fun flushLine(): Boolean {
    if (lineLength > limit)
      oldOut.print(" ($lineLength chars in total)")
    val result = lineLength > 0
    lineLength = 0
    return result
  }

  override fun write(b: Int) {
    bytesOut.write(b)
    if (b == 0x0d || b == 0x0a) { // new line
      flushLine()
      oldOut.write(b)
    } else {
      lineLength++
      if (lineLength <= limit)
        oldOut.write(b)
    }
  }
}
