import { configureStore, combineReducers  } from '@reduxjs/toolkit'
import { DriverReducer } from './reducers'

const rootReducer = combineReducers({
	driver_redux : DriverReducer
})

export const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>