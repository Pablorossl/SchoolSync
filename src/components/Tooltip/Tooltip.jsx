import { useState } from 'react'
import PropTypes from 'prop-types'
import { DURATION } from '../../constants/ui'
import './Tooltip.css'

const Tooltip = ({ children, content, position = 'top', delay = DURATION.TOOLTIP_DELAY }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)

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

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
}

Tooltip.defaultProps = {
  content: '',
  position: 'top',
  delay: DURATION.TOOLTIP_DELAY,
}

export default Tooltip
