export interface LandmarkLocation {
    name: string;
    displayName: string;
    lat: number;
    lon: number;
    city: string;
    country: string;
}

export const customLocations: LandmarkLocation[] = [
    {
        name: "KNUST",
        displayName: "Kwame Nkrumah University of Science and Technology",
        lat: 6.6738,
        lon: -1.5717,
        city: "Kumasi",
        country: "Ghana"
    },
    {
        name: "Legon",
        displayName: "University of Ghana",
        lat: 5.6507,
        lon: -0.1870,
        city: "Accra",
        country: "Ghana"
    },
    {
        name: "Madina",
        displayName: "Madina Market",
        lat: 5.6685,
        lon: -0.1654,
        city: "Accra",
        country: "Ghana"
    },
    {
        name: "Kwabenya",
        displayName: "Kwabenya District",
        lat: 5.6880,
        lon: -0.2220,
        city: "Accra",
        country: "Ghana"
    },
    {
        name: "Circle",
        displayName: "Kwame Nkrumah Circle",
        lat: 5.5598,
        lon: -0.2081,
        city: "Accra",
        country: "Ghana"
    },
    {
        name: "Kotoka",
        displayName: "Kotoka International Airport",
        lat: 5.6054,
        lon: -0.1670,
        city: "Accra",
        country: "Ghana"
    }
];
