import { authHandlers } from './authHandlers'
import { calendarHandlers } from './calendarHandlers'
import { messagingHandlers } from './messagingHandlers'

export const handlers = [
  ...authHandlers,
  ...calendarHandlers,
  ...messagingHandlers
]
