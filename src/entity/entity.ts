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

  validateEntity(entity: Entity): Entity {
    const dataFieldsCount = Object.keys(entity).length
    const metaFieldsCount = Object.keys(this.fields).length
    if (dataFieldsCount !== metaFieldsCount) throw new Error(
      'Fields length does not match: ' +
      `${metaFieldsCount} fields on metadata for ${this.name},` +
      ` ${dataFieldsCount} fields on providade data`
    )
    for (const fieldCode in this.fields) {
      const meta = this.fields[fieldCode]
      if (!meta) throw new Error(
        `Field '${fieldCode}' not found in entity '${this.code}'`,
      )
    }
    return entity
  }

  keyFor(entity: Entity): string {
    const ids = Object.values(this.fields)
      .filter(x => x.identifier)
      .map(x => entity[x.code])
    if (!ids.length) throw new Error(
      `EntityType "${this.name}" has no identifiers`,
    )
    return JSON.stringify(ids.length === 1 ? ids[0] : ids)
  }

  formatTitle(data: { [k: string]: any }): EntityTitle {
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
  [field: string]: any
}

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
