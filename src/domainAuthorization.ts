import { Entity, EntityListData } from "./entity"

export class User implements Entity {
  id: string
  firstName: string
  middleName: string
  lastName: string
  birtDate: string

  constructor(json: any) {
    this.id = json.id
    this.firstName = json.firstName
    this.middleName = json.middleName
    this.lastName = json.lastName
    this.birtDate = json.birtDate
  }

  key(): string {
    return this.id
  }

  listData(): EntityListData {
    return {
      displayName: `${this.firstName} ${this.lastName}`,
    }
  }
}
