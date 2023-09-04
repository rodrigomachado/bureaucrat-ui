export type Entity = {
  key: () => string,
  listData: () => EntityListData,
  field: (fieldName: string) => FieldValue
}
export type EntityListData = {
  short: string,
  long: string,
}

export type FieldValue = any
