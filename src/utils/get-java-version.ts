import execa = require('execa')
import UserError from './user-error'

/** Returns the major version of the system's default Java installation. */
export default async function getJavaVersion() {
  try {
    const { stderr } = await execa('java', ['-version'])
    const majorVersionString = stderr.match(JAVA_VERSION_PATTERN)?.groups?.major
    if (!majorVersionString) {
      const message = `Could not extract Java major version from "java -version" output!\n${stderr}`
      throw new UserError(message)
    }

    return parseInt(majorVersionString)
  } catch (error) {
    if (error instanceof Error)
      throw new UserError(`${error.name}:${error.message}:${error.stack}`)

    throw error
  }
}

/**
 * Pattern for extracting the Java major version from the output of
 * `java -version` (stripping the `1.` prefix from versions prior to Java 9).
 *
 * Some example outputs with their respective versions:
 * - `openjdk version "1.8.0_292"` → `8`
 * - `openjdk version "11.0.11" 2021-04-20` → `11`
 * - `java version "15" 2020-09-15` → `15`
 */
const JAVA_VERSION_PATTERN = /"(?:1\.)?(?<major>\d+).*?"/
