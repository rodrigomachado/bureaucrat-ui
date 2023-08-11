import { User } from "./domainAuthorization";

export class ApiError {
  errors: any[]

  constructor(errors: any[]) {
    this.errors = errors
  }
}

export class Api {
  async users(): Promise<User[]> {
    const q = await this.query(`{
      users { id firstName, middleName, lastName, birthDate }
    }`)
    return q.users.map((user: any) => new User(user))
  }

  private async query(gql: string): Promise<any> {
    const json = await fetch('http://localhost:4000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: gql }),
    }).then((response) => response.json())
    if (json.errors) throw new ApiError(
      Array.isArray(json.errors) ? json.errors : [json.errors]
    )
    return json.data
  }
}
