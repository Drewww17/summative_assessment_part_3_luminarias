"use client";
import { useState, useEffect } from 'react';

// --- A. IMAGE MAPPINGS (2025 GRID - .webp format) ---
// Ensure your images in /public/drivers and /public/teams match these names exactly.
const teamLogos = {
  "McLaren": "/teams/mclaren.webp",
  "Red Bull": "/teams/redbull.webp",
  "Ferrari": "/teams/ferrari.webp",
  "Mercedes": "/teams/mercedes.webp",
  "Aston Martin": "/teams/astonmartin.webp",
  "Alpine": "/teams/alpine.webp",
  "Williams": "/teams/willaims.webp",
  "RB": "/teams/rb.webp",
  "Haas F1 Team": "/teams/haas.webp",
  "Sauber": "/teams/sauber.webp"
};

const driverPhotos = {
  // Top Teams
  "Norris": "/drivers/norris.webp",
  "Piastri": "/drivers/piastri.webp",
  "Verstappen": "/drivers/verstappen.webp",
  "Lawson": "/drivers/lawson.webp", 
  "Leclerc": "/drivers/leclerc.webp",
  "Hamilton": "/drivers/hamilton.webp", 
  "Russell": "/drivers/russel.webp",
  "Antonelli": "/drivers/antonelli.webp", 

  // Midfield
  "Alonso": "/drivers/alonso.webp",
  "Stroll": "/drivers/stroll.webp",
  "Gasly": "/drivers/gasly.webp",
  "Doohan": "/drivers/doohan.webp", 
  "Albon": "/drivers/albon.webp",
  "Sainz": "/drivers/sainz.webp",   

  // Backmarkers
  "Tsunoda": "/drivers/tsunoda.webp",
  "Hadjar": "/drivers/hadjar.webp", 
  "Hulkenberg": "/drivers/hulkenberg.webp", 
  "Bortoleto": "/drivers/bortoleto.webp",   
  "Ocon": "/drivers/ocon.webp",     
  "Bearman": "/drivers/bearman.webp",
  "Colapinto": "/drivers/doohan.webp"
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ 
    nextRace: null, 
    lastRace: null, 
    driverStandings: [], 
    constructorStandings: [],
    raceList: []
  });
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [races2025, setRaces2025] = useState([]);
  const [error, setError] = useState(null);

  // 2025 Final Driver Standings with race-by-race results
  const driverStandings2025Full = [
    { pos: 1, driver: "Norris", firstName: "Lando", team: "McLaren", points: 423, wins: 8, podiums: 15, nationality: "GBR",
      results: [1,2,2,2,2,2,3,1,2,4,1,1,2,1,2,4,5,3,2,1,1,2,3,3] },
    { pos: 2, driver: "Verstappen", firstName: "Max", team: "Red Bull", points: 421, wins: 9, podiums: 14, nationality: "NED",
      results: [5,4,1,3,4,3,1,4,3,3,2,3,4,2,4,1,1,4,1,2,3,1,1,1] },
    { pos: 3, driver: "Piastri", firstName: "Oscar", team: "McLaren", points: 410, wins: 7, podiums: 16, nationality: "AUS",
      results: [2,1,3,1,1,1,2,2,1,2,3,2,1,3,1,2,2,2,3,3,2,3,2,2] },
    { pos: 4, driver: "Russell", firstName: "George", team: "Mercedes", points: 319, wins: 2, podiums: 10, nationality: "GBR",
      results: [3,3,4,4,3,4,4,3,4,1,4,4,3,4,3,3,3,1,4,4,4,4,4,5] },
    { pos: 5, driver: "Leclerc", firstName: "Charles", team: "Ferrari", points: 242, wins: 0, podiums: 5, nationality: "MON",
      results: [4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,5,5,5,5,5,5,4] },
    { pos: 6, driver: "Hamilton", firstName: "Lewis", team: "Ferrari", points: 156, wins: 0, podiums: 1, nationality: "GBR",
      results: [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,8] },
    { pos: 7, driver: "Antonelli", firstName: "Kimi", team: "Mercedes", points: 150, wins: 0, podiums: 0, nationality: "ITA",
      results: [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,15] },
    { pos: 8, driver: "Albon", firstName: "Alex", team: "Williams", points: 73, wins: 0, podiums: 0, nationality: "THA",
      results: [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16] },
    { pos: 9, driver: "Sainz", firstName: "Carlos", team: "Williams", points: 64, wins: 0, podiums: 0, nationality: "ESP",
      results: [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,13] },
    { pos: 10, driver: "Alonso", firstName: "Fernando", team: "Aston Martin", points: 56, wins: 0, podiums: 0, nationality: "ESP",
      results: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6] },
    { pos: 11, driver: "Hulkenberg", firstName: "Nico", team: "Sauber", points: 51, wins: 0, podiums: 0, nationality: "GER",
      results: [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,9] },
    { pos: 12, driver: "Hadjar", firstName: "Isack", team: "RB", points: 51, wins: 0, podiums: 0, nationality: "FRA",
      results: [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17] },
    { pos: 13, driver: "Bearman", firstName: "Oliver", team: "Haas F1 Team", points: 41, wins: 0, podiums: 0, nationality: "GBR",
      results: [13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12] },
    { pos: 14, driver: "Lawson", firstName: "Liam", team: "RB", points: 38, wins: 0, podiums: 0, nationality: "NZL",
      results: [14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,18] },
    { pos: 15, driver: "Ocon", firstName: "Esteban", team: "Haas F1 Team", points: 38, wins: 0, podiums: 0, nationality: "FRA",
      results: [15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,7] },
    { pos: 16, driver: "Stroll", firstName: "Lance", team: "Aston Martin", points: 33, wins: 0, podiums: 0, nationality: "CAN",
      results: [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,10] },
    { pos: 17, driver: "Tsunoda", firstName: "Yuki", team: "Red Bull", points: 33, wins: 0, podiums: 0, nationality: "JPN",
      results: [17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,14] },
    { pos: 18, driver: "Gasly", firstName: "Pierre", team: "Alpine", points: 22, wins: 0, podiums: 0, nationality: "FRA",
      results: [18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,18,19] },
    { pos: 19, driver: "Bortoleto", firstName: "Gabriel", team: "Sauber", points: 19, wins: 0, podiums: 0, nationality: "BRA",
      results: [19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,11] },
    { pos: 20, driver: "Colapinto", firstName: "Franco", team: "Alpine", points: 0, wins: 0, podiums: 0, nationality: "ARG",
      results: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20] },
    { pos: 21, driver: "Doohan", firstName: "Jack", team: "Alpine", points: 0, wins: 0, podiums: 0, nationality: "AUS",
      results: ["DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF","DNF"] }
  ];

  // 2026 F1 Race Calendar (Official Schedule)
  const schedule2026 = [
    { round: 0, name: "Pre-Season Testing 1", location: "Bahrain", circuit: "Bahrain International Circuit", date: "11-13 Feb", status: "testing" },
    { round: 0, name: "Pre-Season Testing 2", location: "Bahrain", circuit: "Bahrain International Circuit", date: "18-20 Feb", status: "testing" },
    { round: 1, name: "Australian Grand Prix", location: "Australia", circuit: "Albert Park Circuit", date: "06-08 Mar", status: "upcoming" },
    { round: 2, name: "Chinese Grand Prix", location: "China", circuit: "Shanghai International Circuit", date: "13-15 Mar", status: "upcoming" },
    { round: 3, name: "Japanese Grand Prix", location: "Japan", circuit: "Suzuka Circuit", date: "27-29 Mar", status: "upcoming" },
    { round: 4, name: "Bahrain Grand Prix", location: "Bahrain", circuit: "Bahrain International Circuit", date: "10-12 Apr", status: "upcoming" },
    { round: 5, name: "Saudi Arabian Grand Prix", location: "Saudi Arabia", circuit: "Jeddah Corniche Circuit", date: "17-19 Apr", status: "upcoming" },
    { round: 6, name: "Miami Grand Prix", location: "Miami", circuit: "Miami International Autodrome", date: "01-03 May", status: "upcoming" },
    { round: 7, name: "Canadian Grand Prix", location: "Canada", circuit: "Circuit Gilles Villeneuve", date: "22-24 May", status: "upcoming" },
    { round: 8, name: "Monaco Grand Prix", location: "Monaco", circuit: "Circuit de Monaco", date: "05-07 Jun", status: "upcoming" },
    { round: 9, name: "Spanish Grand Prix", location: "Barcelona", circuit: "Circuit de Barcelona-Catalunya", date: "12-14 Jun", status: "upcoming" },
    { round: 10, name: "Austrian Grand Prix", location: "Austria", circuit: "Red Bull Ring", date: "26-28 Jun", status: "upcoming" },
    { round: 11, name: "British Grand Prix", location: "Great Britain", circuit: "Silverstone Circuit", date: "03-05 Jul", status: "upcoming" },
    { round: 12, name: "Belgian Grand Prix", location: "Belgium", circuit: "Circuit de Spa-Francorchamps", date: "17-19 Jul", status: "upcoming" },
    { round: 13, name: "Hungarian Grand Prix", location: "Hungary", circuit: "Hungaroring", date: "24-26 Jul", status: "upcoming" },
    { round: 14, name: "Dutch Grand Prix", location: "Netherlands", circuit: "Circuit Zandvoort", date: "21-23 Aug", status: "upcoming" },
    { round: 15, name: "Italian Grand Prix", location: "Italy", circuit: "Autodromo Nazionale Monza", date: "04-06 Sep", status: "upcoming" },
    { round: 16, name: "Spanish Grand Prix", location: "Spain", circuit: "TBC", date: "11-13 Sep", status: "upcoming" },
    { round: 17, name: "Azerbaijan Grand Prix", location: "Azerbaijan", circuit: "Baku City Circuit", date: "24-26 Sep", status: "upcoming" },
    { round: 18, name: "Singapore Grand Prix", location: "Singapore", circuit: "Marina Bay Street Circuit", date: "09-11 Oct", status: "upcoming" },
    { round: 19, name: "United States Grand Prix", location: "United States", circuit: "Circuit of The Americas", date: "23-25 Oct", status: "upcoming" },
    { round: 20, name: "Mexico City Grand Prix", location: "Mexico", circuit: "Autódromo Hermanos Rodríguez", date: "30 Oct-01 Nov", status: "upcoming" },
    { round: 21, name: "São Paulo Grand Prix", location: "Brazil", circuit: "Autódromo José Carlos Pace", date: "06-08 Nov", status: "upcoming" },
    { round: 22, name: "Las Vegas Grand Prix", location: "Las Vegas", circuit: "Las Vegas Strip Circuit", date: "19-21 Nov", status: "upcoming" },
    { round: 23, name: "Qatar Grand Prix", location: "Qatar", circuit: "Lusail International Circuit", date: "27-29 Nov", status: "upcoming" },
    { round: 24, name: "Abu Dhabi Grand Prix", location: "Abu Dhabi", circuit: "Yas Marina Circuit", date: "04-06 Dec", status: "upcoming" }
  ];

  // 2025 Constructor Standings with driver breakdown
  const constructorStandings2025Full = [
    { pos: 1, team: "McLaren", points: 833, wins: 15, podiums: 31,
      drivers: [
        { name: "Norris", points: 423, wins: 8 },
        { name: "Piastri", points: 410, wins: 7 }
      ],
      racePoints: [43,43,33,43,43,43,33,43,43,30,43,43,43,43,43,30,25,33,33,43,43,33,33,33]
    },
    { pos: 2, team: "Mercedes", points: 469, wins: 2, podiums: 10,
      drivers: [
        { name: "Russell", points: 319, wins: 2 },
        { name: "Antonelli", points: 150, wins: 0 }
      ],
      racePoints: [21,21,18,18,21,18,18,21,18,33,18,18,21,18,21,21,21,33,18,18,18,18,18,12]
    },
    { pos: 3, team: "Red Bull", points: 451, wins: 9, podiums: 14,
      drivers: [
        { name: "Verstappen", points: 421, wins: 9 },
        { name: "Tsunoda", points: 33, wins: 0 }
      ],
      racePoints: [12,15,27,18,15,18,27,15,18,18,22,18,15,22,15,27,27,15,27,22,18,27,27,27]
    },
    { pos: 4, team: "Ferrari", points: 398, wins: 0, podiums: 6,
      drivers: [
        { name: "Leclerc", points: 242, wins: 0 },
        { name: "Hamilton", points: 156, wins: 0 }
      ],
      racePoints: [20,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,20,16,16,16,16,16,16,16]
    },
    { pos: 5, team: "Williams", points: 137, wins: 0, podiums: 0,
      drivers: [
        { name: "Albon", points: 73, wins: 0 },
        { name: "Sainz", points: 64, wins: 0 }
      ],
      racePoints: [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4]
    },
    { pos: 6, team: "RB", points: 92, wins: 0, podiums: 0,
      drivers: [
        { name: "Hadjar", points: 51, wins: 0 },
        { name: "Lawson", points: 38, wins: 0 }
      ],
      racePoints: [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2]
    },
    { pos: 7, team: "Aston Martin", points: 89, wins: 0, podiums: 0,
      drivers: [
        { name: "Alonso", points: 56, wins: 0 },
        { name: "Stroll", points: 33, wins: 0 }
      ],
      racePoints: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11]
    },
    { pos: 8, team: "Haas F1 Team", points: 79, wins: 0, podiums: 0,
      drivers: [
        { name: "Bearman", points: 41, wins: 0 },
        { name: "Ocon", points: 38, wins: 0 }
      ],
      racePoints: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,9]
    },
    { pos: 9, team: "Sauber", points: 70, wins: 0, podiums: 0,
      drivers: [
        { name: "Hulkenberg", points: 51, wins: 0 },
        { name: "Bortoleto", points: 19, wins: 0 }
      ],
      racePoints: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5]
    },
    { pos: 10, team: "Alpine", points: 22, wins: 0, podiums: 0,
      drivers: [
        { name: "Gasly", points: 22, wins: 0 },
        { name: "Colapinto", points: 0, wins: 0 }
      ],
      racePoints: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
  ];

  // 1. Splash Screen Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return old + 10;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // 2. Load 2025 F1 Season Data from API
  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        const BASE = "https://api.jolpi.ca/ergast/f1";
        
        // 1. Fetch Races for 2025 Season
        const racesRes = await fetch(`${BASE}/2025.json`);
        const racesData = await racesRes.json();
        const racesArray = racesData.MRData?.RaceTable?.Races || [];
        setRaces2025(racesArray);

        // 2. Fetch Driver Standings for 2025
        const driverRes = await fetch(`${BASE}/2025/driverStandings.json`);
        const driverData = await driverRes.json();
        let driverStandings = driverData.MRData?.StandingsTable?.StandingsList?.[0]?.DriverStandings || [];
        
        // Use hardcoded 2025 data if API returns empty (season ended)
        if (driverStandings.length === 0) {
          driverStandings = driverStandings2025Full.map(d => ({
            position: d.pos.toString(),
            points: d.points.toString(),
            wins: d.wins.toString(),
            Driver: {
              givenName: d.firstName,
              familyName: d.driver,
              driverId: d.driver.toLowerCase()
            },
            Constructors: [{ name: d.team }]
          }));
        }

        // 3. Fetch Constructor Standings for 2025
        const constructorRes = await fetch(`${BASE}/2025/constructorStandings.json`);
        const constructorData = await constructorRes.json();
        let constructorStandings = constructorData.MRData?.StandingsTable?.StandingsList?.[0]?.ConstructorStandings || [];
        
        // Use hardcoded 2025 data if API returns empty
        if (constructorStandings.length === 0) {
          constructorStandings = constructorStandings2025Full.map(c => ({
            position: c.pos.toString(),
            points: c.points.toString(),
            wins: c.wins.toString(),
            Constructor: {
              name: c.team,
              constructorId: c.team.toLowerCase().replace(/\s+/g, '')
            }
          }));
        }

        // 4. Fetch Last Race Results
        const lastRaceNum = racesArray.length > 0 ? racesArray[racesArray.length - 1].round : 24;
        const lastRaceRes = await fetch(`${BASE}/2025/${lastRaceNum}/results.json`);
        const lastRaceData = await lastRaceRes.json();
        const lastRace = lastRaceData.MRData?.RaceTable?.Races?.[0] || null;

        // 5. Fetch Next Race - use last race as fallback if next race unavailable (2026 not started)
        let nextRace = null;
        try {
          const nextRaceRes = await fetch(`${BASE}/current/next.json`);
          const nextRaceData = await nextRaceRes.json();
          nextRace = nextRaceData.MRData?.RaceTable?.Races?.[0] || null;
        } catch (e) {
          console.log("Next race unavailable (2026 season not started), using latest 2025 race as preview");
          nextRace = lastRace;
        }

        // If still no next race, use the last race from 2025 array
        if (!nextRace && racesArray.length > 0) {
          nextRace = racesArray[racesArray.length - 1];
        }

        setData({
          nextRace: nextRace,
          lastRace: lastRace,
          driverStandings: driverStandings,
          constructorStandings: constructorStandings,
          raceList: racesArray
        });

      } catch (e) { 
        console.error("API Error:", e);
        setError("Showing 2025 season data as reference for 2026 (season not started).");
        
        // Use all hardcoded data on complete API failure
        const driverStandings = driverStandings2025Full.map(d => ({
          position: d.pos.toString(),
          points: d.points.toString(),
          wins: d.wins.toString(),
          Driver: {
            givenName: d.firstName,
            familyName: d.driver,
            driverId: d.driver.toLowerCase()
          },
          Constructors: [{ name: d.team }]
        }));
        
        const constructorStandings = constructorStandings2025Full.map(c => ({
          position: c.pos.toString(),
          points: c.points.toString(),
          wins: c.wins.toString(),
          Constructor: {
            name: c.team,
            constructorId: c.team.toLowerCase().replace(/\s+/g, '')
          }
        }));
        
        setData({
          nextRace: null,
          lastRace: null,
          driverStandings: driverStandings,
          constructorStandings: constructorStandings,
          raceList: []
        });
      }
    }
    fetchData();
  }, []);

  // --- HELPER TO GET IMAGES SAFELY ---
  const getTeamLogo = (teamName) => {
    // Handle variations in team names from the API
    if (teamName.includes("Alpine")) return teamLogos["Alpine"];
    if (teamName.includes("Haas")) return teamLogos["Haas F1 Team"];
    if (teamName.includes("RB")) return teamLogos["RB"];
    if (teamName.includes("Sauber") || teamName.includes("Kick")) return teamLogos["Sauber"];
    // Fallback to car image if logo is missing
    return teamLogos[teamName] || '/f1-car.png'; 
  };

  const getDriverPhoto = (lastName) => {
    // Fallback to car image if photo is missing
    return driverPhotos[lastName] || '/f1-car.png';
  };

  // Pre-computed particle positions to avoid hydration mismatch
  const particles = [
    { left: 5, top: 10, duration: 4.2, delay: 0.3 },
    { left: 15, top: 25, duration: 5.1, delay: 1.2 },
    { left: 25, top: 80, duration: 3.8, delay: 0.7 },
    { left: 35, top: 45, duration: 6.2, delay: 1.8 },
    { left: 45, top: 15, duration: 4.5, delay: 0.1 },
    { left: 55, top: 70, duration: 5.8, delay: 1.5 },
    { left: 65, top: 30, duration: 3.2, delay: 0.9 },
    { left: 75, top: 55, duration: 6.8, delay: 0.4 },
    { left: 85, top: 90, duration: 4.1, delay: 1.1 },
    { left: 95, top: 40, duration: 5.5, delay: 0.6 },
    { left: 10, top: 60, duration: 3.5, delay: 1.9 },
    { left: 20, top: 5, duration: 6.1, delay: 0.2 },
    { left: 30, top: 75, duration: 4.8, delay: 1.4 },
    { left: 40, top: 20, duration: 5.3, delay: 0.8 },
    { left: 50, top: 85, duration: 3.9, delay: 1.6 },
    { left: 60, top: 35, duration: 6.5, delay: 0.5 },
    { left: 70, top: 65, duration: 4.3, delay: 1.3 },
    { left: 80, top: 50, duration: 5.7, delay: 0.0 },
    { left: 90, top: 95, duration: 3.6, delay: 1.7 },
    { left: 98, top: 12, duration: 6.3, delay: 1.0 }
  ];

  // --- RENDER SPLASH SCREEN ---
  if (loading) {
    return (
      <div className={`splash-container ${progress === 100 ? 'animate-splash-exit' : ''}`}>
        {/* Background particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full opacity-30"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
        
        {/* Splash Image */}
        <img 
            src="/f1-car.png" 
            alt="F1 Car" 
            className="animate-float relative z-10" 
            style={{ maxWidth: '70%', maxHeight: '350px', objectFit: 'contain', filter: 'drop-shadow(0 0 80px rgba(225, 6, 0, 0.4))' }} 
        />
        <h1 className="text-4xl md:text-5xl font-black mt-10 tracking-tight text-white relative z-10">
          <span className="text-gradient">F1 INSIGHTS</span> <span className="text-red-500">2026</span>
        </h1>
        <p className="text-gray-600 mt-4 uppercase tracking-[0.4em] text-xs font-medium">Loading Experience</p>
        <div className="loading-bar mt-8">
            <div className="loading-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-gray-700 text-xs mt-4 font-mono">{progress}%</p>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40"></div>
      <div className="fixed inset-0 bg-radial pointer-events-none"></div>
      
      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="header glass rounded-3xl p-6 md:p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6 animate-slide-up">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="text-gradient">F1</span> <span className="text-red-500 text-glow">INSIGHTS</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-sm mt-2 tracking-widest uppercase">Official Data Partner Integration</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-2 md:gap-3 text-xs md:text-sm font-semibold uppercase tracking-wider">
            <button onClick={() => setActiveTab('home')} className={`btn-nav ${activeTab === 'home' ? 'active text-red-500' : 'text-gray-400 hover:text-white'}`}>Home</button>
            <button onClick={() => setActiveTab('drivers')} className={`btn-nav ${activeTab === 'drivers' ? 'active text-red-500' : 'text-gray-400 hover:text-white'}`}>Drivers</button>
            <button onClick={() => setActiveTab('constructors')} className={`btn-nav ${activeTab === 'constructors' ? 'active text-red-500' : 'text-gray-400 hover:text-white'}`}>Constructors</button>
            <button onClick={() => setActiveTab('schedule')} className={`btn-nav ${activeTab === 'schedule' ? 'active text-red-500' : 'text-gray-400 hover:text-white'}`}>Schedule</button>
            <button onClick={() => setActiveTab('results')} className={`btn-nav ${activeTab === 'results' ? 'active text-red-500' : 'text-gray-400 hover:text-white'}`}>Results</button>
          </nav>
        </header>

      {/* ==================== SCHEDULE TAB ==================== */}
      {activeTab === 'schedule' && (
        <div className="animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-black mb-8 section-title">
            <span className="text-gradient">2026 F1 Season</span> <span className="text-red-500">Race Calendar</span>
          </h2>
          
          {/* Season Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 stagger-children">
            <div className="card p-6 text-center group hover:glow-red transition-all duration-300">
              <div className="card-glow top-0 left-1/2 -translate-x-1/2"></div>
              <div className="text-4xl md:text-5xl font-black stat-number red">24</div>
              <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-3 tracking-widest font-medium">Grand Prix</div>
            </div>
            <div className="card p-6 text-center group transition-all duration-300">
              <div className="card-glow top-0 left-1/2 -translate-x-1/2"></div>
              <div className="text-4xl md:text-5xl font-black text-blue-400">5</div>
              <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-3 tracking-widest font-medium">Continents</div>
            </div>
            <div className="card p-6 text-center group transition-all duration-300">
              <div className="card-glow top-0 left-1/2 -translate-x-1/2"></div>
              <div className="text-4xl md:text-5xl font-black text-emerald-400">MAR</div>
              <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-3 tracking-widest font-medium">Season Start</div>
            </div>
            <div className="card p-6 text-center group transition-all duration-300">
              <div className="card-glow top-0 left-1/2 -translate-x-1/2"></div>
              <div className="text-4xl md:text-5xl font-black text-amber-400">DEC</div>
              <div className="text-[10px] md:text-xs text-gray-500 uppercase mt-3 tracking-widest font-medium">Season End</div>
            </div>
          </div>

          {/* Race Calendar */}
          <h3 className="text-lg font-bold mb-5 text-gray-300 flex items-center gap-4">
            <span className="w-10 h-1 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></span>
            Race Calendar
          </h3>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="table-header text-gray-500 text-[10px] md:text-xs uppercase tracking-wider bg-white/5">
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Round</th>
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Grand Prix</th>
                  <th className="py-4 px-4 md:px-6 text-left hidden md:table-cell font-semibold">Circuit</th>
                  <th className="py-4 px-4 md:px-6 text-right font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { round: 1, name: "Australian Grand Prix", circuit: "Albert Park", date: "06-08 Mar", location: "Australia" },
                  { round: 2, name: "Chinese Grand Prix", circuit: "Shanghai International", date: "13-15 Mar", location: "China" },
                  { round: 3, name: "Japanese Grand Prix", circuit: "Suzuka", date: "27-29 Mar", location: "Japan" },
                  { round: 4, name: "Bahrain Grand Prix", circuit: "Bahrain International", date: "10-12 Apr", location: "Bahrain" },
                  { round: 5, name: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche", date: "17-19 Apr", location: "Saudi Arabia" },
                  { round: 6, name: "Miami Grand Prix", circuit: "Miami International", date: "01-03 May", location: "Miami" },
                  { round: 7, name: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", date: "22-24 May", location: "Canada" },
                  { round: 8, name: "Monaco Grand Prix", circuit: "Circuit de Monaco", date: "05-07 Jun", location: "Monaco" },
                  { round: 9, name: "Spanish Grand Prix", circuit: "Circuit Barcelona-Catalunya", date: "12-14 Jun", location: "Barcelona" },
                  { round: 10, name: "Austrian Grand Prix", circuit: "Red Bull Ring", date: "26-28 Jun", location: "Austria" },
                  { round: 11, name: "British Grand Prix", circuit: "Silverstone", date: "03-05 Jul", location: "Great Britain" },
                  { round: 12, name: "Belgian Grand Prix", circuit: "Spa-Francorchamps", date: "17-19 Jul", location: "Belgium" },
                  { round: 13, name: "Hungarian Grand Prix", circuit: "Hungaroring", date: "24-26 Jul", location: "Hungary" },
                  { round: 14, name: "Dutch Grand Prix", circuit: "Zandvoort", date: "21-23 Aug", location: "Netherlands" },
                  { round: 15, name: "Italian Grand Prix", circuit: "Monza", date: "04-06 Sep", location: "Italy" },
                  { round: 16, name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", date: "24-26 Sep", location: "Azerbaijan" },
                  { round: 17, name: "Singapore Grand Prix", circuit: "Marina Bay", date: "09-11 Oct", location: "Singapore" },
                  { round: 18, name: "United States Grand Prix", circuit: "Circuit of The Americas", date: "23-25 Oct", location: "United States" },
                  { round: 19, name: "Mexico City Grand Prix", circuit: "Hermanos Rodríguez", date: "30 Oct-01 Nov", location: "Mexico" },
                  { round: 20, name: "São Paulo Grand Prix", circuit: "José Carlos Pace", date: "06-08 Nov", location: "Brazil" },
                  { round: 21, name: "Las Vegas Grand Prix", circuit: "Las Vegas Strip", date: "19-21 Nov", location: "Las Vegas" },
                  { round: 22, name: "Qatar Grand Prix", circuit: "Lusail International", date: "27-29 Nov", location: "Qatar" },
                  { round: 23, name: "Abu Dhabi Grand Prix", circuit: "Yas Marina", date: "04-06 Dec", location: "Abu Dhabi" }
                ].map((race) => (
                  <tr 
                    key={race.round} 
                    className="table-row border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 md:py-5 px-4 md:px-6">
                      <span className="badge bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg font-bold text-xs">R{race.round}</span>
                    </td>
                    <td className="py-4 md:py-5 px-4 md:px-6">
                      <div>
                        <div className="font-semibold text-white text-sm md:text-base">{race.name}</div>
                        <div className="text-[10px] text-gray-600 md:hidden">{race.circuit}</div>
                      </div>
                    </td>
                    <td className="py-4 md:py-5 px-4 md:px-6 hidden md:table-cell">
                      <span className="text-gray-500 text-sm">{race.circuit}</span>
                    </td>
                    <td className="py-4 md:py-5 px-4 md:px-6 text-right">
                      <div className="text-white font-mono font-semibold text-sm">{race.date}</div>
                      <div className="text-[10px] text-gray-600">{race.location}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-10 card p-6 border border-red-500/20 bg-gradient-to-r from-red-500/5 to-transparent hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="badge bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-xs animate-pulse">NEW</div>
              <div>
                <div className="font-bold text-white text-base">2026 Regulation Changes</div>
                <div className="text-sm text-gray-500 mt-1">New power unit regulations, updated aero rules, and enhanced sustainability measures come into effect this season.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CONSTRUCTORS TAB ==================== */}
      {activeTab === 'constructors' && (
        <div className="animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-black mb-8 section-title">
            <span className="text-gradient">2025 Constructors Championship</span> <span className="text-red-500">Final Standings</span>
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {/* Team Detail Modal */}
          {selectedTeam && (
            <div className="modal-backdrop fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade" onClick={() => setSelectedTeam(null)}>
              <div className="modal-content card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div style={{ width: '80px', height: '80px' }} className="rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge border border-white/10">
                      <img src={getTeamLogo(selectedTeam.Constructor.name)} alt={selectedTeam.Constructor.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black text-gradient">{selectedTeam.Constructor.name}</div>
                      <div className="text-gray-500 mt-1">Position: <span className={`font-bold ${selectedTeam.position === "1" ? 'stat-number gold' : selectedTeam.position === "2" ? 'text-gray-400' : selectedTeam.position === "3" ? 'text-amber-600' : 'text-white'}`}>P{selectedTeam.position}</span></div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTeam(null)} className="text-gray-500 hover:text-red-500 text-3xl transition-all duration-300 hover:rotate-90 transform w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center">&times;</button>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black text-emerald-400">{selectedTeam.points}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Points</div>
                  </div>
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black text-blue-400">{selectedTeam.wins || 0}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Wins</div>
                  </div>
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black text-amber-400">{selectedTeam.Podiums || 0}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Podiums</div>
                  </div>
                </div>

                {/* Drivers */}
                <h3 className="text-lg font-bold mb-5 flex items-center gap-4">
                  <span className="w-10 h-1 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></span>
                  Team Drivers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedTeam.ConstructorStandings?.slice(0, 2).map((driver, idx) => (
                    <div key={driver.Driver?.driverId} className="card p-5">
                      <div className="flex items-center gap-4 mb-4">
                        <div style={{ width: '50px', height: '50px' }} className="rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 flex-shrink-0 driver-image border border-white/10">
                          <img src={getDriverPhoto(driver.Driver?.familyName)} alt={driver.Driver?.familyName} style={{ width: '50px', height: '50px', objectFit: 'cover', objectPosition: 'top center' }} />
                        </div>
                        <div>
                          <div className="font-bold text-white text-base">{driver.Driver?.familyName}</div>
                          <div className="text-xs text-gray-500">{driver.wins || 0} wins</div>
                        </div>
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-emerald-400">{driver.points} <span className="text-sm text-gray-600 font-normal">pts</span></div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center text-blue-400 text-sm">
                  Click team rows to view more details
                </div>
              </div>
            </div>
          )}
          
          {/* Constructors Standings Table */}
          <div className="card overflow-x-auto">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="table-header text-gray-500 text-[10px] md:text-xs uppercase tracking-wider bg-white/5">
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Pos</th>
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Team</th>
                  <th className="py-4 px-4 md:px-6 text-center hidden sm:table-cell font-semibold">Wins</th>
                  <th className="py-4 px-4 md:px-6 text-right font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {data.constructorStandings.length > 0 ? (
                  data.constructorStandings.slice(0, 10).map((t, idx) => (
                    <tr 
                      key={idx} 
                      className={`table-row border-b border-white/5 cursor-pointer transition-all hover:bg-white/10 ${
                        t.position === "1" ? 'bg-yellow-500/5' : t.position === "2" ? 'bg-gray-400/5' : t.position === "3" ? 'bg-amber-600/5' : ''
                      }`}
                      onClick={() => setSelectedTeam(t)}
                    >
                      <td className="py-4 md:py-5 px-4 md:px-6">
                        <span className={`font-black text-lg md:text-xl ${
                          t.position === "1" ? 'stat-number gold' : t.position === "2" ? 'text-gray-400' : t.position === "3" ? 'text-amber-600' : 'text-white'
                        }`}>
                          {t.position}
                        </span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div style={{ width: '42px', height: '42px' }} className="rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge border border-white/5">
                            <img src={getTeamLogo(t.Constructor.name)} alt={t.Constructor.name} style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
                          </div>
                          <span className="font-bold text-white text-sm md:text-base">{t.Constructor.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center hidden sm:table-cell">
                        <span className="text-blue-400 font-bold">{t.wins || 0}</span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6 text-right">
                        <span className="text-emerald-400 font-black text-xl md:text-2xl">{t.points}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      Loading constructor standings...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <p className="text-center text-gray-600 text-xs md:text-sm mt-8">Click on a team to see more details</p>
        </div>
      )}

      {/* ==================== DRIVERS TAB ==================== */}
      {activeTab === 'drivers' && (
        <div className="animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-black mb-8 section-title">
            <span className="text-gradient">2025 Drivers Championship</span> <span className="text-red-500">Final Standings</span>
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {/* Driver Detail Modal */}
          {selectedDriver && (
            <div className="modal-backdrop fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade" onClick={() => setSelectedDriver(null)}>
              <div className="modal-content card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div style={{ width: '80px', height: '80px' }} className="rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 border-4 border-red-500/50 flex-shrink-0 driver-image">
                      <img src={getDriverPhoto(selectedDriver.Driver?.familyName || selectedDriver.familyName)} alt={selectedDriver.Driver?.familyName} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: 'top center' }} />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black">{selectedDriver.Driver?.givenName || selectedDriver.firstName} <span className="text-red-500">{selectedDriver.Driver?.familyName || selectedDriver.familyName}</span></div>
                      <div className="flex items-center gap-3 text-gray-500 mt-2">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden team-badge">
                          <img src={getTeamLogo(selectedDriver.Constructors?.[0]?.name || selectedDriver.team)} alt="Team" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </div>
                        <span className="text-sm">{selectedDriver.Constructors?.[0]?.name || selectedDriver.team}</span>
                        <span className="text-gray-700">•</span>
                        <span className="text-sm">{selectedDriver.nationality || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDriver(null)} className="text-gray-500 hover:text-red-500 text-3xl transition-all duration-300 hover:rotate-90 transform w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center">&times;</button>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stagger-children">
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black stat-number gold">P{selectedDriver.position}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Championship</div>
                  </div>
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black text-emerald-400">{selectedDriver.points}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Points</div>
                  </div>
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black text-blue-400">{selectedDriver.wins || 0}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Wins</div>
                  </div>
                  <div className="card p-5 text-center group">
                    <div className="card-glow"></div>
                    <div className="text-3xl md:text-4xl font-black text-amber-400">{selectedDriver.Podiums || 0}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-2 tracking-widest font-medium">Podiums</div>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center text-blue-400 text-sm">
                  Click driver rows to view detailed performance insights
                </div>
              </div>
            </div>
          )}
          
          {/* Drivers Standings Table */}
          <div className="card overflow-x-auto">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="table-header text-gray-500 text-[10px] md:text-xs uppercase tracking-wider bg-white/5">
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Pos</th>
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Driver</th>
                  <th className="py-4 px-4 md:px-6 text-left hidden md:table-cell font-semibold">Team</th>
                  <th className="py-4 px-4 md:px-6 text-center hidden sm:table-cell font-semibold">Wins</th>
                  <th className="py-4 px-4 md:px-6 text-right font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {data.driverStandings.length > 0 ? (
                  data.driverStandings.slice(0, 20).map((d, idx) => (
                    <tr 
                      key={idx} 
                      className={`table-row border-b border-white/5 cursor-pointer transition-all hover:bg-white/10 ${
                        d.position === "1" ? 'bg-yellow-500/5' : d.position === "2" ? 'bg-gray-400/5' : d.position === "3" ? 'bg-amber-600/5' : ''
                      }`}
                      onClick={() => setSelectedDriver({...d, firstName: d.Driver?.givenName, familyName: d.Driver?.familyName})}
                    >
                      <td className="py-4 md:py-5 px-4 md:px-6">
                        <span className={`font-black text-lg md:text-xl ${
                          d.position === "1" ? 'stat-number gold' : d.position === "2" ? 'text-gray-400' : d.position === "3" ? 'text-amber-600' : 'text-white'
                        }`}>
                          {d.position}
                        </span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div style={{ width: '42px', height: '42px' }} className="rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 flex-shrink-0 driver-image border border-white/10">
                            <img src={getDriverPhoto(d.Driver?.familyName)} alt={d.Driver?.familyName} style={{ width: '42px', height: '42px', objectFit: 'cover', objectPosition: 'top center' }} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm md:text-base">{d.Driver?.givenName} <span className="text-red-400">{d.Driver?.familyName}</span></div>
                            <div className="text-[10px] text-gray-600 md:hidden">{d.Constructors?.[0]?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6 hidden md:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge border border-white/5">
                            <img src={getTeamLogo(d.Constructors?.[0]?.name)} alt="Team" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          </div>
                          <span className="text-gray-500 text-sm">{d.Constructors?.[0]?.name}</span>
                        </div>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6 text-center hidden sm:table-cell">
                        <span className="text-blue-400 font-bold">{d.wins || 0}</span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6 text-right">
                        <span className="text-emerald-400 font-black text-xl md:text-2xl">{d.points}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Loading driver standings...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <p className="text-center text-gray-600 text-xs md:text-sm mt-8">Click on a driver to see more details</p>
        </div>
      )}

      {/* ==================== RESULTS TAB ==================== */}
      {activeTab === 'results' && (
        <div className="animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-black mb-8 section-title">
            <span className="text-gradient">2025 Season</span> <span className="text-red-500">Race Calendar</span>
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="card overflow-x-auto">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="table-header text-gray-500 text-[10px] md:text-xs uppercase tracking-wider bg-white/5">
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Round</th>
                  <th className="py-4 px-4 md:px-6 text-left font-semibold">Grand Prix</th>
                  <th className="py-4 px-4 md:px-6 text-left hidden md:table-cell font-semibold">Circuit</th>
                  <th className="py-4 px-4 md:px-6 text-left hidden sm:table-cell font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.raceList.length > 0 ? (
                  data.raceList.map((race) => (
                    <tr key={race.round} className="table-row border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 md:py-5 px-4 md:px-6">
                        <span className="badge bg-red-500/15 text-red-400 px-3 py-1.5 rounded-lg font-bold text-xs">R{race.round}</span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6">
                        <span className="font-bold text-white text-sm md:text-base">{race.raceName}</span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6 hidden md:table-cell">
                        <span className="text-gray-500 text-sm">{race.Circuit?.circuitName}</span>
                      </td>
                      <td className="py-4 md:py-5 px-4 md:px-6 hidden sm:table-cell">
                        <span className="text-gray-500 font-mono text-sm">{race.date}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      Loading race calendar...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== HOME TAB ==================== */}
      {activeTab === 'home' && (
        <>
      {error && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-sm flex items-center gap-3">
          <span>ℹ️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        
        {/* Card 1: Next Race */}
        <div className="card p-8 border-t-4 border-red-500 group relative overflow-hidden hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
          <div className="card-glow -top-10 -right-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full"></div>
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Upcoming Race Preview</h2>
            <span className="text-[9px] font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">2025 DATA</span>
          </div>
          <div className="text-3xl md:text-4xl font-black mb-3 text-gradient leading-tight">
            {data.nextRace?.raceName || data.nextRace?.name || "Loading..."}
          </div>
          <div className="text-red-400 font-mono text-xl md:text-2xl mb-6 font-semibold">
            {data.nextRace?.date ? new Date(data.nextRace.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : "--"}
          </div>
          <div className="badge bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 text-center py-3 px-6 rounded-2xl font-bold text-xs tracking-widest border border-red-500/20">
            {data.nextRace ? "FEATURED RACE" : "LOADING"}
          </div>
        </div>

        {/* Card 2: Last Race Podium */}
        <div className="card p-8 border-t-4 border-gray-600 group relative overflow-hidden">
          <div className="card-glow -top-10 -right-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-500/5 to-transparent rounded-bl-full"></div>
          <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-6 tracking-widest">Last Race Podium</h2>
          <div className="space-y-4">
            {data.lastRace?.Results?.slice(0,3).map((res) => (
              <div key={res.position} className="flex items-center justify-between py-3 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-all duration-300 group/item">
                <div className="flex items-center gap-4">
                  <span className={`font-black w-10 text-lg ${res.position === "1" ? "stat-number gold" : res.position === "2" ? "text-gray-400" : "text-amber-600"}`}>P{res.position}</span>
                  
                  {/* Team Logo */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge border border-white/5 group-hover/item:border-white/10 transition-colors">
                    <img 
                      src={getTeamLogo(res.Constructor.name)} 
                      alt="Team" 
                      style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                    />
                  </div>
                  
                  <span className="font-semibold text-sm text-white">{res.Driver.familyName}</span>
                </div>
              </div>
            )) || (
              <div className="text-gray-500 text-sm text-center py-4">Loading results...</div>
            )}
          </div>
        </div>

        {/* Card 3: Champion */}
        <div className="card p-8 border-t-4 border-blue-500 flex flex-col items-center text-center group relative overflow-hidden">
          <div className="card-glow -top-10 -right-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
          <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-6 w-full text-left tracking-widest">Championship Leader</h2>
          
          {/* Driver Photo */}
          <div className="relative mb-5 flex-shrink-0" style={{ width: '130px', height: '130px' }}>
             <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-transparent rounded-full animate-pulse"></div>
             <div 
               className="rounded-full border-4 border-blue-500/50 relative z-10 overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 driver-image"
               style={{ width: '130px', height: '130px' }}
             >
               <img 
                 src={data.driverStandings.length > 0 ? getDriverPhoto(data.driverStandings[0].Driver?.familyName) : '/f1-car.png'}
                 alt="Leader"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
               />
             </div>
             <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black px-4 py-2 rounded-xl text-sm z-20 shadow-lg shadow-blue-500/30">#1</div>
          </div>

          <div className="text-2xl md:text-3xl font-black text-gradient leading-tight">
            {data.driverStandings.length > 0 ? `${data.driverStandings[0].Driver?.givenName} ${data.driverStandings[0].Driver?.familyName}` : "Loading..."}
          </div>
          <div className="text-blue-400 font-semibold mt-2">
            {data.driverStandings.length > 0 ? data.driverStandings[0].Constructors?.[0]?.name : "..."}
          </div>
          <div className="mt-5 badge bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400 px-6 py-3 rounded-2xl text-lg font-black border border-blue-500/20">
            {data.driverStandings.length > 0 ? `${data.driverStandings[0].points} PTS` : "0"}
          </div>
          {data.driverStandings.length > 0 && (
            <div className="mt-3 text-gray-500 text-sm font-medium">{data.driverStandings[0].wins || 0} Wins</div>
          )}
        </div>

      </div>

      {/* Constructor Championship Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
        {/* Constructor Champion Card */}
        <div className="card p-8 border-t-4 border-amber-500 group relative overflow-hidden hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
          <div className="card-glow -top-10 -right-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>
          <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-6 tracking-widest">2025 Constructor Champion</h2>
          <div className="flex items-center gap-6">
            {/* Team Logo */}
            <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge border border-white/5">
              <img 
                src={data.constructorStandings.length > 0 ? getTeamLogo(data.constructorStandings[0].Constructor.name) : '/f1-car.png'}
                alt="Constructor"
                style={{ width: '56px', height: '56px', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-gradient leading-tight">
                {data.constructorStandings.length > 0 ? data.constructorStandings[0].Constructor.name : "Loading..."}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="badge bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 px-5 py-2 rounded-xl text-lg font-black border border-amber-500/20">
                  {data.constructorStandings.length > 0 ? `${data.constructorStandings[0].points} PTS` : "0"}
                </div>
                {data.constructorStandings.length > 0 && (
                  <div className="text-gray-500 font-medium">{data.constructorStandings[0].wins || 0} Wins</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2025 Season Summary Card */}
        <div className="card p-8 border-t-4 border-emerald-500 group relative overflow-hidden">
          <div className="card-glow -top-10 -right-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full"></div>
          <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-6 tracking-widest">2025 Season Summary</h2>
          <div className="space-y-1">
            <div className="flex justify-between items-center py-3 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-gray-500 text-sm">World Champion</span>
              <span className="text-white font-bold text-sm">
                {data.driverStandings.length > 0 ? `${data.driverStandings[0].Driver?.givenName} ${data.driverStandings[0].Driver?.familyName}` : "..."}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-gray-500 text-sm">Constructor Champion</span>
              <span className="text-white font-bold text-sm">{data.constructorStandings.length > 0 ? data.constructorStandings[0].Constructor.name : "..."}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-gray-500 text-sm">Total Races</span>
              <span className="text-white font-bold">{data.raceList.length}</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-gray-500 text-sm">Season Finale</span>
              <span className="text-white font-bold text-sm">
                {data.raceList.length > 0 ? data.raceList[data.raceList.length - 1].raceName : "..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Race Full Results Section */}
      {data.lastRace && (
        <div className="mt-8 card p-8 border-t-4 border-yellow-500 group relative overflow-hidden">
          <div className="card-glow -top-20 left-1/2 -translate-x-1/2"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-yellow-500/5 to-transparent rounded-bl-full"></div>
          <h2 className="text-gray-500 text-[10px] font-bold uppercase mb-8 tracking-widest">
            Race Results — <span className="text-yellow-400">{data.lastRace?.raceName || "Loading..."}</span>
          </h2>
          
          {/* Podium Cards - Horizontal Layout */}
          <div className="flex flex-row justify-center items-end gap-4 md:gap-6 mb-10 flex-wrap">
            {data.lastRace?.Results?.slice(0, 3).map((res) => (
              <div 
                key={res.position} 
                className={`podium-card flex flex-col items-center p-5 md:p-6 rounded-2xl flex-1 max-w-[200px] ${
                  res.position === "1" 
                    ? "p1 order-2" 
                    : res.position === "2" 
                    ? "p2 order-1" 
                    : "p3 order-3"
                }`}
                style={{ minHeight: res.position === "1" ? '260px' : '220px' }}
              >
                <div className={`text-3xl md:text-4xl font-black mb-4 ${
                  res.position === "1" ? "stat-number gold" : res.position === "2" ? "text-gray-400" : "text-amber-600"
                }`}>
                  P{res.position}
                </div>
                <div className="relative mb-4 flex-shrink-0" style={{ width: res.position === "1" ? '85px' : '70px', height: res.position === "1" ? '85px' : '70px' }}>
                  <div 
                    className={`rounded-full border-3 overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 driver-image ${
                      res.position === "1" ? "border-yellow-500" : res.position === "2" ? "border-gray-400" : "border-amber-600"
                    }`}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <img 
                      src={getDriverPhoto(res.Driver.familyName)}
                      alt={res.Driver.familyName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  </div>
                </div>
                <div className="text-base md:text-lg font-bold text-white text-center">{res.Driver.familyName}</div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge">
                    <img src={getTeamLogo(res.Constructor.name)} alt="Team" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                  </div>
                  <span className="text-gray-500 text-xs">{res.Constructor.name}</span>
                </div>
                <div className="text-emerald-400 text-sm mt-3 font-mono font-bold">+{res.points} pts</div>
              </div>
            )) || []}
          </div>

          {/* Full Results Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full min-w-max md:min-w-full">
              <thead>
                <tr className="table-header text-gray-500 text-[10px] md:text-xs uppercase tracking-wider bg-white/5">
                  <th className="py-4 px-4 text-left font-semibold">Pos</th>
                  <th className="py-4 px-4 text-left font-semibold">Driver</th>
                  <th className="py-4 px-4 text-left hidden md:table-cell font-semibold">Team</th>
                  <th className="py-4 px-4 text-right font-semibold">Time</th>
                  <th className="py-4 px-4 text-right font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {data.lastRace?.Results?.map((res) => (
                  <tr 
                    key={res.position} 
                    className={`table-row border-b border-white/5 hover:bg-white/5 transition-colors ${
                      res.position === "1" ? "bg-yellow-500/5" : 
                      res.position === "2" ? "bg-gray-400/5" : 
                      res.position === "3" ? "bg-amber-600/5" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className={`font-bold ${
                        res.position === "1" ? "stat-number gold" : 
                        res.position === "2" ? "text-gray-400" : 
                        res.position === "3" ? "text-amber-600" : "text-white"
                      }`}>
                        {res.position}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div style={{ width: '30px', height: '30px' }} className="rounded-full bg-gradient-to-b from-gray-700 to-gray-900 overflow-hidden flex-shrink-0 hidden sm:flex items-center justify-center driver-image border border-white/10">
                          <img 
                            src={getDriverPhoto(res.Driver.familyName)}
                            alt={res.Driver.familyName}
                            style={{ width: '30px', height: '30px', objectFit: 'cover', objectPosition: 'top center' }}
                          />
                        </div>
                        <span className="font-semibold text-white text-sm">{res.Driver.familyName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge">
                          <img src={getTeamLogo(res.Constructor.name)} alt="Team" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                        </div>
                        <span className="text-gray-500 text-sm">{res.Constructor.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-gray-400 text-sm">{res.time}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`font-bold ${parseInt(res.points) > 0 ? "text-emerald-400" : "text-gray-600"}`}>
                        {res.points}
                      </span>
                    </td>
                  </tr>
                )) || []}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </>
      )}
      </div>
    </main>
  );
}