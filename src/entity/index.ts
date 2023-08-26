export type Entity = {
  key: () => string,
  listData: () => EntityListData,
}
export type EntityListData = {
  short: string,
  long: string,
}
