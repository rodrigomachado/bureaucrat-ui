export class EntityMeta {
  id: number
  name: string
  code: string
  titleFormat: { title: string, subtitle: string }
  fields: { [fieldName: string]: FieldMeta }

  constructor(json: any) {
    // TODO Validate json schema
    this.id = json.id
    this.name = json.name
    this.code = json.code
    this.titleFormat = json.titleFormat
    this.fields = {}
    for (const f of json.fields) {
      if (this.fields[f.code]) throw new Error(`Field "${f.code}" defined more than once for ${this.code}`)
      this.fields[f.code] = new FieldMeta(f)
    }
  }
}

export class FieldMeta {
  id: number
  name: string
  code: string
  placeholder: string
  type: FieldType
  identifier: boolean
  hidden: boolean

  constructor(json: any) {
    // TODO Validate json schema
    this.id = json.id
    this.name = json.name
    this.code = json.code
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

export class Entity {
  meta: EntityMeta
  fields: { [fieldName: string]: Field }


  constructor(meta: EntityMeta, data: any) {
    const dataFieldsCount = Object.keys(data).length
    const metaFieldsCount = Object.keys(meta.fields).length
    if (dataFieldsCount !== metaFieldsCount) throw new Error(
      `Fields length does not match: ${metaFieldsCount} fields on metadata for ${meta.name},` +
      ` ${dataFieldsCount} fields on providade data`
    )

    this.meta = meta
    this.fields = {}
    for (const fieldCode in this.meta.fields) {
      const meta = this.meta.fields[fieldCode]
      if (!meta) throw new Error(`Field '${fieldCode}' not found in entity '${this.meta.code}'`)
      this.fields[fieldCode] = new Field(meta, data[fieldCode])
    }
  }

  key() {
    // TODO Should the key derivation function be cached?
    const ids = Object.values(this.fields).filter(x => x.meta.identifier).map(x => x.value)
    if (!ids.length) throw new Error(`EntityType "${this.meta.name}" has no identifiers`)
    return JSON.stringify(ids.length === 1 ? ids[0] : ids)
  }

  titleFormat(): EntityTitle {
    return {
      title: this.formatTitlePattern(this.meta.titleFormat.title),
      subtitle: this.formatTitlePattern(this.meta.titleFormat.subtitle),
    }
  }

  fieldValue(fieldName: string): any {
    return this.fields[fieldName].value
  }

  private formatTitlePattern(pattern: string): string {
    let match
    let formatted = pattern

    while (match = /#\{([^}]+)\}/.exec(formatted)) {
      const fieldName = match[1]
      const field = this.fields[fieldName]
      if (!field) throw new Error(
        `Unable to format title for entity type "${this.meta.name}: "` +
        `Field "${fieldName}" mentioned in formatting pattern "${pattern}" not found.`
      )
      formatted = formatted.replaceAll(`#{${fieldName}}`, field.value?.toString() || '')
    }

    return formatted
  }
}
export type EntityTitle = {
  title: string,
  subtitle: string,
}

export class Field {
  meta: FieldMeta
  value: any

  constructor(meta: FieldMeta, value: any) {
    // TODO Validate value against metadata?
    this.meta = meta
    this.value = value
  }
}
