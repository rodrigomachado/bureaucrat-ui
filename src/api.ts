import { useEffect, useState } from "react"

import { User } from "./domainAuthorization";

/**
 * An error returned by the API.
 * Wraps multiple erros in a single object to allow for batched GQL queries.
 */
export class ApiError {
  errors: any[]

  constructor(errors: any[]) {
    this.errors = errors
  }
}

/**
 * Bridge to the API.
 */
export class Api {
  async users({ signal }: { signal: AbortSignal }): Promise<User[]> {
    const q = await this.query(`{
      users { id firstName, middleName, lastName, birthDate }
    }`, { signal })
    return q.users.map((user: any) => new User(user))
  }

  private async query(
    gql: string, { signal }: { signal: AbortSignal },
  ): Promise<any> {
    const json = await fetch('http://localhost:4000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gql }),
      signal,
    }).then((response) => response.json())
    if (json.errors) throw new ApiError(
      Array.isArray(json.errors) ? json.errors : [json.errors]
    )
    return json.data
  }
}

/**
 * Wrapper for an API calls that can be aborted.
 */
type ApiFn<S> = (signal: AbortSignal) => Promise<S>

/**
 * A React hook that calls an API function and returns the result.
 * @param apiFn A function wrapping an API call.
 * @returns The tuple `[data, loading, error, reload]`, with the result of the
 *  API call, a boolean indicating whether the call is in progress, the
 *  resulting error (if any), and a function to call the API again.
 */
export function useApi<S>(
  apiFn: ApiFn<S>,
): [S | undefined, boolean, any, () => void] {
  const [data, setData] = useState<S | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fnCall = async (signal: AbortSignal) => {
    try {
      setError(null)
      setLoading(true)
      setData(await apiFn(signal))
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const abort = new AbortController()
    fnCall(abort.signal)
    return () => abort.abort()
  }, [])

  return [data, loading, error, () => fnCall(null as any)]
}
