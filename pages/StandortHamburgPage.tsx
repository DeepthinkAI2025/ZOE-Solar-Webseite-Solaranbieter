import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortHamburgPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="hamburg"
      city="Hamburg"
      state="Hamburg"
      regionCode="DE-HH"
      postalCode="20095"
      latitude={53.5511}
      longitude={9.9937}
      radiusKm={150}
    />
  );
};

export default StandortHamburgPage;
