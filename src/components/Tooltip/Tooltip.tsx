import { useState, type ReactNode } from 'react'
import { DURATION } from '../../constants/ui'
import './Tooltip.css'

/**
 * Posiciones disponibles para el tooltip
 */
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

/**
 * Props del componente Tooltip
 */
interface TooltipProps {
  /** Elemento hijo que activará el tooltip */
  children: ReactNode
  /** Contenido del tooltip */
  content?: ReactNode
  /** Posición del tooltip relativa al elemento */
  position?: TooltipPosition
  /** Delay antes de mostrar el tooltip (ms) */
  delay?: number
}

/**
 * Componente Tooltip - Muestra información contextual al hacer hover
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  delay = DURATION.TOOLTIP_DELAY 
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setIsVisible(false)
  }

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div 
          className={`tooltip tooltip-${position}`}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
