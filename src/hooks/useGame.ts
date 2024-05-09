import { type MouseEvent, useMemo, useState } from 'react'
import type { Position, UserInput } from '../types/gameTypes'

export const useGame = () => {
  const [bombMap, setBombMap] = useState<Position[]>([])
  const [userInputs, setUserInputs] = useState<UserInput[]>([])

  const board = useMemo(() => [...Array(9)].fill([...Array(9)].fill(0)), [])

  const handleLeftClick = (position: Position) => {
    setUserInputs((prev) => [...prev, { position, type: 0 }])
  }

  const handleRightClick = (e: MouseEvent<HTMLDivElement>, position: Position) => {
    setUserInputs((prev) => [...prev, { position, type: 1 }])
  }

  return {
    board,
    handleClick: {
      left: handleLeftClick,
      right: handleRightClick,
    },
  }
}
