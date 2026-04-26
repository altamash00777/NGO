import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getCoordinates } from '../utils/mockLocations';
import { TaskCard } from './TaskCard';
import 'leaflet/dist/leaflet.css';
import './TaskMap.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when tasks change
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const TaskMap = ({ tasks, onAccept, onComplete, onRemove, showAcceptButton }) => {
  // Default to NYC coordinates if no tasks, or use the first task's coordinates
  const defaultCenter = [40.7128, -74.0060];
  const center = tasks.length > 0 ? getCoordinates(tasks[0].location) : defaultCenter;

  return (
    <div className="task-map-container glass-panel fade-in">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', borderRadius: 'var(--border-radius)' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        
        {tasks.map((task) => {
          const position = getCoordinates(task.location);
          return (
            <Marker key={task.id} position={position}>
              <Popup className="custom-popup">
                <div style={{ maxWidth: '300px', margin: '-10px' }}>
                  <TaskCard 
                    task={task} 
                    onAccept={onAccept}
                    onComplete={onComplete}
                    onRemove={onRemove}
                    showAcceptButton={showAcceptButton}
                    matchScore={task.matchScore}
                  />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
