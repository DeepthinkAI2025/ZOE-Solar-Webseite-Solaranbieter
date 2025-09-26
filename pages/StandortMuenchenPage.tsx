import React from 'react';
import StandortPage from '../components/StandortPage';

const StandortMuenchenPage: React.FC = () => {
  return (
    <StandortPage
      locationKey="muenchen"
      city="München"
      state="Bayern"
      regionCode="DE-BY"
      postalCode="80331"
      latitude={48.135125}
      longitude={11.581981}
      radiusKm={160}
    />
  );
};

export default StandortMuenchenPage;