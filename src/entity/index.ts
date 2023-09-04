export class EntityMeta {
  name: string
  fields: { [fieldName: string]: FieldMeta }

  constructor(json: any) {
    // TODO Validate json schema
    this.name = json.name
    this.fields = {}
    for (const f of json.fields) {
      if (this.fields[f.name]) throw new Error(`Field ${f.name} defined more than once for ${this.name}`)
      this.fields[f.name] = new FieldMeta(f)
    }
  }
}

export class FieldMeta {
  name: string
  type: FieldType

  constructor(json: any) {
    // TODO Validate json schema
    this.name = json.name
    this.type = json.type
  }
}

enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  DATE_TIME = 'datetime',
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
    for (const fieldName in this.meta.fields) {
      const meta = this.meta.fields[fieldName]
      if (!meta) throw new Error(`Field '${fieldName}' not found in entity '${this.meta.name}'`)
      this.fields[fieldName] = new Field(meta, data[fieldName])
    }
  }

  key() {
    // TODO Use EntityMeta to evaluate the entity identifier
    return this.fields.id.value
  }

  listData(): EntityListData {
    // TODO Use EntityMeta to evaluate the EntityListData
    return {
      short: `${this.fields.firstName.value} ${this.fields.lastName.value} `,
      long: `${this.fields.firstName.value} ${this.fields.middleName.value} ${this.fields.lastName.value} `,
    }
  }

  fieldValue(fieldName: string): any {
    return this.fields[fieldName].value
  }
}
export type EntityListData = {
  short: string,
  long: string,
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
