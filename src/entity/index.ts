export type Entity = {
  key: () => string,
  listData: () => EntityListData,
}
export type EntityListData = {
  displayName: string,
}
