import { useState, useEffect } from 'react'
import './Onboarding.css'

const Onboarding = ({ userRole }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya vio el tutorial
    const hasSeenTutorial = localStorage.getItem('schoolsync_tutorial_completed')
    if (!hasSeenTutorial) {
      // Mostrar después de un pequeño delay
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const steps = userRole === 'teacher' ? [
    {
      title: '¡Bienvenido, Profesor! 👨‍🏫',
      description: 'Te guiaremos por las funcionalidades principales de SchoolSync.',
      target: null,
    },
    {
      title: 'Calendario Escolar 📅',
      description: 'Aquí puedes crear eventos, tareas y exámenes. Los padres podrán verlos en tiempo real.',
      target: 'calendar',
    },
    {
      title: 'Mensajería 💬',
      description: 'Comunícate directamente con los padres. Puedes crear conversaciones y responder mensajes.',
      target: 'messaging',
    },
    {
      title: '¡Listo para empezar! 🚀',
      description: 'Explora la plataforma y comienza a gestionar tu clase de manera eficiente.',
      target: null,
    },
  ] : [
    {
      title: '¡Bienvenido, Padre/Madre! 👨‍👩‍👧',
      description: 'Te mostraremos cómo mantenerte al día con las actividades escolares de tus hijos.',
      target: null,
    },
    {
      title: 'Calendario Escolar 📅',
      description: 'Visualiza todas las tareas, eventos y fechas importantes que los profesores publican.',
      target: 'calendar',
    },
    {
      title: 'Mensajería 💬',
      description: 'Envía mensajes directos a los profesores para cualquier consulta o comentario.',
      target: 'messaging',
    },
    {
      title: '¡Todo listo! 🎉',
      description: 'Mantente informado sobre el progreso escolar de tus hijos.',
      target: null,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const handleSkip = () => {
    completeTutorial()
  }

  const completeTutorial = () => {
    localStorage.setItem('schoolsync_tutorial_completed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  const step = steps[currentStep]

  return (
    <>
      <div className="onboarding-overlay" onClick={handleSkip}></div>
      <div className="onboarding-modal" role="dialog" aria-labelledby="onboarding-title" aria-modal="true">
        <button 
          className="onboarding-close"
          onClick={handleSkip}
          aria-label="Cerrar tutorial"
        >
          ✕
        </button>

        <div className="onboarding-content">
          <h2 id="onboarding-title">{step.title}</h2>
          <p>{step.description}</p>

          <div className="onboarding-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                aria-label={`Paso ${index + 1} de ${steps.length}`}
              ></div>
            ))}
          </div>

          <div className="onboarding-actions">
            <button 
              className="btn-skip" 
              onClick={handleSkip}
              aria-label="Saltar tutorial"
            >
              Saltar
            </button>
            <button 
              className="btn-next" 
              onClick={handleNext}
              aria-label={currentStep === steps.length - 1 ? 'Finalizar tutorial' : 'Siguiente paso'}
            >
              {currentStep === steps.length - 1 ? '¡Empezar!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Onboarding
