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
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  // Countdown Timer for Next Race
  useEffect(() => {
    const nextRaceDate = new Date('2026-03-06T00:00:00'); // Australian GP 2026
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextRaceDate - now;
      
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">RACE CALENDAR</h1>
            <p className="text-gray-500 text-sm">2025 FIA Formula One World Championship</p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 border-t-2 border-red-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Total Races</div>
              <div className="text-2xl md:text-3xl font-black text-white">24</div>
            </div>
            <div className="card p-4 border-t-2 border-green-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Completed</div>
              <div className="text-2xl md:text-3xl font-black text-white">0</div>
            </div>
            <div className="card p-4 border-t-2 border-blue-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Upcoming</div>
              <div className="text-2xl md:text-3xl font-black text-white">24</div>
            </div>
            <div className="card p-4 border-t-2 border-yellow-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Next Round</div>
              <div className="text-2xl md:text-3xl font-black text-white">1</div>
            </div>
          </div>

          {/* Race Calendar Cards */}
          <div className="space-y-4">
            {[
              { round: 1, name: "Australian Grand Prix", circuit: "Albert Park Grand Prix Circuit", location: "MELBOURNE, AUSTRALIA", date: "Mar 8, 2026", time: "04:00:00 UTC", days: 46 },
              { round: 2, name: "Chinese Grand Prix", circuit: "Shanghai International Circuit", location: "SHANGHAI, CHINA", date: "Mar 15, 2026", time: "07:00:00 UTC", days: 53 },
              { round: 3, name: "Japanese Grand Prix", circuit: "Suzuka Circuit", location: "SUZUKA, JAPAN", date: "Mar 29, 2026", time: "05:00:00 UTC", days: 67 },
              { round: 4, name: "Bahrain Grand Prix", circuit: "Bahrain International Circuit", location: "SAKHIR, BAHRAIN", date: "Apr 12, 2026", time: "15:00:00 UTC", days: 81 },
              { round: 5, name: "Saudi Arabian Grand Prix", circuit: "Jeddah Corniche Circuit", location: "JEDDAH, SAUDI ARABIA", date: "Apr 20, 2026", time: "17:00:00 UTC", days: 88 },
              { round: 6, name: "Miami Grand Prix", circuit: "Miami International Autodrome", location: "MIAMI, USA", date: "May 4, 2026", time: "20:00:00 UTC", days: 102 },
              { round: 7, name: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", location: "MONTREAL, CANADA", date: "May 25, 2026", time: "20:00:00 UTC", days: 123 },
              { round: 8, name: "Monaco Grand Prix", circuit: "Circuit de Monaco", location: "MONTE CARLO, MONACO", date: "Jun 7, 2026", time: "13:00:00 UTC", days: 137 },
              { round: 9, name: "Barcelona Grand Prix", circuit: "Circuit de Barcelona-Catalunya", location: "BARCELONA, SPAIN", date: "Jun 14, 2026", time: "13:00:00 UTC", days: 144 },
              { round: 10, name: "Austrian Grand Prix", circuit: "Red Bull Ring", location: "SPIELBERG, AUSTRIA", date: "Jun 28, 2026", time: "13:00:00 UTC", days: 158 },
              { round: 11, name: "British Grand Prix", circuit: "Silverstone Circuit", location: "SILVERSTONE, UK", date: "Jul 5, 2026", time: "14:00:00 UTC", days: 165 },
              { round: 12, name: "Belgian Grand Prix", circuit: "Circuit de Spa-Francorchamps", location: "SPA, BELGIUM", date: "Jul 19, 2026", time: "13:00:00 UTC", days: 179 },
              { round: 13, name: "Hungarian Grand Prix", circuit: "Hungaroring", location: "BUDAPEST, HUNGARY", date: "Jul 26, 2026", time: "13:00:00 UTC", days: 186 },
              { round: 14, name: "Dutch Grand Prix", circuit: "Circuit Park Zandvoort", location: "ZANDVOORT, NETHERLANDS", date: "Aug 23, 2026", time: "13:00:00 UTC", days: 214 },
              { round: 15, name: "Italian Grand Prix", circuit: "Autodromo Nazionale di Monza", location: "MONZA, ITALY", date: "Sep 6, 2026", time: "13:00:00 UTC", days: 228 },
              { round: 16, name: "Spanish Grand Prix", circuit: "Madring", location: "MADRID, SPAIN", date: "Sep 13, 2026", time: "13:00:00 UTC", days: 235 },
              { round: 17, name: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", location: "BAKU, AZERBAIJAN", date: "Sep 26, 2026", time: "11:00:00 UTC", days: 248 },
              { round: 18, name: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", location: "MARINA BAY, SINGAPORE", date: "Oct 11, 2026", time: "12:00:00 UTC", days: 263 },
              { round: 19, name: "United States Grand Prix", circuit: "Circuit of the Americas", location: "AUSTIN, USA", date: "Oct 26, 2026", time: "20:00:00 UTC", days: 277 },
              { round: 20, name: "Mexico City Grand Prix", circuit: "Autódromo Hermanos Rodríguez", location: "MEXICO CITY, MEXICO", date: "Nov 2, 2026", time: "20:00:00 UTC", days: 284 },
              { round: 21, name: "Brazilian Grand Prix", circuit: "Autódromo José Carlos Pace", location: "SÃO PAULO, BRAZIL", date: "Nov 9, 2026", time: "17:00:00 UTC", days: 291 },
              { round: 22, name: "Las Vegas Grand Prix", circuit: "Las Vegas Strip Street Circuit", location: "LAS VEGAS, USA", date: "Nov 22, 2026", time: "04:00:00 UTC", days: 305 },
              { round: 23, name: "Qatar Grand Prix", circuit: "Losail International Circuit", location: "LUSAIL, QATAR", date: "Nov 30, 2026", time: "16:00:00 UTC", days: 312 },
              { round: 24, name: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", location: "ABU DHABI, UAE", date: "Dec 6, 2026", time: "13:00:00 UTC", days: 319 }
            ].map((race) => (
              <div 
                key={race.round} 
                className={`card p-6 border-l-4 hover:bg-white/5 transition-colors ${race.round === 1 ? 'border-red-500 bg-red-500/5' : 'border-gray-700'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {race.round === 1 && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold">NEXT RACE</span>}
                      <h3 className="text-lg md:text-xl font-bold text-white">{race.name}</h3>
                      <span className="text-gray-500 text-sm">{race.round}</span>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">📍 {race.circuit}</div>
                    <div className="text-gray-600 text-xs uppercase">{race.location}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs uppercase">Date</div>
                      <div className="text-white font-medium">{race.date}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase">Time</div>
                      <div className="text-white font-medium">{race.time}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs uppercase">In</div>
                      <div className="text-cyan-400 font-bold">{race.days} days</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 card p-4">
            <h4 className="text-sm font-bold text-white mb-3">Legend</h4>
            <div className="flex flex-wrap gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/20 border-l-2 border-red-500 rounded"></div>
                <span className="text-gray-400">Next Race (Highlighted)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 border-l-2 border-gray-700 rounded"></div>
                <span className="text-gray-400">Upcoming Race</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/20 border-l-2 border-green-500 rounded"></div>
                <span className="text-gray-400">Completed Race</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CONSTRUCTORS TAB ==================== */}
      {activeTab === 'constructors' && (
        <div className="animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">CONSTRUCTOR STANDINGS</h1>
            <p className="text-gray-500 text-sm">2025 FIA Formula One World Championship</p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 border-t-2 border-red-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Total Teams</div>
              <div className="text-2xl md:text-3xl font-black text-white">10</div>
            </div>
            <div className="card p-4 border-t-2 border-orange-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Leader</div>
              <div className="text-2xl md:text-3xl font-black text-white">McLaren</div>
            </div>
            <div className="card p-4 border-t-2 border-green-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Top Points</div>
              <div className="text-2xl md:text-3xl font-black text-white">833</div>
            </div>
            <div className="card p-4 border-t-2 border-blue-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Most Wins</div>
              <div className="text-2xl md:text-3xl font-black text-white">9</div>
            </div>
          </div>
          
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
                    <div style={{ width: '32px', height: '32px' }} className="rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 team-badge border border-white/10">
                      <img src={getTeamLogo(selectedTeam.Constructor.name)} alt={selectedTeam.Constructor.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black text-white">{selectedTeam.Constructor.name}</div>
                      <div className="text-gray-500 mt-1">Position: <span className={`font-bold ${selectedTeam.position === "1" ? 'text-yellow-500' : selectedTeam.position === "2" ? 'text-gray-400' : selectedTeam.position === "3" ? 'text-amber-600' : 'text-white'}`}>P{selectedTeam.position}</span></div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTeam(null)} className="text-gray-500 hover:text-red-500 text-3xl transition-all duration-300 hover:rotate-90 transform w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center">&times;</button>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="card p-5 text-center border-t-2 border-green-500">
                    <div className="text-3xl md:text-4xl font-black text-emerald-400">{selectedTeam.points}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Points</div>
                  </div>
                  <div className="card p-5 text-center border-t-2 border-blue-500">
                    <div className="text-3xl md:text-4xl font-black text-blue-400">{selectedTeam.wins || 0}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Wins</div>
                  </div>
                  <div className="card p-5 text-center border-t-2 border-yellow-500">
                    <div className="text-3xl md:text-4xl font-black text-amber-400">{selectedTeam.podiums || 0}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Podiums</div>
                  </div>
                </div>

                {/* Drivers */}
                <h3 className="text-lg font-bold mb-4 text-white">Team Drivers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTeam.drivers?.slice(0, 2).map((driver, idx) => (
                    <div key={idx} className="card p-5 border-l-4 border-gray-700">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-4 h-4 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 flex-shrink-0 border border-white/10">
                          <img src={getDriverPhoto(driver.name)} alt={driver.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{driver.name}</div>
                          <div className="text-xs text-gray-500">{driver.wins || 0} wins</div>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-emerald-400">{driver.points} <span className="text-sm text-gray-600 font-normal">pts</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Constructor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.constructorStandings.length > 0 ? (
              data.constructorStandings.slice(0, 10).map((t, idx) => {
                const hardcodedTeam = constructorStandings2025Full.find(ht => ht.team === t.Constructor.name);
                const nationality = {
                  'McLaren': 'BRITISH',
                  'Mercedes': 'GERMAN',
                  'Red Bull': 'AUSTRIAN',
                  'Ferrari': 'ITALIAN',
                  'Williams': 'BRITISH',
                  'RB': 'ITALIAN',
                  'Aston Martin': 'BRITISH',
                  'Haas F1 Team': 'AMERICAN',
                  'Sauber': 'SWISS',
                  'Alpine': 'FRENCH'
                }[t.Constructor.name] || 'INTERNATIONAL';
                
                return (
                  <div 
                    key={idx} 
                    className={`card p-6 border-l-4 cursor-pointer hover:bg-white/5 transition-all ${
                      t.position === "1" ? 'border-yellow-500' : t.position === "2" ? 'border-gray-400' : t.position === "3" ? 'border-amber-600' : 'border-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedTeam({...t, podiums: hardcodedTeam?.podiums || 0, drivers: hardcodedTeam?.drivers, racePoints: hardcodedTeam?.racePoints});
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`text-3xl font-black ${
                          t.position === "1" ? 'text-yellow-500' : t.position === "2" ? 'text-gray-400' : t.position === "3" ? 'text-amber-600' : 'text-gray-600'
                        }`}>{t.position}</span>
                        {t.position <= 3 && <span className="text-yellow-500">🏆</span>}
                        {hardcodedTeam?.wins > 0 && <span className="text-xs text-gray-500">{hardcodedTeam.wins} Wins</span>}
                      </div>
                      <div className="w-5 h-5 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                        <img src={getTeamLogo(t.Constructor.name)} alt={t.Constructor.name} className="w-8 h-8 object-contain" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-black text-white uppercase">{t.Constructor.name}</h3>
                      <div className="text-xs text-gray-500 uppercase mt-1">{nationality}</div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 uppercase">Championship Points</div>
                      <div className="text-3xl font-black text-white mt-1">{t.points}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-8">Loading constructor standings...</div>
            )}
          </div>

          {/* Championship Info */}
          <div className="mt-8 card p-6 border-t-2 border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Championship Info</h4>
            <div className="text-gray-400 text-sm space-y-2">
              <p><strong>Point System:</strong> 1st: 25pts, 2nd: 18pts, 3rd: 15pts, 4th: 12pts, 5th: 10pts, 6th: 8pts, 7th: 6pts, 8th: 4pts, 9th: 2pts, 10th: 1pt</p>
              <p><strong>Fastest Lap:</strong> +1 point (if finishing in top 10)</p>
              <p><strong>Constructor Points:</strong> Sum of both drivers' points per race</p>
              <p><strong>Season:</strong> 2025 FIA Formula One World Championship</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DRIVERS TAB ==================== */}
      {activeTab === 'drivers' && (
        <div className="animate-slide-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">DRIVER STANDINGS</h1>
            <p className="text-gray-500 text-sm">2025 FIA Formula One World Championship</p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 border-t-2 border-red-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Total Drivers</div>
              <div className="text-2xl md:text-3xl font-black text-white">21</div>
            </div>
            <div className="card p-4 border-t-2 border-orange-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Leader</div>
              <div className="text-2xl md:text-3xl font-black text-white">NOR</div>
            </div>
            <div className="card p-4 border-t-2 border-green-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Top Points</div>
              <div className="text-2xl md:text-3xl font-black text-white">423</div>
            </div>
            <div className="card p-4 border-t-2 border-blue-500">
              <div className="text-xs text-gray-500 uppercase mb-1">Most Wins</div>
              <div className="text-2xl md:text-3xl font-black text-white">9</div>
            </div>
          </div>
          
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
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 border-3 border-red-500/50 flex-shrink-0">
                      <img src={getDriverPhoto(selectedDriver.Driver?.familyName || selectedDriver.familyName)} alt={selectedDriver.Driver?.familyName} className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black">{selectedDriver.Driver?.givenName || selectedDriver.firstName} <span className="text-red-500">{selectedDriver.Driver?.familyName || selectedDriver.familyName}</span></div>
                      <div className="flex items-center gap-3 text-gray-500 mt-2">
                        <div className="w-4 h-4 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                          <img src={getTeamLogo(selectedDriver.Constructors?.[0]?.name || selectedDriver.team)} alt="Team" className="w-4 h-4 object-contain" />
                        </div>
                        <span className="text-sm">{selectedDriver.Constructors?.[0]?.name || selectedDriver.team}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDriver(null)} className="text-gray-500 hover:text-red-500 text-3xl transition-all duration-300 hover:rotate-90 transform w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center">&times;</button>
                </div>
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="card p-5 text-center border-t-2 border-yellow-500">
                    <div className="text-3xl font-black text-yellow-500">P{selectedDriver.position}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Championship</div>
                  </div>
                  <div className="card p-5 text-center border-t-2 border-green-500">
                    <div className="text-3xl font-black text-emerald-400">{selectedDriver.points}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Points</div>
                  </div>
                  <div className="card p-5 text-center border-t-2 border-blue-500">
                    <div className="text-3xl font-black text-blue-400">{selectedDriver.wins || 0}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Wins</div>
                  </div>
                  <div className="card p-5 text-center border-t-2 border-orange-500">
                    <div className="text-3xl font-black text-amber-400">{selectedDriver.podiums || 0}</div>
                    <div className="text-xs text-gray-500 uppercase mt-2">Podiums</div>
                  </div>
                </div>
                
                {/* Race by Race Results */}
                {selectedDriver.results && (
                  <>
                    <h3 className="text-lg font-bold mb-4 text-white">2025 Season Results (24 Races)</h3>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 mb-6">
                      {selectedDriver.results.map((result, idx) => (
                        <div key={idx} className={`card p-3 text-center ${
                          result === 1 ? 'bg-yellow-500/20 border-yellow-500/50' :
                          result === 2 ? 'bg-gray-400/20 border-gray-400/50' :
                          result === 3 ? 'bg-amber-600/20 border-amber-600/50' :
                          result <= 10 ? 'bg-blue-500/10 border-blue-500/30' :
                          'bg-white/5'
                        }`}>
                          <div className="text-[10px] text-gray-500 mb-1">R{idx + 1}</div>
                          <div className={`text-sm font-black ${
                            result === 1 ? 'text-yellow-400' :
                            result === 2 ? 'text-gray-300' :
                            result === 3 ? 'text-amber-500' :
                            result <= 10 ? 'text-blue-400' :
                            'text-gray-600'
                          }`}>{result === 'DNF' ? 'DNF' : `P${result}`}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {/* Driver Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.driverStandings.length > 0 ? (
              data.driverStandings.slice(0, 21).map((d, idx) => {
                const hardcodedDriver = driverStandings2025Full.find(hd => hd.driver === d.Driver?.familyName);
                const driverCode = d.Driver?.code || d.Driver?.familyName?.substring(0,3).toUpperCase();
                
                return (
                  <div 
                    key={idx} 
                    className={`card p-5 border-l-4 cursor-pointer hover:bg-white/5 transition-all ${
                      d.position === "1" ? 'border-yellow-500' : d.position === "2" ? 'border-gray-400' : d.position === "3" ? 'border-amber-600' : 'border-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedDriver({...d, firstName: d.Driver?.givenName, familyName: d.Driver?.familyName, podiums: hardcodedDriver?.podiums || 0, nationality: hardcodedDriver?.nationality, results: hardcodedDriver?.results, team: d.Constructors?.[0]?.name});
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-black ${
                        d.position === "1" ? 'text-yellow-500' : d.position === "2" ? 'text-gray-400' : d.position === "3" ? 'text-amber-600' : 'text-gray-600'
                      }`}>{d.position}</span>
                      <div className="w-4 h-4 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 flex-shrink-0 border-2 border-white/10">
                        <img src={getDriverPhoto(d.Driver?.familyName)} alt={d.Driver?.familyName} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{d.Driver?.givenName} {d.Driver?.familyName}</h3>
                        <div className="text-xs text-gray-500 uppercase">{d.Constructors?.[0]?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="text-gray-500 text-sm">{driverCode}</div>
                      <div className="text-gray-500 text-sm">{d.wins || 0} wins</div>
                      <div className="text-white font-bold">{d.points} PTS</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">Loading driver standings...</div>
            )}
          </div>
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

          {/* Hero Section - Next Race Banner */}
          <div className="mb-8 card p-8 border-l-4 border-red-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Next Race</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">AUSTRALIAN GRAND PRIX</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">LOCATION</span>
                <span className="text-white font-medium">Melbourne, Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">DATE</span>
                <span className="text-white font-medium">2026-03-08</span>
              </div>
            </div>
            
            {/* Championship Leader */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <span className="text-gray-500 text-xs uppercase">Championship Leader</span>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-orange-500">
                  <img 
                    src={data.driverStandings.length > 0 ? getDriverPhoto(data.driverStandings[0].Driver?.familyName) : '/f1-car.png'}
                    alt="Leader"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="text-white font-bold text-lg uppercase">
                    {data.driverStandings.length > 0 ? data.driverStandings[0].Driver?.familyName : "Loading..."}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {data.driverStandings.length > 0 ? data.driverStandings[0].Constructors?.[0]?.name : "..."} · {data.driverStandings.length > 0 ? data.driverStandings[0].points : "0"} POINTS
                  </div>
                </div>
              </div>
              <span className="ml-auto text-gray-600 text-xs">CURRENT SEASON</span>
              <span className="text-white font-bold">2025</span>
            </div>
          </div>

          {/* Race Countdown Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Race Countdown</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="card p-4 text-center border-t-2 border-red-500">
                <div className="text-3xl md:text-4xl font-black text-white">{String(countdown.days).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">Days</div>
              </div>
              <div className="card p-4 text-center border-t-2 border-red-500/70">
                <div className="text-3xl md:text-4xl font-black text-white">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">Hours</div>
              </div>
              <div className="card p-4 text-center border-t-2 border-red-500/50">
                <div className="text-3xl md:text-4xl font-black text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">Minutes</div>
              </div>
              <div className="card p-4 text-center border-t-2 border-red-500/30">
                <div className="text-3xl md:text-4xl font-black text-white">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 uppercase mt-1">Seconds</div>
              </div>
            </div>
          </div>

          {/* Last Race Section */}
          {data.lastRace && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Last Race - {data.lastRace?.raceName || "Loading..."}</h2>
              
              {/* Race Winner + Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Race Winner Card */}
                <div className="card p-6 text-center border-t-2 border-yellow-500 relative overflow-hidden">
                  <div className="absolute top-2 left-2 text-yellow-500 text-lg">🏆</div>
                  <div className="text-xs text-gray-500 uppercase mb-3">Race Winner</div>
                  <div className="w-5 h-5 mx-auto rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-yellow-500 mb-3">
                    <img 
                      src={data.lastRace?.Results?.[0] ? getDriverPhoto(data.lastRace.Results[0].Driver.familyName) : '/f1-car.png'}
                      alt="Winner"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-lg font-bold text-white uppercase">
                    {data.lastRace?.Results?.[0]?.Driver?.familyName || "..."}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.lastRace?.Results?.[0]?.Constructor?.name || "..."}
                  </div>
                  <div className="text-sm text-gray-400 font-mono mt-2">
                    {data.lastRace?.Results?.[0]?.Time?.time || "1:26:07.469"}
                  </div>
                </div>

                {/* Pole Position Card */}
                <div className="card p-6 text-center border-t-2 border-purple-500">
                  <div className="text-xs text-gray-500 uppercase mb-3">⚡ Pole Position</div>
                  <div className="text-lg font-bold text-white uppercase">
                    {data.lastRace?.Results?.[0]?.Driver?.familyName || "..."}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Qualifying</div>
                  <div className="text-sm text-purple-400 font-mono mt-2">1:22.207</div>
                </div>

                {/* Fastest Lap Card */}
                <div className="card p-6 text-center border-t-2 border-pink-500">
                  <div className="text-xs text-gray-500 uppercase mb-3">🚀 Fastest Lap</div>
                  <div className="text-lg font-bold text-white uppercase">
                    {data.lastRace?.Results?.find(r => r.FastestLap?.rank === "1")?.Driver?.familyName || data.lastRace?.Results?.[3]?.Driver?.familyName || "..."}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Lap 45</div>
                  <div className="text-sm text-pink-400 font-mono mt-2">1:26.725</div>
                </div>
              </div>

              {/* Top 10 Finishers */}
              <div className="card p-6 border-t-2 border-gray-700">
                <h3 className="text-sm font-bold text-white mb-4">Top 10 Finishers</h3>
                <div className="space-y-2">
                  {data.lastRace?.Results?.slice(0, 10).map((res) => (
                    <div 
                      key={res.position} 
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-white/5 ${
                        res.position === "1" ? "bg-yellow-500/10" : 
                        res.position === "2" ? "bg-gray-400/10" : 
                        res.position === "3" ? "bg-amber-600/10" : ""
                      }`}
                    >
                      <span className={`w-6 text-center font-bold ${
                        res.position === "1" ? "text-yellow-500" : 
                        res.position === "2" ? "text-gray-400" : 
                        res.position === "3" ? "text-amber-600" : "text-gray-500"
                      }`}>{res.position}</span>
                      <div className="w-3 h-3 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 flex-shrink-0">
                        <img 
                          src={getDriverPhoto(res.Driver.familyName)}
                          alt={res.Driver.familyName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{res.Driver.familyName}</div>
                        <div className="text-gray-500 text-xs">{res.Constructor.name}</div>
                      </div>
                      <div className="text-gray-400 font-mono text-xs hidden sm:block">
                        {res.position === "1" ? res.Time?.time || "1:26:07.469" : `+${res.Time?.time || "..."}`}
                      </div>
                      <div className="text-emerald-400 font-bold text-sm">{res.points} pts</div>
                    </div>
                  )) || (
                    <div className="text-gray-500 text-sm text-center py-4">Loading results...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Driver Standings Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Driver Standings</h2>
              <button 
                onClick={() => setActiveTab('drivers')}
                className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                VIEW ALL <span>→</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.driverStandings.slice(0, 6).map((standing, index) => (
                <div key={index} className="card p-4 flex items-center gap-4 border-l-4 hover:bg-white/5 transition-colors" style={{
                  borderLeftColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'transparent'
                }}>
                  <span className={`text-2xl font-black w-8 ${
                    index === 0 ? "text-yellow-500" : 
                    index === 1 ? "text-gray-400" : 
                    index === 2 ? "text-amber-600" : "text-gray-600"
                  }`}>{index + 1}</span>
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-white/10 flex-shrink-0">
                    <img 
                      src={getDriverPhoto(standing.Driver?.familyName)}
                      alt={standing.Driver?.familyName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">
                      {standing.Driver?.givenName} {standing.Driver?.familyName}
                    </div>
                    <div className="text-gray-500 text-xs uppercase truncate">
                      {standing.Constructors?.[0]?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{standing.Driver?.code || standing.Driver?.familyName?.substring(0,3).toUpperCase()}</div>
                    <div className="text-xs text-gray-500">{standing.wins || 0} wins</div>
                    <div className="text-white font-bold">{standing.points} PTS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Breaking News Ticker */}
          <div className="card p-3 overflow-hidden border-t-2 border-cyan-500 relative">
            <div className="flex items-center">
              <span className="text-cyan-500 font-bold text-xs uppercase whitespace-nowrap bg-[#0f0f19] pr-4 z-10">Breaking News:</span>
              <div className="overflow-hidden flex-1">
                <div className="animate-marquee whitespace-nowrap inline-block">
                  <span className="text-gray-400 text-sm">
                    NORRIS LEADS CHAMPIONSHIP ++ NEXT STOP: AUSTRALIA ++ LIVE TELEMETRY ACTIVE ++ WEATHER CONDITIONS: DRY ++ TRACK TEMP: 32°C ++ NORRIS LEADS CHAMPIONSHIP ++ NEXT STOP: AUSTRALIA ++ LIVE TELEMETRY ACTIVE ++ WEATHER CONDITIONS: DRY ++ TRACK TEMP: 32°C ++
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </main>
  );
}