import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortBerlinPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="berlin"
      city="Berlin"
      state="Berlin"
      regionCode="DE-BE"
      postalCode="10115"
      latitude={52.520008}
      longitude={13.404954}
      radiusKm={180}
    />
  );
};

export default StandortBerlinPage;