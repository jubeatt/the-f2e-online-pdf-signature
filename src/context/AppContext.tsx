import { createContext, useReducer } from 'react'
// Types
type InitialStateType = {
  progress: number
  signatureMode: string | null
  pdfData: string | null
  pdfName: string | null
}
type AppAction = {
  type: ActionTypes
  payload: any
}
export enum ActionTypes {
  UpdateProgress = 'UPDATE_PROGRESS',
  UpdateSignatureMode = 'UPDATE_SIGNATURE_MODE',
  UpdatePdfData = 'UPDATE_PDF_DATA',
  UpdatePdfName = 'UPDATE_PDF_NAME'
}
interface AppContextInterface {
  state: InitialStateType
  dispatch: React.Dispatch<any>
}

// Reducer
const AppReducer = (state: InitialStateType, action: AppAction): InitialStateType => {
  switch (action.type) {
    case ActionTypes.UpdateProgress:
      return { ...state, progress: action.payload }
    case ActionTypes.UpdateSignatureMode:
      return { ...state, signatureMode: action.payload }
    case ActionTypes.UpdatePdfData:
      return { ...state, pdfData: action.payload }
    case ActionTypes.UpdatePdfName:
      return { ...state, pdfName: action.payload }
    default:
      return state
  }
}

// Context
const initialState: InitialStateType = {
  progress: 0,
  signatureMode: null,
  pdfData: null,
  pdfName: null
}
export const AppContext = createContext<AppContextInterface>({
  state: initialState,
  dispatch: () => null
})

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export default AppProvider
