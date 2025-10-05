import { useState } from 'react';

export interface Map {
  year: string;
  title: string;
  name: string;
  institution: string;
  other_authors?: string;
  abstract: string;
  link: string;
  image: string;
  kind: string;
}

export default function FilterableGallery({ maps }: { maps: Map[] }) {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);
  const years = ['2025', '2023', '2022', '2021', '2020'];
  const filteredMaps = maps.filter(map => map.year === selectedYear);
  const interactiveMaps = filteredMaps.filter(map => map.kind.includes('Interactive'));
  const staticMaps = filteredMaps.filter(map => map.kind.includes('Static'));

  // Functions to handle opening and closing the modal.
  const handleOpenModal = (map: Map) => {
    setSelectedMap(map);
  };

  const handleCloseModal = () => {
    setSelectedMap(null);
  };

  return (
    <div>
      <div className="filter-controls">
        <label htmlFor="year-select">Select Map Gallery Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <h2>Interactive Maps</h2>
      <hr />
      <div className="gallery-grid">
        {interactiveMaps.map(map => (
          <div key={map.link} className="project-card" onClick={() => handleOpenModal(map)}>
            <img src={map.image} alt={map.title} className="card-image" loading="lazy" />
            <div className="card-content">
              <h3>{map.title}</h3>
              <p>{`${map.name}, ${map.institution}${map.other_authors ? '; ' + map.other_authors : ''}`}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Static Maps</h2>
      <hr />
      <div className="gallery-grid">
        {staticMaps.map(map => (
          <div key={map.link} className="project-card" onClick={() => handleOpenModal(map)}>
            <img src={map.image} alt={map.title} className="card-image" loading="lazy" />
            <div className="card-content">
              <h3>{map.title}</h3>
              <p>{`${map.name}, ${map.institution}${map.other_authors ? '; ' + map.other_authors : ''}`}</p>
            </div>
          </div>
        ))}
      </div>
      <div 
        className="modal-backdrop" 
        onClick={handleCloseModal}
        data-visible={!!selectedMap} 
      >
        {selectedMap && (
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            
            <h2>{selectedMap.title}</h2>
            <h4>{`${selectedMap.name}, ${selectedMap.institution}${selectedMap.other_authors ? '; ' + selectedMap.other_authors : ''}`}</h4>
            <a href={selectedMap.link} target="_blank" rel="noopener noreferrer">
              <img src={selectedMap.image} alt={selectedMap.title} className="modal-image" />
            </a>
            <p>{selectedMap.abstract}</p>
            <a href={selectedMap.link} className="modal-link-card" target="_blank" rel="noopener noreferrer">View Full Map &rarr;</a>
            
            
          </div>
        )}
      </div>
    </div>
  );
}