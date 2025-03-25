// src/components/Calendar/EventModal.jsx
import { useState, useEffect } from 'react';

const EventModal = ({ isOpen, onClose, onSave, event = null }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [startTime, setStartTime] = useState('');
  const [end, setEnd] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      
      if (event.start) {
        const startDate = new Date(event.start);
        setStart(formatDate(startDate));
        setStartTime(formatTime(startDate));
      }
      
      if (event.end) {
        const endDate = new Date(event.end);
        setEnd(formatDate(endDate));
        setEndTime(formatTime(endDate));
      } else if (event.start) {
        // Si pas de fin, utiliser la date de début
        const startDate = new Date(event.start);
        setEnd(formatDate(startDate));
        // Ajouter 1 heure par défaut
        const endTime = new Date(startDate);
        endTime.setHours(endTime.getHours() + 1);
        setEndTime(formatTime(endTime));
      }
      
      setAllDay(event.allDay || false);
      setDescription(event.description || '');
    } else {
      resetForm();
    }
  }, [event, isOpen]);
  
  const resetForm = () => {
    setTitle('');
    setStart('');
    setStartTime('');
    setEnd('');
    setEndTime('');
    setAllDay(true);
    setDescription('');
  };
  
  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };
  
  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let startDate, endDate;
    
    if (allDay) {
      // Pour les événements toute la journée, nous utilisons juste la date
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      // Pour les événements avec heure, nous combinons date et heure
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      startDate = new Date(start);
      startDate.setHours(startHour, startMinute);
      
      endDate = new Date(end);
      endDate.setHours(endHour, endMinute);
    }
    
    onSave({
      id: event?.id || Date.now().toString(),
      title,
      start: startDate,
      end: endDate,
      allDay,
      description,
      backgroundColor: event?.backgroundColor || undefined
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg mb-4">
          {event ? 'Modifier l\'événement' : 'Nouvel événement'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Titre</span>
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full" 
              required 
            />
          </div>
          
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Journée entière</span>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date de début</span>
              </label>
              <input 
                type="date" 
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="input input-bordered w-full" 
                required 
              />
            </div>
            
            {!allDay && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Heure de début</span>
                </label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date de fin</span>
              </label>
              <input 
                type="date" 
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="input input-bordered w-full" 
                required 
              />
            </div>
            
            {!allDay && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Heure de fin</span>
                </label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered h-24" 
            />
          </div>
          
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default EventModal;
