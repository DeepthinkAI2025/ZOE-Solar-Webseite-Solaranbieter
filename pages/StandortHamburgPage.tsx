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
      keywords={[
        "Photovoltaik Hamburg",
        "Solar Hamburg",
        "Solaranlagen Hamburg",
        "PV-Anlage Hamburg",
        "Solarstrom Hamburg",
        "Solarförderung Hamburg"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in Hamburg",
        "Photovoltaik-Komplettpaket für Hamburger Haushalte",
        "Agri-PV Lösungen für Hamburger Landwirtschaft"
      ]}
      geoData={{
        city: "Hamburg",
        state: "Hamburg",
        postalCode: "20095",
        latitude: 53.5511,
        longitude: 9.9937
      }}
    />
  );
};

export default StandortHamburgPage;
