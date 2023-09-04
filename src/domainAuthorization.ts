import { Entity, EntityListData } from './entity'

export class User implements Entity {
  id: string
  fields: { [key: string]: any }

  constructor(json: any) {
    this.id = json.id
    this.fields = json
  }

  key(): string {
    return this.id.toString()
  }

  listData(): EntityListData {
    return {
      short: `${this.fields.firstName} ${this.fields.lastName}`,
      long: `${this.fields.firstName} ${this.fields.middleName} ${this.fields.lastName}`,
    }
  }

  field(name: string) {
    return this.fields[name]
  }
}
