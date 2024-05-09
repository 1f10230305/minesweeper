export type Position = { x: number; y: number }

export type InputType = 0 | 1

export type UserInput = {
  position: Position
  type: InputType
}

export type Board = number[][]
