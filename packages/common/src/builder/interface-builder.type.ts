export type InterfaceBuilder<T> = {
  [P in keyof T]: (arg: T[P]) => InterfaceBuilder<T>
} & {
  build(): T
}
