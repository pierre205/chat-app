import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useThemeStore } from '../store/useThemeStore'; // Adaptez selon votre structureus allons créer ce fichier pour les styles personnalisés
import './FullCalendar.css'

const FullCalendarComponent = ({ events: initialEvents = [] }) => {
  // État pour gérer les événements
  const [events, setEvents] = useState(initialEvents);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const { theme } = useThemeStore();
  
  // Référence au calendrier pour accéder à ses méthodes
  const calendarRef = useRef(null);
  
  // Options de palette de couleurs selon le thème actuel
  const themeColors = {
    // Couleurs adaptées à différents thèmes DaisyUI
    default: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    dark: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'],
    coffee: ['#dbbc9a', '#b58c6e', '#8c5e45', '#5c3c29', '#3a2419'],
    synthwave: ['#e779c1', '#58c7f3', '#f3cc30', '#f34e5c', '#9e62e3'],
    // Ajoutez d'autres thèmes selon vos besoins
  };
  
  // Sélection de la palette selon le thème actuel
  const getColorPalette = () => {
    return themeColors[theme] || themeColors.default;
  };
  
  // Attribution d'une couleur à un nouvel événement
  const getRandomColor = () => {
    const palette = getColorPalette();
    return palette[Math.floor(Math.random() * palette.length)];
  };
  
  // Gestion des clics sur une date
  const handleDateClick = (info) => {
    const title = prompt('Entrez le titre de l\'événement:');
    if (title) {
      const newEvent = {
        id: Date.now().toString(), // ID unique basé sur timestamp
        title,
        start: info.dateStr,
        allDay: true,
        backgroundColor: getRandomColor(),
        borderColor: 'transparent'
      };
      
      setEvents(prev => [...prev, newEvent]);
    }
  };
  
  // Gestion des clics sur un créneau horaire
  const handleTimeSlotClick = (info) => {
    const title = prompt('Entrez le titre de l\'événement:');
    if (title) {
      // Calculer l'heure de fin par défaut (1 heure après le début)
      const start = info.date;
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      
      const newEvent = {
        id: Date.now().toString(),
        title,
        start,
        end,
        backgroundColor: getRandomColor(),
        borderColor: 'transparent'
      };
      
      setEvents(prev => [...prev, newEvent]);
    }
  };
  
  // Gestion du drag & drop pour déplacer un événement
  const handleEventDrop = (info) => {
    const { event } = info;
    
    setEvents(prev => 
      prev.map(e => 
        e.id === event.id 
          ? { 
              ...e, 
              start: event.start,
              end: event.end
            } 
          : e
      )
    );
  };
  
  // Gestion du redimensionnement d'un événement
  const handleEventResize = (info) => {
    const { event } = info;
    
    setEvents(prev => 
      prev.map(e => 
        e.id === event.id 
          ? { 
              ...e, 
              start: event.start,
              end: event.end
            } 
          : e
      )
    );
  };
  
  // Gestion du clic sur un événement
  const handleEventClick = (info) => {
    const { event } = info;
    
    if (window.confirm(`Voulez-vous supprimer l'événement '${event.title}' ?`)) {
      setEvents(prev => prev.filter(e => e.id !== event.id));
    }
  };
  
  // Mise à jour du thème quand il change
  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      // Forcer une mise à jour du calendrier quand le thème change
      const calendarApi = calendarEl.getApi();
      calendarApi.today(); // Astuce pour forcer une mise à jour de l'affichage
      calendarApi.changeView(currentView); // Restaurer la vue actuelle
    }
  }, [theme, currentView]);

  return (
    <div className={`calendar-container theme-${theme} rounded-box shadow-lg bg-base-100`}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        dateClick={handleDateClick}
        select={handleTimeSlotClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        aspectRatio={1.5}
        viewDidMount={(info) => setCurrentView(info.view.type)}
        buttonText={{
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          list: 'Liste'
        }}
        locale="fr" // Changez selon votre langue
        firstDay={1} // 1 = Lundi comme premier jour de la semaine
        slotMinTime="07:00:00" // Heure de début pour les vues horaires
        slotMaxTime="22:00:00" // Heure de fin pour les vues horaires
        allDayText="Journée entière"
      />
    </div>
  );
};

export default FullCalendarComponent;
