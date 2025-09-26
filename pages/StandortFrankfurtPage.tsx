import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortFrankfurtPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="frankfurt"
      city="Frankfurt am Main"
      state="Hessen"
      regionCode="DE-HE"
      postalCode="60311"
      latitude={50.1109}
      longitude={8.6821}
      radiusKm={130}
    />
  );
};

export default StandortFrankfurtPage;
