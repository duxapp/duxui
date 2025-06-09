import { createContext, useContext as useContextReact } from 'react'

export const context = /*@__PURE__*/ createContext({})

export const useStatusContext = () => useContextReact(context)
