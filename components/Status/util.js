import { createContext, useContext as useContextReact } from 'react'

export const context = createContext({})

export const useStatusContext = () => useContextReact(context)
