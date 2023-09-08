export class EntityMeta {
  name: string
  identifierFieldName: string
  titleFormat: { title: string[], subtitle: string[] }
  fields: { [fieldName: string]: FieldMeta }

  constructor(json: any) {
    // TODO Validate json schema
    this.name = json.name
    this.identifierFieldName = json.identifierFieldName
    this.titleFormat = json.titleFormat
    this.fields = {}
    for (const f of json.fields) {
      if (this.fields[f.name]) throw new Error(`Field ${f.name} defined more than once for ${this.name}`)
      this.fields[f.name] = new FieldMeta(f)
    }
  }
}

export class FieldMeta {
  id: number
  name: string
  displayName: string
  placeholder: string
  type: FieldType
  hidden: boolean

  constructor(json: any) {
    // TODO Validate json schema
    this.id = json.id
    this.name = json.name
    this.displayName = json.displayName
    this.placeholder = json.placeholder
    this.type = json.type
    this.hidden = json.hidden
  }
}

export enum FieldType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DATE_TIME = 'DATETIME',
  TIME = 'TIME',
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
    for (const fieldName in this.meta.fields) {
      const meta = this.meta.fields[fieldName]
      if (!meta) throw new Error(`Field '${fieldName}' not found in entity '${this.meta.name}'`)
      this.fields[fieldName] = new Field(meta, data[fieldName])
    }
  }

  key() {
    return this.fields[this.meta.identifierFieldName].value
  }

  titleFormat(): EntityTitle {
    return {
      title: this.renderFieldComposition(this.meta.titleFormat.title),
      subtitle: this.renderFieldComposition(this.meta.titleFormat.subtitle),
    }
  }

  fieldValue(fieldName: string): any {
    return this.fields[fieldName].value
  }

  private renderFieldComposition(fields: string[]): string {
    return fields.map(x => `${this.fields[x].value}`).join(' ')
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
