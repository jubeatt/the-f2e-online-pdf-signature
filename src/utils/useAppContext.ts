import { useContext } from 'react'
import { AppContext } from '@/context/AppContext'

export const useAppContext = () => {
  const { state, dispatch } = useContext(AppContext)

  // prevent someting goes wrong
  if (state === undefined) {
    throw new Error('useAppContext() must be used inside a ThemeProvider')
  }

  return { state, dispatch }
}
