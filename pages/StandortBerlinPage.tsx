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
      keywords={[
        "Photovoltaik Berlin",
        "Solar Berlin",
        "Solaranlagen Berlin",
        "PV-Anlage Berlin",
        "Solarstrom Berlin",
        "Solarförderung Berlin"
      ]}
      regionalOffers={[
        "Förderprogramme für Solaranlagen in Berlin",
        "Photovoltaik-Komplettpaket für Berliner Haushalte",
        "Agri-PV Lösungen für Berliner Landwirtschaft"
      ]}
      geoData={{
        city: "Berlin",
        state: "Berlin",
        postalCode: "10115",
        latitude: 52.520008,
        longitude: 13.404954
      }}
    />
  );
};

export default StandortBerlinPage;