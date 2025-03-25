// src/components/Calendar/CalendarPage.jsx
import { useState, useEffect } from 'react';
import FullCalendarComponent from '../components/FullCalendarComponent';
import EventModal from '../components/EventModal';
import { PlusCircle, Filter } from 'lucide-react'; // Nécessite lucide-react

const CalendarPage = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Réunion d\'équipe',
      start: new Date(new Date().setHours(10, 0)),
      end: new Date(new Date().setHours(11, 30)),
      backgroundColor: '#3b82f6'
    },
    {
      id: '2',
      title: 'Déjeuner d\'affaires',
      start: new Date(new Date().setDate(new Date().getDate() + 1)),
      allDay: true,
      backgroundColor: '#10b981'
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');
  const [filter, setFilter] = useState(null);
  
  // Sauvegarde et chargement des événements dans localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map(event => ({
          ...event,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : null
        }));
        setEvents(parsedEvents);
      } catch (e) {
        console.error('Erreur lors du chargement des événements:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);
  
  const handleAddEvent = () => {
    // Préparer un nouvel événement avec la date d'aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setSelectedEvent({
      start: today,
      allDay: true
    });
    setIsModalOpen(true);
  };
  
  const handleEventClick = (info) => {
    // Préparer l'événement existant pour l'édition
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end || info.event.start,
      allDay: info.event.allDay,
      description: info.event.extendedProps.description || '',
      backgroundColor: info.event.backgroundColor
    });
    setIsModalOpen(true);
  };
  
  const handleSaveEvent = (eventData) => {
    if (eventData.id && events.some(e => e.id === eventData.id)) {
      // Mettre à jour un événement existant
      setEvents(prev => prev.map(e => 
        e.id === eventData.id ? eventData : e
      ));
    } else {
      // Ajouter un nouvel événement
      setEvents(prev => [...prev, eventData]);
    }
  };
  
  const handleDeleteEvent = (eventId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0 text-base-content">Calendrier</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-sm gap-2">
              <Filter size={16} />
              Filtrer
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a onClick={() => setFilter(null)}>Tous les événements</a></li>
              <li><a onClick={() => setFilter('meeting')}>Réunions</a></li>
              <li><a onClick={() => setFilter('personal')}>Personnel</a></li>
              <li><a onClick={() => setFilter('deadline')}>Échéances</a></li>
            </ul>
          </div>
          
          <button 
            className="btn btn-primary btn-sm gap-2" 
            onClick={handleAddEvent}
          >
            <PlusCircle size={16} />
            Nouvel événement
          </button>
        </div>
      </div>
      
      <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
        <FullCalendarComponent 
          events={events}
          onEventClick={handleEventClick}
          onEventAdd={handleSaveEvent}
          onEventChange={handleSaveEvent}
          view={view}
          onViewChange={setView}
          filter={filter}
        />
      </div>
      
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={selectedEvent?.id ? () => handleDeleteEvent(selectedEvent.id) : undefined}
        event={selectedEvent}
      />
    </div>
  );
};

export default CalendarPage;
