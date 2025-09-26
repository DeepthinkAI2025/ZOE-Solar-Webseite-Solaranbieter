import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortStuttgartPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="stuttgart"
      city="Stuttgart"
      state="Baden-Württemberg"
      regionCode="DE-BW"
      postalCode="70173"
      latitude={48.7758}
      longitude={9.1829}
      radiusKm={120}
    />
  );
};

export default StandortStuttgartPage;
