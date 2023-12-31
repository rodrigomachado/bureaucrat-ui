import React, { useEffect, useState } from 'react'

import { Entity, EntityFields, EntityMeta } from './entity'
import { useErrorEmitter } from './lib/error'

/**
 * Bridge to the API.
 */
export class Api {
  /**
   * Fetches all `entityTypes` from the API.
   */
  async entityTypes(
    { signal }: { signal?: AbortSignal },
  ): Promise<EntityMeta[]> {
    const r = await this.request(`{
      entityTypes {
        code
        name
        titleFormat { title subtitle }
        fields {
          code name placeholder type identifier hidden mandatory generated
        }
      }
    }`, { signal })
    return r.entityTypes.map((m: any) => new EntityMeta(m))
  }

  /**
   * Fetches all entities for a particular `entityType`.
   */
  async entities(
    { entityType, signal }: { entityType: EntityMeta, signal?: AbortSignal },
  ): Promise<Entity[]> {
    const r = await this.request(`
      query ($entityType: String) {
        entities(entityType: $entityType)
      }
    `, { variables: { entityType: entityType.code }, signal })
    return r.entities.map((fields: any) => entityType.wrapFields(fields))
  }

  /**
   * Creates an `entity` of a paticular `entityType` with the given data.
   */
  async createEntity({ entityType, entity, signal }: {
    entityType: EntityMeta, entity: Entity, signal?: AbortSignal,
  }): Promise<Entity> {
    const r = await this.request(`
      mutation ($code: String, $data: JSONObject) {
        entityCreate(entityTypeCode: $code, data: $data)
      }
    `, { variables: { code: entityType.code, data: entity.fields }, signal })
    return entityType.validateEntity(entityType.wrapFields(r.entityCreate))
  }

  /**
   * Updates an `entity` of a particular `entityType`.
   */
  async updateEntity({
    entityType, entity, signal,
  }: {
    entityType: EntityMeta, entity: Entity, signal?: AbortSignal,
  }): Promise<Entity> {
    const r = await this.request(`
      mutation ($code: String, $data: JSONObject) {
        entityUpdate(entityTypeCode: $code, data: $data)
      }
    `, { variables: { code: entityType.code, data: entity.fields }, signal })
    return entityType.validateEntity(entityType.wrapFields(r.entityUpdate))
  }

  /**
   * Deletes an `entity` of a particular `entityType`.
   * The `entity` to be deleted is identified by an idenfier object containing
   * the values for every identifier field of the entity type.
   */
  async deleteEntity({
    entityType, entityId, signal,
  }: {
    entityType: EntityMeta, entityId: EntityFields, signal?: AbortSignal,
  }): Promise<void> {
    await this.request(`
      mutation ($code: String, $id: JSONObject) {
        entityDelete(entityTypeCode: $code, id: $id)
      }
    `, { variables: { code: entityType.code, id: entityId }, signal })
  }

  /**
   * Performs an API GQL query with abort and error handling capabilities.
   */
  private async request(
    gql: string,
    { variables, signal }: { variables?: any, signal?: AbortSignal },
  ): Promise<any> {
    const json = await fetch('http://localhost:4000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gql, variables }),
      signal,
    }).then((response) => response.json())
    if (json.errors) throw new ApiError(
      Array.isArray(json.errors) ? json.errors : [json.errors]
    )
    return json.data
  }
}

/**
 * Data and data fetching status/utilities.
 */
export type ApiData<S> = {
  data: S | undefined,
  loading: boolean,
  error: any,
  reload: () => Promise<void>,
}

/**
 * Wrapper for API calls that can be aborted.
 */
type ApiFn<S> = (signal: AbortSignal) => Promise<S>

/**
 * A React hook that calls an API function and returns the result.
 * @param apiFn A function wrapping an API call.
 * @param deps The API call will only execute when the dependencies changes
 * @returns The tuple `[data, loading, error, reload]`, with the result of the
 *  API call, a boolean indicating whether the call is in progress, the
 *  resulting error (if any), and a function to call the API again.
 */
export function useQueryApi<S>(
  apiFn: ApiFn<S>, deps: React.DependencyList = []
): ApiData<S> {
  const [data, setData] = useState<S | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  const emitError = useErrorEmitter()

  const fnCall = async (signal: AbortSignal) => {
    setError(null)
    setLoading(true)
    try {
      setData(await apiFn(signal))
      setLoading(false)
      setError(null)
    } catch (err: any) {
      if (signal?.aborted) return
      setLoading(false)
      setError(err)
      emitError(err)
    }
  }

  useEffect(() => {
    const abort = new AbortController()
    fnCall(abort.signal)
    return () => abort.abort()
  }, deps)

  const reload = () => fnCall(null as any)
  return { data, loading, error, reload }
}

/**
 * An error returned by the API.
 * Wraps multiple erros in a single object to allow for batched GQL queries.
 */
export class ApiError {
  errors: any[]

  constructor(errors: any[]) {
    this.errors = errors
  }

  toString() {
    if (!this.errors.length) {
      return 'ApiError: ---'
    }
    if (this.errors.length === 1) {
      return 'ApiError: ' + errorToString(this.errors[0])
    }
    return `ApiError: ${this.errors.map(errorToString).join(' :: ')}`
  }
}

function errorToString(error: any): string {
  if (error.message) return error.message
  return error.toString()
}
