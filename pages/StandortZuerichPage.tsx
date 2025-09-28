import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortZuerichPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="zuerich"
      city="Zürich"
      state="Zürich"
      regionCode="CH-ZH"
      postalCode="8001"
      latitude={47.376887}
      longitude={8.541694}
      radiusKm={90}
    />
  );
};

export default StandortZuerichPage;