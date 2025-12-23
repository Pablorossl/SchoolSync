import { useAuth } from '../../context/AuthContext'
import Header from '../../components/Header/Header'
import Calendar from '../../components/Calendar/Calendar'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Bienvenido/a, {user?.name}</h1>
          <p className="role-badge">
            {user?.role === 'teacher' ? '👨‍🏫 Profesor' : '👨‍👩‍👧 Padre/Madre'}
          </p>
        </div>

        <div className="info-panel">
          {user?.role === 'teacher' ? (
            <div className="info-card teacher-info">
              <h3>Panel de Profesor</h3>
              <p>
                Puedes añadir tareas, eventos y notas importantes al calendario.
                Los padres podrán ver toda la información que agregues.
              </p>
              <ul className="feature-list">
                <li>✅ Crear eventos en el calendario</li>
                <li>✅ Asignar tareas y fechas de entrega</li>
                <li>✅ Añadir notas importantes</li>
                <li>✅ Editar y eliminar eventos</li>
              </ul>
            </div>
          ) : (
            <div className="info-card parent-info">
              <h3>Panel de Padre/Madre</h3>
              <p>
                Aquí puedes ver todas las tareas, eventos y notas importantes
                que los profesores han agregado para tus hijos.
              </p>
              <ul className="feature-list">
                <li>👀 Ver calendario completo</li>
                <li>👀 Consultar tareas asignadas</li>
                <li>👀 Ver fechas importantes</li>
                <li>👀 Recibir notificaciones</li>
              </ul>
            </div>
          )}
        </div>

        <div className="calendar-section">
          <Calendar userRole={user?.role} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
