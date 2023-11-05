export class EntityMeta {
  code: string
  name: string
  titleFormat: { title: string, subtitle: string }
  fields: { [fieldName: string]: FieldMeta }

  constructor(json: any) {
    this.code = json.code
    this.name = json.name
    this.titleFormat = json.titleFormat
    this.fields = {}
    for (const f of json.fields) {
      if (this.fields[f.code]) throw new Error(
        `Field "${f.code}" defined more than once for ${this.code}`,
      )
      this.fields[f.code] = new FieldMeta(f)
    }
  }

  createEntity(): Entity {
    return {
      key: `new-${this.code}-${Math.floor(Math.random() * 10000)}`,
      typeCode: this.code,
      new: true,
      fields: {},
    }
  }

  wrapFields(fields: EntityFields): Entity {
    const entity = {
      key: this.keyFor(fields),
      typeCode: this.code,
      new: false,
      fields,
    }
    return this.validateEntity(entity)
  }

  validateEntity(entity: Entity): Entity {
    const allowed = Object.keys(this.fields)
    const declared = Object.keys(entity.fields)
    const invalid = declared.filter(x => !allowed.includes(x))
    if (invalid.length) throw new Error(
      `Invalid fields: ${invalid.join(', ')}`
    )

    // TODO WIP Assure mandatory fields are filled.

    return entity
  }

  keyFor(entityFields: EntityFields): string {
    const ids = Object.values(this.fields)
      .filter(x => x.identifier)
      .map(x => entityFields[x.code])
    if (!ids.length) throw new Error(
      `EntityType "${this.name}" has no identifiers`,
    )
    return JSON.stringify(ids.length === 1 ? ids[0] : ids)
  }

  formatTitle(data: EntityFields): EntityTitle {
    return {
      title: formatTitlePattern(this, data, this.titleFormat.title),
      subtitle: formatTitlePattern(this, data, this.titleFormat.subtitle),
    }
  }
}

export class FieldMeta {
  code: string
  name: string
  placeholder: string
  type: FieldType
  identifier: boolean
  hidden: boolean

  constructor(json: any) {
    this.code = json.code
    this.name = json.name
    this.placeholder = json.placeholder
    this.type = json.type
    this.identifier = json.identifier
    this.hidden = json.hidden
  }
}

export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
}

export type Entity = {
  key: string,
  typeCode: string,
  new: boolean,
  fields: EntityFields,
}

export type EntityFields = { [key: string]: EntityFieldValue }
export type EntityFieldValue = string | number | null | undefined

export type EntityTitle = {
  title: string,
  subtitle: string,
}

export function formatTitlePattern(
  type: EntityMeta, data: { [name: string]: any }, pattern: string,
): string {
  let match
  let formatted = pattern

  while (match = /#\{([^}]+)\}/.exec(formatted)) {
    const fieldName = match[1]
    const field = data[fieldName]
    if (!type.fields[fieldName]) throw new Error(
      `Unable to format title for entity type '${type.name}': ` +
      `Field '${fieldName}' mentioned in formatting pattern not found. ` +
      `Pattern: '${pattern}'`
    )
    formatted = formatted.replaceAll(`#{${fieldName}}`, field?.toString() || '')
  }

  return formatted
}
