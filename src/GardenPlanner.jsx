import React, { useState } from 'react';

const GardenPlanner = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gardenType: '',
    zipCode: '',
    spaceTotal: '',
    spaceAllocation: '',
    varietyCount: '',
    experience: '',
    kidFriendly: null,
    sunExposure: '',
    lastFrostDate: ''
  });
  const [recommendations, setRecommendations] = useState(null);
  const [selectedPlants, setSelectedPlants] = useState(new Set());  // Set of plant names
  const [itinerary, setItinerary] = useState([]);
  const [gardenBeds, setGardenBeds] = useState([
    { id: 1, name: 'Bed 1', width: 4, length: 8, plants: [] }
  ]);
  const [currentBedId, setCurrentBedId] = useState(1);
  const [draggedPlant, setDraggedPlant] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null); // { row, col }
  
  // Dashboard state
  const [viewMode, setViewMode] = useState('setup'); // 'setup' or 'dashboard'
  const [completedTasks, setCompletedTasks] = useState(new Set()); // Set of task IDs
  const [currentDate, setCurrentDate] = useState(new Date()); // For testing/demo purposes
  const [plantInfoModal, setPlantInfoModal] = useState(null); // Plant name to show info for

  // Plant database with growing information
  const plantDatabase = {
    vegetable: {
      beginner: [
        { name: 'Tomatoes (Cherry)', spaceSqFt: 4, daysToHarvest: 60, sunNeeds: 'full', kidFriendly: true, startIndoors: 6, transplantAfterFrost: 2, harvestWindow: '8 weeks', water: 'moderate', notes: 'Great for snacking right off the vine' },
        { name: 'Zucchini', spaceSqFt: 9, daysToHarvest: 50, sunNeeds: 'full', kidFriendly: true, startIndoors: 4, transplantAfterFrost: 2, harvestWindow: '10 weeks', water: 'moderate', notes: 'Very productive - 2-3 plants feed a family' },
        { name: 'Green Beans (Bush)', spaceSqFt: 2, daysToHarvest: 55, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 1, harvestWindow: '3 weeks', water: 'moderate', notes: 'Easy to pick and kids love watching them grow' },
        { name: 'Lettuce (Leaf)', spaceSqFt: 1, daysToHarvest: 30, sunNeeds: 'partial', kidFriendly: true, directSow: true, sowBeforeFrost: 4, harvestWindow: '4 weeks', water: 'regular', notes: 'Cut-and-come-again harvesting' },
        { name: 'Radishes', spaceSqFt: 1, daysToHarvest: 25, sunNeeds: 'full', kidFriendly: true, directSow: true, sowBeforeFrost: 4, harvestWindow: '2 weeks', water: 'regular', notes: 'Fastest vegetable to harvest - great for impatient gardeners' },
        { name: 'Cucumbers', spaceSqFt: 6, daysToHarvest: 55, sunNeeds: 'full', kidFriendly: true, startIndoors: 3, transplantAfterFrost: 2, harvestWindow: '6 weeks', water: 'high', notes: 'Provide a trellis to save space' },
        { name: 'Peppers (Sweet Bell)', spaceSqFt: 2, daysToHarvest: 70, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, harvestWindow: '8 weeks', water: 'moderate', notes: 'Colorful and crunchy' },
        { name: 'Sugar Snap Peas', spaceSqFt: 2, daysToHarvest: 60, sunNeeds: 'full', kidFriendly: true, directSow: true, sowBeforeFrost: 4, harvestWindow: '3 weeks', water: 'moderate', notes: 'Eat pods and all - sweet and crispy' },
      ],
      intermediate: [
        { name: 'Tomatoes (Beefsteak)', spaceSqFt: 6, daysToHarvest: 85, sunNeeds: 'full', kidFriendly: true, startIndoors: 6, transplantAfterFrost: 2, harvestWindow: '6 weeks', water: 'moderate', notes: 'Needs staking and pruning for best results' },
        { name: 'Eggplant', spaceSqFt: 4, daysToHarvest: 70, sunNeeds: 'full', kidFriendly: false, startIndoors: 8, transplantAfterFrost: 3, harvestWindow: '8 weeks', water: 'moderate', notes: 'Loves heat - wait until soil is warm' },
        { name: 'Broccoli', spaceSqFt: 4, daysToHarvest: 80, sunNeeds: 'full', kidFriendly: true, startIndoors: 6, transplantBeforeFrost: 2, harvestWindow: '2 weeks', water: 'regular', notes: 'Cool season crop - harvest before flowers open' },
        { name: 'Carrots', spaceSqFt: 1, daysToHarvest: 70, sunNeeds: 'full', kidFriendly: true, directSow: true, sowBeforeFrost: 3, harvestWindow: '4 weeks', water: 'regular', notes: 'Needs loose, rock-free soil' },
        { name: 'Spinach', spaceSqFt: 1, daysToHarvest: 40, sunNeeds: 'partial', kidFriendly: true, directSow: true, sowBeforeFrost: 6, harvestWindow: '3 weeks', water: 'regular', notes: 'Bolts in heat - grow spring and fall' },
        { name: 'Winter Squash', spaceSqFt: 16, daysToHarvest: 90, sunNeeds: 'full', kidFriendly: true, startIndoors: 3, transplantAfterFrost: 2, harvestWindow: '4 weeks', water: 'moderate', notes: 'Needs lots of space but stores for months' },
        { name: 'Kale', spaceSqFt: 2, daysToHarvest: 55, sunNeeds: 'full', kidFriendly: false, startIndoors: 5, transplantBeforeFrost: 2, harvestWindow: '12 weeks', water: 'regular', notes: 'Gets sweeter after frost' },
        { name: 'Onions', spaceSqFt: 1, daysToHarvest: 100, sunNeeds: 'full', kidFriendly: false, startIndoors: 10, transplantBeforeFrost: 4, harvestWindow: '3 weeks', water: 'moderate', notes: 'Long season crop - start early' },
      ],
      expert: [
        { name: 'Artichokes', spaceSqFt: 16, daysToHarvest: 180, sunNeeds: 'full', kidFriendly: false, startIndoors: 10, transplantAfterFrost: 2, harvestWindow: '4 weeks', water: 'moderate', notes: 'Perennial in mild climates, needs vernalization' },
        { name: 'Cauliflower', spaceSqFt: 4, daysToHarvest: 80, sunNeeds: 'full', kidFriendly: true, startIndoors: 6, transplantBeforeFrost: 2, harvestWindow: '1 week', water: 'regular', notes: 'Blanching required for white heads' },
        { name: 'Melons', spaceSqFt: 16, daysToHarvest: 85, sunNeeds: 'full', kidFriendly: true, startIndoors: 4, transplantAfterFrost: 3, harvestWindow: '3 weeks', water: 'high', notes: 'Needs long hot summer and consistent moisture' },
        { name: 'Brussels Sprouts', spaceSqFt: 4, daysToHarvest: 100, sunNeeds: 'full', kidFriendly: false, startIndoors: 5, transplantBeforeFrost: 0, harvestWindow: '6 weeks', water: 'regular', notes: 'Long season - start in spring for fall harvest' },
        { name: 'Celery', spaceSqFt: 1, daysToHarvest: 120, sunNeeds: 'partial', kidFriendly: true, startIndoors: 12, transplantAfterFrost: 1, harvestWindow: '4 weeks', water: 'high', notes: 'Needs consistent moisture and cool temps' },
        { name: 'Leeks', spaceSqFt: 1, daysToHarvest: 120, sunNeeds: 'full', kidFriendly: false, startIndoors: 10, transplantBeforeFrost: 4, harvestWindow: '8 weeks', water: 'regular', notes: 'Trench planting for white stems' },
        { name: 'Hot Peppers (Specialty)', spaceSqFt: 2, daysToHarvest: 90, sunNeeds: 'full', kidFriendly: false, startIndoors: 10, transplantAfterFrost: 3, harvestWindow: '10 weeks', water: 'moderate', notes: 'Long germination time, needs heat' },
        { name: 'Asparagus', spaceSqFt: 4, daysToHarvest: 730, sunNeeds: 'full', kidFriendly: true, directSow: false, transplantBeforeFrost: 4, harvestWindow: '6 weeks', water: 'moderate', notes: 'Perennial - no harvest for 2 years but lasts 20+' },
      ]
    },
    flower: {
      beginner: [
        { name: 'Marigolds', spaceSqFt: 1, daysToBloom: 50, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, bloomWindow: '16 weeks', water: 'low', notes: 'Pest-deterrent, self-seeds' },
        { name: 'Zinnias', spaceSqFt: 1, daysToBloom: 60, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, bloomWindow: '14 weeks', water: 'moderate', notes: 'Cut-and-come-again flowers' },
        { name: 'Sunflowers', spaceSqFt: 2, daysToBloom: 70, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, bloomWindow: '2 weeks', water: 'low', notes: 'Kids love watching them grow tall' },
        { name: 'Cosmos', spaceSqFt: 2, daysToBloom: 60, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, bloomWindow: '12 weeks', water: 'low', notes: 'Airy and delicate, attracts butterflies' },
        { name: 'Nasturtiums', spaceSqFt: 2, daysToBloom: 50, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, bloomWindow: '14 weeks', water: 'low', notes: 'Edible flowers and leaves' },
        { name: 'Sweet Alyssum', spaceSqFt: 1, daysToBloom: 45, sunNeeds: 'partial', kidFriendly: true, directSow: true, sowBeforeFrost: 2, bloomWindow: '16 weeks', water: 'moderate', notes: 'Fragrant groundcover, self-seeds' },
        { name: 'Pansies', spaceSqFt: 1, daysToBloom: 70, sunNeeds: 'partial', kidFriendly: true, startIndoors: 8, transplantBeforeFrost: 4, bloomWindow: '8 weeks', water: 'moderate', notes: 'Cool season - spring and fall' },
        { name: 'Petunias', spaceSqFt: 1, daysToBloom: 75, sunNeeds: 'full', kidFriendly: true, startIndoors: 10, transplantAfterFrost: 1, bloomWindow: '18 weeks', water: 'moderate', notes: 'Cascading types great for containers' },
      ],
      intermediate: [
        { name: 'Dahlias', spaceSqFt: 4, daysToBloom: 90, sunNeeds: 'full', kidFriendly: true, startIndoors: 4, transplantAfterFrost: 2, bloomWindow: '12 weeks', water: 'moderate', notes: 'Tubers must be dug up in cold climates' },
        { name: 'Snapdragons', spaceSqFt: 1, daysToBloom: 80, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantBeforeFrost: 2, bloomWindow: '10 weeks', water: 'moderate', notes: 'Cool season bloomer, pinch for bushier plants' },
        { name: 'Larkspur', spaceSqFt: 1, daysToBloom: 90, sunNeeds: 'full', kidFriendly: false, directSow: true, sowBeforeFrost: 6, bloomWindow: '4 weeks', water: 'moderate', notes: 'Fall sow for spring bloom, toxic' },
        { name: 'Sweet Peas', spaceSqFt: 2, daysToBloom: 75, sunNeeds: 'full', kidFriendly: true, directSow: true, sowBeforeFrost: 4, bloomWindow: '6 weeks', water: 'regular', notes: 'Fragrant climber, needs cool weather' },
        { name: 'Coneflowers', spaceSqFt: 2, daysToBloom: 120, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, bloomWindow: '10 weeks', water: 'low', notes: 'Perennial, attracts pollinators' },
        { name: 'Black-Eyed Susans', spaceSqFt: 2, daysToBloom: 100, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, bloomWindow: '8 weeks', water: 'low', notes: 'Perennial, drought tolerant once established' },
        { name: 'Lavender', spaceSqFt: 4, daysToBloom: 180, sunNeeds: 'full', kidFriendly: true, startIndoors: 10, transplantAfterFrost: 2, bloomWindow: '6 weeks', water: 'low', notes: 'Perennial, needs excellent drainage' },
        { name: 'Stock', spaceSqFt: 1, daysToBloom: 75, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantBeforeFrost: 4, bloomWindow: '4 weeks', water: 'moderate', notes: 'Extremely fragrant, cool season' },
      ],
      expert: [
        { name: 'Lisianthus', spaceSqFt: 1, daysToBloom: 150, sunNeeds: 'full', kidFriendly: true, startIndoors: 16, transplantAfterFrost: 2, bloomWindow: '8 weeks', water: 'moderate', notes: 'Rose-like blooms, very slow to start' },
        { name: 'Ranunculus', spaceSqFt: 1, daysToBloom: 90, sunNeeds: 'full', kidFriendly: true, startIndoors: 0, transplantBeforeFrost: 8, bloomWindow: '6 weeks', water: 'moderate', notes: 'Pre-soak corms, needs cool temps' },
        { name: 'Delphiniums', spaceSqFt: 2, daysToBloom: 120, sunNeeds: 'full', kidFriendly: false, startIndoors: 10, transplantBeforeFrost: 2, bloomWindow: '3 weeks', water: 'regular', notes: 'Needs staking, toxic, short-lived perennial' },
        { name: 'Foxglove', spaceSqFt: 2, daysToBloom: 365, sunNeeds: 'partial', kidFriendly: false, startIndoors: 10, transplantBeforeFrost: 4, bloomWindow: '4 weeks', water: 'moderate', notes: 'Biennial - blooms second year, toxic' },
        { name: 'Poppies (Oriental)', spaceSqFt: 2, daysToBloom: 365, sunNeeds: 'full', kidFriendly: true, directSow: true, sowBeforeFrost: 8, bloomWindow: '2 weeks', water: 'low', notes: 'Perennial, fall sow, hates transplanting' },
        { name: 'Anemones', spaceSqFt: 1, daysToBloom: 90, sunNeeds: 'partial', kidFriendly: true, startIndoors: 0, transplantBeforeFrost: 6, bloomWindow: '6 weeks', water: 'moderate', notes: 'Soak corms, needs cool weather to bloom' },
        { name: 'Tuberose', spaceSqFt: 1, daysToBloom: 120, sunNeeds: 'full', kidFriendly: true, startIndoors: 6, transplantAfterFrost: 3, bloomWindow: '4 weeks', water: 'moderate', notes: 'Intensely fragrant, needs long hot summer' },
        { name: 'Dinner Plate Dahlias', spaceSqFt: 6, daysToBloom: 100, sunNeeds: 'full', kidFriendly: true, startIndoors: 4, transplantAfterFrost: 2, bloomWindow: '10 weeks', water: 'high', notes: 'Needs staking, disbudding, and heavy feeding' },
      ]
    },
    herb: {
      beginner: [
        { name: 'Basil', spaceSqFt: 1, daysToHarvest: 30, sunNeeds: 'full', kidFriendly: true, startIndoors: 4, transplantAfterFrost: 2, harvestWindow: '16 weeks', water: 'moderate', notes: 'Pinch flowers for bushier growth' },
        { name: 'Mint', spaceSqFt: 2, daysToHarvest: 30, sunNeeds: 'partial', kidFriendly: true, startIndoors: 0, transplantAfterFrost: 0, harvestWindow: '20 weeks', water: 'regular', notes: 'Invasive - grow in containers!' },
        { name: 'Chives', spaceSqFt: 1, daysToHarvest: 60, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantBeforeFrost: 2, harvestWindow: '20 weeks', water: 'moderate', notes: 'Perennial, edible flowers' },
        { name: 'Parsley', spaceSqFt: 1, daysToHarvest: 70, sunNeeds: 'partial', kidFriendly: true, startIndoors: 8, transplantBeforeFrost: 2, harvestWindow: '16 weeks', water: 'moderate', notes: 'Biennial, slow to germinate' },
        { name: 'Cilantro', spaceSqFt: 1, daysToHarvest: 30, sunNeeds: 'partial', kidFriendly: true, directSow: true, sowBeforeFrost: 2, harvestWindow: '3 weeks', water: 'regular', notes: 'Bolts fast in heat - succession plant' },
        { name: 'Dill', spaceSqFt: 1, daysToHarvest: 40, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, harvestWindow: '8 weeks', water: 'moderate', notes: 'Self-seeds, attracts beneficial insects' },
        { name: 'Oregano', spaceSqFt: 2, daysToHarvest: 45, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, harvestWindow: '16 weeks', water: 'low', notes: 'Perennial, spreading habit' },
        { name: 'Thyme', spaceSqFt: 1, daysToHarvest: 70, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, harvestWindow: '16 weeks', water: 'low', notes: 'Perennial, needs good drainage' },
      ],
      intermediate: [
        { name: 'Rosemary', spaceSqFt: 4, daysToHarvest: 90, sunNeeds: 'full', kidFriendly: true, startIndoors: 12, transplantAfterFrost: 2, harvestWindow: '52 weeks', water: 'low', notes: 'Perennial in mild climates, slow starter' },
        { name: 'Sage', spaceSqFt: 2, daysToHarvest: 75, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, harvestWindow: '16 weeks', water: 'low', notes: 'Perennial, prune to prevent woodiness' },
        { name: 'Lemon Balm', spaceSqFt: 2, daysToHarvest: 70, sunNeeds: 'partial', kidFriendly: true, startIndoors: 6, transplantAfterFrost: 1, harvestWindow: '20 weeks', water: 'moderate', notes: 'Spreads aggressively, contain it' },
        { name: 'Tarragon (French)', spaceSqFt: 2, daysToHarvest: 60, sunNeeds: 'full', kidFriendly: true, startIndoors: 0, transplantAfterFrost: 2, harvestWindow: '16 weeks', water: 'moderate', notes: 'Cannot grow from seed - buy plants' },
        { name: 'Chamomile', spaceSqFt: 1, daysToHarvest: 60, sunNeeds: 'full', kidFriendly: true, directSow: true, sowBeforeFrost: 4, harvestWindow: '8 weeks', water: 'moderate', notes: 'Self-seeds prolifically' },
        { name: 'Fennel', spaceSqFt: 2, daysToHarvest: 65, sunNeeds: 'full', kidFriendly: true, directSow: true, sowAfterFrost: 0, harvestWindow: '8 weeks', water: 'moderate', notes: 'Do not plant near dill - cross pollinates' },
        { name: 'Marjoram', spaceSqFt: 1, daysToHarvest: 60, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, harvestWindow: '14 weeks', water: 'moderate', notes: 'Tender perennial, similar to oregano' },
        { name: 'Lemongrass', spaceSqFt: 4, daysToHarvest: 100, sunNeeds: 'full', kidFriendly: true, startIndoors: 0, transplantAfterFrost: 3, harvestWindow: '16 weeks', water: 'high', notes: 'Tropical - overwinter indoors in cold climates' },
      ],
      expert: [
        { name: 'Saffron', spaceSqFt: 1, daysToHarvest: 365, sunNeeds: 'full', kidFriendly: true, startIndoors: 0, transplantBeforeFrost: 6, harvestWindow: '2 weeks', water: 'low', notes: 'Fall blooming crocus, hand-harvest stigmas' },
        { name: 'Ginger', spaceSqFt: 2, daysToHarvest: 300, sunNeeds: 'partial', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 4, harvestWindow: '4 weeks', water: 'high', notes: 'Tropical - needs 10 months warm weather' },
        { name: 'Turmeric', spaceSqFt: 2, daysToHarvest: 300, sunNeeds: 'partial', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 4, harvestWindow: '4 weeks', water: 'high', notes: 'Similar to ginger, stains everything' },
        { name: 'Stevia', spaceSqFt: 2, daysToHarvest: 90, sunNeeds: 'full', kidFriendly: true, startIndoors: 8, transplantAfterFrost: 2, harvestWindow: '12 weeks', water: 'moderate', notes: 'Tender perennial, prevent flowering for sweetest leaves' },
        { name: 'Bay Laurel', spaceSqFt: 4, daysToHarvest: 365, sunNeeds: 'partial', kidFriendly: true, startIndoors: 0, transplantAfterFrost: 2, harvestWindow: '52 weeks', water: 'low', notes: 'Slow growing tree, overwinter indoors' },
        { name: 'Cardamom', spaceSqFt: 4, daysToHarvest: 1095, sunNeeds: 'partial', kidFriendly: true, startIndoors: 0, transplantAfterFrost: 4, harvestWindow: '8 weeks', water: 'high', notes: 'Tropical, 3 years to harvest, needs humidity' },
        { name: 'Wasabi', spaceSqFt: 1, daysToHarvest: 730, sunNeeds: 'shade', kidFriendly: true, startIndoors: 0, transplantBeforeFrost: 4, harvestWindow: '52 weeks', water: 'high', notes: '2 years to harvest, needs cool running water' },
        { name: 'Vietnamese Coriander', spaceSqFt: 2, daysToHarvest: 60, sunNeeds: 'partial', kidFriendly: true, startIndoors: 0, transplantAfterFrost: 2, harvestWindow: '20 weeks', water: 'high', notes: 'Tropical, cuttings only, no seeds' },
      ]
    }
  };

  // Frost date data by first digit of ZIP code (rough approximation)
  const frostDatesByRegion = {
    '0': { lastFrost: 'April 15 - May 15', firstFrost: 'September 30 - October 30', zone: '5-6', defaultDate: '2026-05-01', historicalDates: ['2024-05-03', '2023-04-28', '2022-05-07', '2021-04-25', '2020-05-01'] },
    '1': { lastFrost: 'April 1 - May 1', firstFrost: 'October 15 - November 15', zone: '6-7', defaultDate: '2026-04-15', historicalDates: ['2024-04-12', '2023-04-18', '2022-04-14', '2021-04-20', '2020-04-15'] },
    '2': { lastFrost: 'March 15 - April 15', firstFrost: 'October 30 - November 30', zone: '7-8', defaultDate: '2026-04-01', historicalDates: ['2024-03-28', '2023-04-02', '2022-03-30', '2021-04-05', '2020-03-31'] },
    '3': { lastFrost: 'March 1 - April 1', firstFrost: 'November 15 - December 15', zone: '8-9', defaultDate: '2026-03-15', historicalDates: ['2024-03-12', '2023-03-18', '2022-03-14', '2021-03-20', '2020-03-16'] },
    '4': { lastFrost: 'April 15 - May 15', firstFrost: 'September 30 - October 30', zone: '5-6', defaultDate: '2026-05-01', historicalDates: ['2024-05-05', '2023-04-30', '2022-05-08', '2021-04-28', '2020-05-02'] },
    '5': { lastFrost: 'April 15 - May 15', firstFrost: 'September 30 - October 30', zone: '4-5', defaultDate: '2026-05-01', historicalDates: ['2024-05-08', '2023-05-02', '2022-05-10', '2021-04-30', '2020-05-05'] },
    '6': { lastFrost: 'April 15 - May 15', firstFrost: 'October 1 - October 30', zone: '5-6', defaultDate: '2026-05-01', historicalDates: ['2024-05-03', '2023-04-28', '2022-05-05', '2021-04-26', '2020-04-30'] },
    '7': { lastFrost: 'March 1 - April 1', firstFrost: 'November 1 - December 1', zone: '7-9', defaultDate: '2026-03-15', historicalDates: ['2024-03-10', '2023-03-16', '2022-03-12', '2021-03-18', '2020-03-14'] },
    '8': { lastFrost: 'March 15 - May 15', firstFrost: 'September 30 - November 30', zone: '4-9', defaultDate: '2026-04-15', historicalDates: ['2024-04-18', '2023-04-12', '2022-04-20', '2021-04-14', '2020-04-16'] },
    '9': { lastFrost: 'February 1 - April 15', firstFrost: 'November 1 - December 30', zone: '7-10', defaultDate: '2026-03-01', historicalDates: ['2024-02-28', '2023-03-05', '2022-03-01', '2021-03-08', '2020-03-02'] },
  };

  // Get median date from historical dates
  const getMedianFrostDate = (dates) => {
    const sorted = dates.map(d => new Date(d)).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianDate = sorted[mid];
    // Return as YYYY-MM-DD for current year
    return `2026-${String(medianDate.getMonth() + 1).padStart(2, '0')}-${String(medianDate.getDate()).padStart(2, '0')}`;
  };

  // Detailed planting and care instructions for each plant
  const plantInstructions = {
    // Vegetables
    'Tomatoes (Cherry)': { seedDepth: '1/4 inch', spacing: '24 inches', germDays: '5-10', waterFreq: '1-2 inches/week', careNotes: 'Stake or cage when 12" tall. Pinch suckers for larger fruits. Mulch to retain moisture.' },
    'Tomatoes (Beefsteak)': { seedDepth: '1/4 inch', spacing: '36 inches', germDays: '5-10', waterFreq: '1-2 inches/week', careNotes: 'Heavy feeders - side dress with compost monthly. Remove lower leaves as plant grows. Stake firmly.' },
    'Zucchini': { seedDepth: '1 inch', spacing: '36 inches', germDays: '4-7', waterFreq: '1-2 inches/week', careNotes: 'Harvest when 6-8" long. Check daily - they grow fast! Watch for squash vine borers.' },
    'Green Beans (Bush)': { seedDepth: '1 inch', spacing: '3-4 inches', germDays: '7-14', waterFreq: '1 inch/week', careNotes: 'Do not disturb roots. Pick frequently to encourage production. Avoid watering leaves.' },
    'Lettuce (Leaf)': { seedDepth: '1/8 inch (barely cover)', spacing: '4-6 inches', germDays: '2-10', waterFreq: 'Keep consistently moist', careNotes: 'Harvest outer leaves first. Provide afternoon shade in heat. Succession plant every 2 weeks.' },
    'Radishes': { seedDepth: '1/2 inch', spacing: '1-2 inches', germDays: '3-7', waterFreq: 'Keep evenly moist', careNotes: 'Fastest veggie! Thin promptly. Harvest before they get pithy. Great for interplanting.' },
    'Cucumbers': { seedDepth: '1 inch', spacing: '12 inches', germDays: '3-10', waterFreq: '1-2 inches/week', careNotes: 'Provide trellis or cage. Harvest frequently for continued production. Bitter fruit = water stress.' },
    'Peppers (Sweet Bell)': { seedDepth: '1/4 inch', spacing: '18-24 inches', germDays: '7-14', waterFreq: '1-2 inches/week', careNotes: 'Needs warm soil (65°F+). Support heavy branches. Green = immature; leave longer for color.' },
    'Sugar Snap Peas': { seedDepth: '1 inch', spacing: '2-3 inches', germDays: '7-14', waterFreq: '1 inch/week', careNotes: 'Provide 4-6 ft trellis. Pick frequently. Stops producing in heat - plant early!' },
    'Carrots': { seedDepth: '1/4 inch', spacing: '2 inches (thin)', germDays: '14-21 (slow!)', waterFreq: 'Keep evenly moist', careNotes: 'Patience! Slow to germinate. Keep soil moist until sprouted. Avoid rocks for straight roots.' },
    'Broccoli': { seedDepth: '1/4 inch', spacing: '18-24 inches', germDays: '5-10', waterFreq: '1-1.5 inches/week', careNotes: 'Harvest main head before flowers open. Side shoots continue for weeks. Watch for cabbage worms.' },
    'Spinach': { seedDepth: '1/2 inch', spacing: '4-6 inches', germDays: '5-14', waterFreq: 'Keep consistently moist', careNotes: 'Bolts quickly in heat/long days. Best spring and fall. Harvest outer leaves or cut whole plant.' },
    'Kale': { seedDepth: '1/2 inch', spacing: '12-18 inches', germDays: '5-10', waterFreq: '1-1.5 inches/week', careNotes: 'Harvest lower leaves first. Sweeter after frost. Remove yellowing leaves promptly.' },
    'Eggplant': { seedDepth: '1/4 inch', spacing: '24 inches', germDays: '7-14', waterFreq: '1-2 inches/week', careNotes: 'Needs heat! Wait until nights are warm. Stake heavy plants. Harvest when skin is glossy.' },
    'Winter Squash': { seedDepth: '1 inch', spacing: '48-72 inches', germDays: '7-14', waterFreq: '1-2 inches/week', careNotes: 'Needs lots of space! Cure in sun before storing. Ready when stem is dry and hard.' },
    'Onions': { seedDepth: '1/4 inch', spacing: '4-6 inches', germDays: '7-14', waterFreq: '1 inch/week', careNotes: 'Stop watering when tops fall over. Cure in sun for 1-2 weeks before storing.' },
    'Cauliflower': { seedDepth: '1/4 inch', spacing: '18-24 inches', germDays: '5-10', waterFreq: '1-2 inches/week', careNotes: 'Blanch by tying leaves over head when 2-3" diameter. Very temperature sensitive.' },
    'Melons': { seedDepth: '1 inch', spacing: '36-48 inches', germDays: '4-10', waterFreq: '1-2 inches/week', careNotes: 'Need heat and long season. Reduce water when fruits size up. Ripe when slips from vine.' },
    'Brussels Sprouts': { seedDepth: '1/2 inch', spacing: '24 inches', germDays: '5-10', waterFreq: '1-1.5 inches/week', careNotes: 'Long season crop. Remove lower leaves as sprouts develop. Sweeter after frost.' },
    'Celery': { seedDepth: 'Surface (needs light)', spacing: '8-10 inches', germDays: '14-21', waterFreq: '2 inches/week', careNotes: 'Heavy feeder and drinker. Blanch stems for milder flavor. Never let dry out.' },
    'Leeks': { seedDepth: '1/4 inch', spacing: '6 inches', germDays: '7-14', waterFreq: '1 inch/week', careNotes: 'Transplant into trenches, hill soil as they grow to blanch stems. Very cold hardy.' },
    'Asparagus': { seedDepth: '6-8 inches (crowns)', spacing: '18 inches', germDays: 'N/A - plant crowns', waterFreq: '1-2 inches/week', careNotes: 'No harvest for 2 years! Feed heavily in spring. Cut ferns after frost.' },
    'Artichokes': { seedDepth: '1/4 inch', spacing: '36-48 inches', germDays: '10-21', waterFreq: '1-2 inches/week', careNotes: 'Perennial zones 7+. Needs vernalization (cold period). Harvest before scales open.' },
    'Hot Peppers (Specialty)': { seedDepth: '1/4 inch', spacing: '18-24 inches', germDays: '14-28 (slow)', waterFreq: '1-2 inches/week', careNotes: 'Needs warmth for germination. Stress (less water) increases heat level.' },
    
    // Herbs
    'Basil': { seedDepth: '1/4 inch', spacing: '12 inches', germDays: '5-10', waterFreq: 'Moderate, when top inch dry', careNotes: 'Pinch flower buds immediately. Harvest by cutting stems, not leaves. Sensitive to cold.' },
    'Mint': { seedDepth: '1/4 inch', spacing: '18-24 inches', germDays: '10-14', waterFreq: '1-2 inches/week', careNotes: 'VERY invasive - grow in containers! Cut back hard mid-summer to rejuvenate.' },
    'Chives': { seedDepth: '1/4 inch', spacing: '6 inches', germDays: '10-14', waterFreq: 'Moderate', careNotes: 'Perennial. Cut to 2" to rejuvenate. Divide every 3 years. Edible flowers!' },
    'Parsley': { seedDepth: '1/4 inch', spacing: '6-8 inches', germDays: '14-28 (slow)', waterFreq: 'Keep moist', careNotes: 'Soak seeds overnight to speed germination. Biennial - harvest first year.' },
    'Cilantro': { seedDepth: '1/4 inch', spacing: '4-6 inches', germDays: '7-10', waterFreq: 'Keep evenly moist', careNotes: 'Bolts fast in heat! Succession plant every 2-3 weeks. Coriander seeds = cilantro seeds.' },
    'Dill': { seedDepth: '1/4 inch', spacing: '12 inches', germDays: '7-14', waterFreq: 'Moderate', careNotes: 'Does not transplant well. Self-seeds readily. Do not plant near fennel.' },
    'Oregano': { seedDepth: 'Surface (needs light)', spacing: '12 inches', germDays: '7-14', waterFreq: 'Let dry between watering', careNotes: 'Perennial. Cut back after flowering. More flavorful when slightly stressed.' },
    'Thyme': { seedDepth: 'Surface sow', spacing: '8-12 inches', germDays: '14-21', waterFreq: 'Low - let dry out', careNotes: 'Perennial. Needs excellent drainage. Trim after flowering to prevent woodiness.' },
    'Rosemary': { seedDepth: 'Surface sow', spacing: '24 inches', germDays: '15-25', waterFreq: 'Low - drought tolerant', careNotes: 'Perennial zones 8+. Needs excellent drainage. Overwinter indoors in cold climates.' },
    'Sage': { seedDepth: '1/8 inch', spacing: '18-24 inches', germDays: '10-21', waterFreq: 'Low to moderate', careNotes: 'Perennial. Prune in spring to prevent woodiness. Replace every 4-5 years.' },
    'Lemon Balm': { seedDepth: 'Surface sow', spacing: '18 inches', germDays: '10-14', waterFreq: 'Moderate', careNotes: 'Perennial. Spreads aggressively - contain in pots. Cut back to encourage fresh growth.' },
    'Chamomile': { seedDepth: 'Surface sow', spacing: '6-8 inches', germDays: '7-14', waterFreq: 'Moderate', careNotes: 'Self-seeds prolifically. Harvest flowers when fully open. German chamomile is annual.' },
    'Fennel': { seedDepth: '1/4 inch', spacing: '12 inches', germDays: '7-14', waterFreq: 'Moderate to high', careNotes: 'Do not plant near dill. For bulb fennel, hill soil around base. Harvest before bolting.' },
    'Lemongrass': { seedDepth: 'N/A - start from stalks', spacing: '36 inches', germDays: 'Root in water first', waterFreq: 'High - keep moist', careNotes: 'Tropical. Dig and overwinter indoors in cold climates. Start from grocery store stalks.' },
    'Marjoram': { seedDepth: '1/8 inch', spacing: '8-12 inches', germDays: '7-14', waterFreq: 'Moderate', careNotes: 'Tender perennial. Similar to oregano but sweeter. Bring indoors in cold climates.' },
    'Tarragon (French)': { seedDepth: 'N/A - buy plants', spacing: '18-24 inches', germDays: 'N/A', waterFreq: 'Moderate', careNotes: 'Cannot grow from seed - buy plants. Perennial. Divide every 3-4 years.' },
    'Saffron': { seedDepth: '3-4 inches (corms)', spacing: '4 inches', germDays: 'N/A - plant corms', waterFreq: 'Low', careNotes: 'Fall blooming crocus. Plant corms in late summer. Hand-harvest stigmas in morning.' },
    
    // Flowers
    'Marigolds': { seedDepth: '1/4 inch', spacing: '8-12 inches', germDays: '5-7', waterFreq: 'Low to moderate', careNotes: 'Deadhead for continuous bloom. Pest deterrent - great companion plant.' },
    'Zinnias': { seedDepth: '1/4 inch', spacing: '4-24 inches (by size)', germDays: '5-7', waterFreq: 'Moderate', careNotes: 'Cut flowers to encourage more blooms. Avoid overhead watering (powdery mildew).' },
    'Sunflowers': { seedDepth: '1 inch', spacing: '6-24 inches (by size)', germDays: '7-10', waterFreq: 'Moderate', careNotes: 'Stake tall varieties. For cut flowers, harvest when petals just start to open.' },
    'Cosmos': { seedDepth: '1/4 inch', spacing: '12-18 inches', germDays: '7-10', waterFreq: 'Low - drought tolerant', careNotes: 'Deadhead for continuous bloom. Too much fertilizer = fewer flowers.' },
    'Nasturtiums': { seedDepth: '1/2 inch', spacing: '10-12 inches', germDays: '10-14', waterFreq: 'Moderate', careNotes: 'Poor soil = more flowers. Edible flowers and leaves. Attracts aphids away from veggies.' },
    'Sweet Alyssum': { seedDepth: 'Surface sow', spacing: '6 inches', germDays: '5-10', waterFreq: 'Moderate', careNotes: 'Self-seeds readily. Trim after first bloom for repeat flowering. Fragrant groundcover.' },
    'Pansies': { seedDepth: '1/8 inch', spacing: '6-9 inches', germDays: '10-14', waterFreq: 'Keep moist', careNotes: 'Cool season flower. Deadhead regularly. Edible flowers! May overwinter mild climates.' },
    'Petunias': { seedDepth: 'Surface (needs light)', spacing: '12 inches', germDays: '7-14', waterFreq: 'Moderate', careNotes: 'Pinch young plants for bushier growth. Cut back mid-summer if leggy.' },
    'Dahlias': { seedDepth: '4-6 inches (tubers)', spacing: '18-24 inches', germDays: 'N/A - plant tubers', waterFreq: 'Moderate to high', careNotes: 'Stake tall varieties. Pinch for more blooms. Dig tubers before frost.' },
    'Snapdragons': { seedDepth: 'Surface sow', spacing: '6-12 inches', germDays: '10-14', waterFreq: 'Moderate', careNotes: 'Pinch seedlings for bushier plants. Cool season bloomer. May reseed.' },
    'Sweet Peas': { seedDepth: '1 inch', spacing: '6 inches', germDays: '10-14', waterFreq: 'Keep moist', careNotes: 'Soak seeds overnight. Provide 6ft trellis. Pick frequently to prolong bloom.' },
    'Lavender': { seedDepth: '1/8 inch', spacing: '12-18 inches', germDays: '14-28', waterFreq: 'Low - drought tolerant', careNotes: 'Needs excellent drainage. Prune after flowering, never into old wood.' },
    'Coneflowers': { seedDepth: '1/8 inch', spacing: '18 inches', germDays: '10-20', waterFreq: 'Low once established', careNotes: 'Perennial. Cold stratification helps germination. Leave seed heads for birds.' },
    'Black-Eyed Susans': { seedDepth: '1/8 inch', spacing: '18-24 inches', germDays: '7-21', waterFreq: 'Low once established', careNotes: 'Perennial. Very drought tolerant. Divide every 3-4 years. Self-seeds.' },
    'Larkspur': { seedDepth: '1/8 inch', spacing: '12 inches', germDays: '14-21', waterFreq: 'Moderate', careNotes: 'Fall sow for spring bloom. Cold stratification helps. TOXIC - keep away from kids/pets.' },
    'Stock': { seedDepth: '1/8 inch', spacing: '12 inches', germDays: '7-14', waterFreq: 'Moderate', careNotes: 'Extremely fragrant. Cool season - bolts in heat. Great cut flower.' },
    'Lisianthus': { seedDepth: 'Surface (needs light)', spacing: '6-9 inches', germDays: '14-21', waterFreq: 'Moderate', careNotes: 'Very slow! Start 16 weeks before transplant. Rose-like blooms worth the wait.' },
    'Ranunculus': { seedDepth: '1-2 inches (corms)', spacing: '6-9 inches', germDays: 'N/A - plant corms', waterFreq: 'Moderate', careNotes: 'Pre-soak corms 4 hours. Plant claws down. Needs cool temps to bloom.' },
    'Delphiniums': { seedDepth: '1/8 inch', spacing: '18-24 inches', germDays: '14-28', waterFreq: 'Regular', careNotes: 'Needs staking. TOXIC. Cut back after first bloom for second flush.' },
    'Foxglove': { seedDepth: 'Surface (needs light)', spacing: '18-24 inches', germDays: '14-21', waterFreq: 'Moderate', careNotes: 'Biennial - blooms second year. TOXIC. Self-seeds reliably.' },
    'Anemones': { seedDepth: '1-2 inches (corms)', spacing: '4-6 inches', germDays: 'N/A - plant corms', waterFreq: 'Moderate', careNotes: 'Soak corms overnight. Plant points down. Needs cool temps (35-55°F) to bloom.' },
    'Dinner Plate Dahlias': { seedDepth: '4-6 inches (tubers)', spacing: '24-36 inches', germDays: 'N/A - plant tubers', waterFreq: 'High', careNotes: 'Must stake! Disbud for larger blooms. Heavy feeders - fertilize every 2 weeks.' },
  };

  // Get detailed instructions for a plant
  const getPlantInstructions = (plantName) => {
    return plantInstructions[plantName] || {
      seedDepth: '1/4 inch',
      spacing: '12 inches',
      germDays: '7-14',
      waterFreq: 'Moderate',
      careNotes: 'Follow seed packet instructions for best results.'
    };
  };

  // Helper function to add/subtract weeks from a date
  const addWeeks = (date, weeks) => {
    const result = new Date(date);
    result.setDate(result.getDate() + (weeks * 7));
    return result;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Generate itinerary from selected plants
  const generateItinerary = () => {
    const placedCounts = getPlacedPlantCounts();
    if (!recommendations || Object.keys(placedCounts).length === 0) return;
    
    const lastFrost = new Date(formData.lastFrostDate || recommendations.frostDates.defaultDate);
    const tasks = [];

    // Get planted data from garden beds
    const plantedData = Object.entries(placedCounts).map(([name, qty]) => ({
      ...recommendations.plants.find(p => p.name === name),
      quantity: qty
    })).filter(p => p.name);

    plantedData.forEach(plant => {
      const instructions = getPlantInstructions(plant.name);
      
      if (plant.directSow) {
        // Direct sow plants
        let sowDate;
        if (plant.sowBeforeFrost) {
          sowDate = addWeeks(lastFrost, -plant.sowBeforeFrost);
        } else {
          sowDate = addWeeks(lastFrost, plant.sowAfterFrost || 0);
        }
        
        tasks.push({
          date: sowDate,
          plant: plant.name,
          quantity: plant.quantity,
          task: 'Direct sow seeds outdoors',
          icon: '🌱',
          details: `Sow ${plant.quantity} plant${plant.quantity > 1 ? 's' : ''} directly in the garden`,
          category: 'sow',
          instructions: {
            depth: instructions.seedDepth,
            spacing: instructions.spacing,
            germination: instructions.germDays,
            watering: `After sowing: ${instructions.waterFreq}`,
            tips: instructions.careNotes
          }
        });

        // Add harvest date
        const harvestDate = addWeeks(sowDate, Math.ceil(plant.daysToHarvest / 7) || Math.ceil(plant.daysToBloom / 7));
        tasks.push({
          date: harvestDate,
          plant: plant.name,
          quantity: plant.quantity,
          task: plant.daysToHarvest ? 'Begin harvesting' : 'Begins blooming',
          icon: plant.daysToHarvest ? '🥬' : '🌸',
          details: `${plant.harvestWindow || plant.bloomWindow} harvest/bloom window`,
          category: 'harvest',
          instructions: {
            tips: plant.daysToHarvest 
              ? `Harvest regularly to encourage continued production. ${instructions.careNotes}`
              : `Enjoy the blooms! Cut flowers to encourage more. ${instructions.careNotes}`
          }
        });

      } else {
        // Transplant plants
        let transplantDate;
        if (plant.transplantBeforeFrost) {
          transplantDate = addWeeks(lastFrost, -plant.transplantBeforeFrost);
        } else {
          transplantDate = addWeeks(lastFrost, plant.transplantAfterFrost || 0);
        }

        // Start indoors date
        if (plant.startIndoors > 0) {
          const startIndoorsDate = addWeeks(transplantDate, -plant.startIndoors);
          tasks.push({
            date: startIndoorsDate,
            plant: plant.name,
            quantity: plant.quantity,
            task: 'Start seeds indoors',
            icon: '🏠',
            details: `Start ${plant.quantity} seedling${plant.quantity > 1 ? 's' : ''} in seed trays or pots`,
            category: 'start',
            instructions: {
              depth: instructions.seedDepth,
              germination: instructions.germDays,
              watering: 'Keep soil moist but not waterlogged. Use spray bottle to avoid disturbing seeds.',
              tips: `Use seed starting mix. Provide warmth (65-75°F) and light. Thin to strongest seedling per cell.`
            }
          });
        }

        // Transplant date
        tasks.push({
          date: transplantDate,
          plant: plant.name,
          quantity: plant.quantity,
          task: 'Transplant outdoors',
          icon: '🪴',
          details: `Move ${plant.quantity} seedling${plant.quantity > 1 ? 's' : ''} to the garden`,
          category: 'transplant',
          instructions: {
            spacing: instructions.spacing,
            watering: `After transplanting: Water deeply. Then ${instructions.waterFreq}`,
            tips: `Harden off seedlings for 7-10 days first. Transplant in evening or on cloudy day. Water well after planting.`
          }
        });

        // Add harvest date
        const harvestDate = addWeeks(transplantDate, Math.ceil(plant.daysToHarvest / 7) || Math.ceil(plant.daysToBloom / 7));
        tasks.push({
          date: harvestDate,
          plant: plant.name,
          quantity: plant.quantity,
          task: plant.daysToHarvest ? 'Begin harvesting' : 'Begins blooming',
          icon: plant.daysToHarvest ? '🥬' : '🌸',
          details: `${plant.harvestWindow || plant.bloomWindow} harvest/bloom window`,
          category: 'harvest',
          instructions: {
            tips: plant.daysToHarvest 
              ? `Harvest regularly to encourage continued production. ${instructions.careNotes}`
              : `Enjoy the blooms! Cut flowers to encourage more. ${instructions.careNotes}`
          }
        });
      }
    });

    // Sort by date
    tasks.sort((a, b) => a.date - b.date);

    // Add last frost marker
    tasks.push({
      date: lastFrost,
      plant: '⚠️ FROST DATE',
      task: 'Last expected frost',
      icon: '❄️',
      details: 'Frost-sensitive plants can go outside after this date',
      category: 'frost',
      isMilestone: true
    });

    // Re-sort with frost date included
    tasks.sort((a, b) => a.date - b.date);

    setItinerary(tasks);
    setStep(5);
  };

  // Generate monthly care tasks
  const getMonthlyCareTasks = (monthName) => {
    const careTasks = [];
    const placedCounts = getPlacedPlantCounts();
    const plantNames = Object.keys(placedCounts);
    
    if (plantNames.length === 0) return careTasks;
    
    // Get month number for seasonal logic
    const monthNum = new Date(monthName + ' 1, 2025').getMonth();
    const isHotMonth = [5, 6, 7, 8].includes(monthNum); // June-September
    const _isCoolMonth = [2, 3, 4, 9, 10].includes(monthNum); // March-May, Oct-Nov
    
    // Group plants by water needs
    const highWaterPlants = plantNames.filter(name => {
      const plant = recommendations?.plants.find(p => p.name === name);
      return plant?.water === 'high' || plant?.water === 'regular';
    });
    const lowWaterPlants = plantNames.filter(name => {
      const plant = recommendations?.plants.find(p => p.name === name);
      return plant?.water === 'low';
    });
    const moderateWaterPlants = plantNames.filter(name => {
      const plant = recommendations?.plants.find(p => p.name === name);
      return plant?.water === 'moderate';
    });
    
    // Watering tasks
    if (highWaterPlants.length > 0) {
      careTasks.push({
        icon: '💧',
        title: `Water ${highWaterPlants.slice(0, 3).join(', ')}${highWaterPlants.length > 3 ? ` +${highWaterPlants.length - 3} more` : ''}`,
        frequency: isHotMonth ? 'Daily or every other day' : 'Every 2-3 days',
        details: isHotMonth 
          ? 'These plants need consistent moisture. Water deeply in the morning. Check soil moisture daily during heat waves - may need twice daily watering in extreme heat.'
          : 'Keep soil consistently moist but not waterlogged. Water when top inch of soil feels dry.'
      });
    }
    
    if (moderateWaterPlants.length > 0) {
      careTasks.push({
        icon: '💧',
        title: `Water ${moderateWaterPlants.slice(0, 3).join(', ')}${moderateWaterPlants.length > 3 ? ` +${moderateWaterPlants.length - 3} more` : ''}`,
        frequency: isHotMonth ? 'Every 2-3 days' : 'Every 3-4 days',
        details: 'Allow soil to dry slightly between waterings. Water deeply when you do water - shallow watering encourages weak roots.'
      });
    }
    
    if (lowWaterPlants.length > 0) {
      careTasks.push({
        icon: '💧',
        title: `Water ${lowWaterPlants.slice(0, 3).join(', ')}${lowWaterPlants.length > 3 ? ` +${lowWaterPlants.length - 3} more` : ''}`,
        frequency: 'Once per week or less',
        details: 'These drought-tolerant plants prefer to dry out between waterings. Overwatering is worse than underwatering for these varieties.'
      });
    }
    
    // Weeding
    careTasks.push({
      icon: '🌿',
      title: 'Weed garden beds',
      frequency: '2-3 times per week',
      details: 'Pull weeds when small - they\'re easier to remove and haven\'t stolen nutrients yet. Weeding after rain or watering makes it easier. Add mulch to suppress new weeds.'
    });
    
    // Pest checking (growing season)
    if (monthNum >= 4 && monthNum <= 9) {
      careTasks.push({
        icon: '🔍',
        title: 'Check for pests and diseases',
        frequency: 'Every 2-3 days',
        details: 'Inspect plants carefully, especially undersides of leaves. Look for holes, discoloration, eggs, or insects. Early detection prevents major infestations. Remove affected leaves promptly.'
      });
    }
    
    // Fertilizing for heavy feeders (growing season)
    const heavyFeeders = plantNames.filter(n => 
      n.includes('Tomato') || n.includes('Pepper') || n.includes('Squash') || 
      n.includes('Cucumber') || n.includes('Melon') || n.includes('Eggplant') ||
      n.includes('Broccoli') || n.includes('Cauliflower') || n.includes('Dahlia')
    );
    if (heavyFeeders.length > 0 && monthNum >= 5 && monthNum <= 8) {
      careTasks.push({
        icon: '🌱',
        title: `Fertilize ${heavyFeeders.join(', ')}`,
        frequency: 'Every 2-3 weeks',
        details: 'These heavy feeders need regular nutrients during active growth. Use balanced fertilizer or side-dress with compost. Avoid high nitrogen after fruit set (promotes leaves over fruit).'
      });
    }
    
    // Tomato-specific care
    if (plantNames.some(n => n.includes('Tomato')) && monthNum >= 5 && monthNum <= 8) {
      careTasks.push({
        icon: '✂️',
        title: 'Prune tomato suckers',
        frequency: 'Weekly',
        details: 'Remove suckers (shoots growing between main stem and branches) when small. This directs energy to fruit production and improves air circulation. Leave 1-2 suckers on indeterminate varieties.'
      });
    }
    
    // Basil care
    if (plantNames.some(n => n.includes('Basil')) && monthNum >= 5 && monthNum <= 9) {
      careTasks.push({
        icon: '✂️',
        title: 'Pinch basil flowers and harvest',
        frequency: 'Every few days',
        details: 'Pinch off flower buds as soon as they appear - flowering makes leaves bitter. Harvest by cutting whole stems just above a leaf pair to encourage bushier growth.'
      });
    }
    
    // Deadheading flowers
    const flowers = plantNames.filter(name => {
      const plant = recommendations?.plants.find(p => p.name === name);
      return plant?.daysToBloom;
    });
    if (flowers.length > 0 && monthNum >= 5 && monthNum <= 9) {
      careTasks.push({
        icon: '✂️',
        title: `Deadhead ${flowers.slice(0, 3).join(', ')}${flowers.length > 3 ? ' +more' : ''}`,
        frequency: 'Every few days',
        details: 'Remove spent blooms to encourage continuous flowering. Cut stem back to just above a leaf or bud. This prevents the plant from putting energy into seed production.'
      });
    }
    
    // Mulching (early summer)
    if (monthNum === 5 || monthNum === 6) {
      careTasks.push({
        icon: '🍂',
        title: 'Check and replenish mulch',
        frequency: 'Once this month',
        details: 'Maintain 2-3 inches of mulch around plants to retain moisture, suppress weeds, and regulate soil temperature. Keep mulch a few inches away from plant stems to prevent rot.'
      });
    }
    
    return careTasks;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getExperienceKey = (exp) => {
    if (exp === 'beginner') return 'beginner';
    if (exp === 'intermediate') return 'intermediate';
    return 'expert';
  };

  const generateRecommendations = () => {
    const { gardenType, zipCode, experience, kidFriendly, sunExposure } = formData;
    
    const expKey = getExperienceKey(experience);
    let availablePlants = [];
    
    // Get plants based on garden type and experience
    if (gardenType === 'mixed') {
      availablePlants = [
        ...plantDatabase.vegetable[expKey],
        ...plantDatabase.flower[expKey],
        ...plantDatabase.herb[expKey],
      ];
      // Include easier plants too
      if (expKey === 'intermediate') {
        availablePlants = [
          ...availablePlants,
          ...plantDatabase.vegetable.beginner,
          ...plantDatabase.flower.beginner,
          ...plantDatabase.herb.beginner,
        ];
      } else if (expKey === 'expert') {
        availablePlants = [
          ...availablePlants,
          ...plantDatabase.vegetable.intermediate,
          ...plantDatabase.flower.intermediate,
          ...plantDatabase.herb.intermediate,
          ...plantDatabase.vegetable.beginner,
          ...plantDatabase.flower.beginner,
          ...plantDatabase.herb.beginner,
        ];
      }
    } else if (plantDatabase[gardenType]) {
      availablePlants = [...plantDatabase[gardenType][expKey]];
      // Include some easier plants if intermediate/expert
      if (expKey === 'intermediate') {
        availablePlants = [...availablePlants, ...plantDatabase[gardenType].beginner];
      } else if (expKey === 'expert') {
        availablePlants = [...availablePlants, ...plantDatabase[gardenType].intermediate, ...plantDatabase[gardenType].beginner];
      }
    }

    // Remove duplicates
    availablePlants = availablePlants.filter((plant, index, self) => 
      index === self.findIndex(p => p.name === plant.name)
    );

    // Filter by sun exposure
    if (sunExposure === 'partial') {
      availablePlants = availablePlants.filter(p => p.sunNeeds === 'partial' || p.sunNeeds === 'full');
    } else if (sunExposure === 'shade') {
      availablePlants = availablePlants.filter(p => p.sunNeeds === 'partial' || p.sunNeeds === 'shade');
    }

    // Filter by kid-friendly if needed
    if (kidFriendly === true) {
      availablePlants = availablePlants.filter(p => p.kidFriendly);
    }

    // Sort by space efficiency (smaller plants first)
    availablePlants.sort((a, b) => a.spaceSqFt - b.spaceSqFt);

    // Get frost dates
    const regionKey = zipCode ? zipCode[0] : '5';
    const frostDates = frostDatesByRegion[regionKey] || frostDatesByRegion['5'];

    setRecommendations({
      plants: availablePlants,
      frostDates,
      zipCode
    });
  };

  const togglePlantSelection = (plantName) => {
    setSelectedPlants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(plantName)) {
        newSet.delete(plantName);
      } else {
        newSet.add(plantName);
      }
      return newSet;
    });
  };

  const selectAllPlants = () => {
    if (!recommendations) return;
    setSelectedPlants(new Set(recommendations.plants.map(p => p.name)));
  };

  const deselectAllPlants = () => {
    setSelectedPlants(new Set());
  };

  // Get detailed plant info for the info modal
  const getPlantInfo = (plantName) => {
    const plant = recommendations?.plants.find(p => p.name === plantName);
    if (!plant) return null;

    const size = Math.ceil(Math.sqrt(plant.spaceSqFt));
    
    // Companion planting info (simplified)
    const companions = {
      'Tomatoes (Cherry)': { good: ['Basil', 'Carrots', 'Parsley'], bad: ['Cabbage', 'Fennel'] },
      'Tomatoes (Beefsteak)': { good: ['Basil', 'Carrots', 'Parsley'], bad: ['Cabbage', 'Fennel'] },
      'Zucchini': { good: ['Corn', 'Beans', 'Radishes'], bad: ['Potatoes'] },
      'Peppers (Sweet Bell)': { good: ['Tomatoes', 'Basil', 'Carrots'], bad: ['Fennel'] },
      'Cucumbers': { good: ['Beans', 'Peas', 'Radishes'], bad: ['Sage', 'Mint'] },
      'Lettuce (Leaf)': { good: ['Carrots', 'Radishes', 'Strawberries'], bad: [] },
      'Basil': { good: ['Tomatoes', 'Peppers'], bad: ['Sage'] },
      'Carrots': { good: ['Lettuce', 'Tomatoes', 'Onions'], bad: ['Dill'] },
      'Green Beans (Bush)': { good: ['Corn', 'Cucumbers', 'Carrots'], bad: ['Onions', 'Garlic'] },
      'Radishes': { good: ['Lettuce', 'Peas', 'Cucumbers'], bad: [] },
    };

    const plantCompanions = companions[plant.name] || { good: [], bad: [] };

    return {
      ...plant,
      size,
      companions: plantCompanions,
      tips: [
        plant.directSow ? '🌱 Can be direct sown outdoors' : '🏠 Start indoors for best results',
        plant.water === 'high' ? '💧 Needs consistent moisture - don\'t let soil dry out' :
        plant.water === 'low' ? '💧 Drought tolerant - avoid overwatering' :
        '💧 Water when top inch of soil is dry',
        plant.sunNeeds === 'full' ? '☀️ Needs at least 6 hours of direct sunlight' :
        plant.sunNeeds === 'partial' ? '⛅ Prefers morning sun with afternoon shade' :
        '🌥️ Thrives in shaded areas',
        `📅 Ready to ${plant.daysToHarvest ? 'harvest' : 'bloom'} in about ${plant.daysToHarvest || plant.daysToBloom} days`,
        `📐 Each plant needs ${plant.spaceSqFt} sq ft (${size}×${size} grid)`,
      ]
    };
  };

  const _getSelectedPlantCount = () => {
    return selectedPlants.size;
  };

  // Garden bed management
  const addGardenBed = () => {
    const newId = Math.max(...gardenBeds.map(b => b.id), 0) + 1;
    setGardenBeds(prev => [...prev, {
      id: newId,
      name: `Bed ${newId}`,
      width: 4,
      length: 4,
      plants: []
    }]);
  };

  const updateBed = (bedId, updates) => {
    setGardenBeds(prev => prev.map(bed => 
      bed.id === bedId ? { ...bed, ...updates } : bed
    ));
  };

  const removeBed = (bedId) => {
    if (gardenBeds.length <= 1) return;
    setGardenBeds(prev => prev.filter(bed => bed.id !== bedId));
    if (currentBedId === bedId) {
      setCurrentBedId(gardenBeds.find(b => b.id !== bedId)?.id || 1);
    }
  };

  const getPlantColor = (plantName) => {
    const colors = [
      'bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400',
      'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400',
      'bg-cyan-400', 'bg-sky-400', 'bg-blue-400', 'bg-indigo-400',
      'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400',
    ];
    const index = plantName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getPlantEmoji = (plantName) => {
    const plant = recommendations?.plants.find(p => p.name === plantName);
    if (!plant) return '🌱';
    if (plant.daysToBloom) return '🌸';
    if (plantName.toLowerCase().includes('tomato')) return '🍅';
    if (plantName.toLowerCase().includes('pepper')) return '🌶️';
    if (plantName.toLowerCase().includes('carrot')) return '🥕';
    if (plantName.toLowerCase().includes('lettuce') || plantName.toLowerCase().includes('spinach') || plantName.toLowerCase().includes('kale')) return '🥬';
    if (plantName.toLowerCase().includes('cucumber')) return '🥒';
    if (plantName.toLowerCase().includes('squash') || plantName.toLowerCase().includes('zucchini')) return '🎃';
    if (plantName.toLowerCase().includes('bean') || plantName.toLowerCase().includes('pea')) return '🫛';
    if (plantName.toLowerCase().includes('herb') || plantName.toLowerCase().includes('basil') || plantName.toLowerCase().includes('mint') || plantName.toLowerCase().includes('cilantro')) return '🌿';
    return '🌱';
  };

  // Calculate how many of each plant are placed
  const getPlacedPlantCounts = () => {
    const counts = {};
    gardenBeds.forEach(bed => {
      bed.plants.forEach(plant => {
        counts[plant.name] = (counts[plant.name] || 0) + 1;
      });
    });
    return counts;
  };

  // Get total plants placed across all beds
  const getTotalPlantsPlaced = () => {
    return gardenBeds.reduce((total, bed) => total + bed.plants.length, 0);
  };

  // Get total space used across all beds
  const getTotalSpaceUsed = () => {
    let total = 0;
    gardenBeds.forEach(bed => {
      bed.plants.forEach(plant => {
        const plantData = recommendations?.plants.find(p => p.name === plant.name);
        total += plantData?.spaceSqFt || 1;
      });
    });
    return total;
  };

  // Get total bed space available
  const getTotalBedSpace = () => {
    return gardenBeds.reduce((total, bed) => total + (bed.width * bed.length), 0);
  };

  // Place a plant on the grid
  const placePlant = (bedId, row, col, plantName) => {
    const plant = recommendations?.plants.find(p => p.name === plantName);
    if (!plant) return false;

    const bed = gardenBeds.find(b => b.id === bedId);
    if (!bed) return false;

    // Calculate plant size (square root of space, rounded up)
    const size = Math.ceil(Math.sqrt(plant.spaceSqFt));

    // Check if plant fits at this position
    if (row + size > bed.length || col + size > bed.width) {
      return false;
    }

    // Check if any cells are already occupied
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        if (bed.plants.some(p => {
          const pSize = Math.ceil(Math.sqrt(recommendations?.plants.find(pl => pl.name === p.name)?.spaceSqFt || 1));
          return r >= p.row && r < p.row + pSize && c >= p.col && c < p.col + pSize;
        })) {
          return false;
        }
      }
    }

    // Place the plant
    setGardenBeds(prev => prev.map(b => 
      b.id === bedId 
        ? { ...b, plants: [...b.plants, { name: plantName, row, col, id: Date.now() }] }
        : b
    ));
    return true;
  };

  const removePlantFromBed = (bedId, plantId) => {
    setGardenBeds(prev => prev.map(b =>
      b.id === bedId
        ? { ...b, plants: b.plants.filter(p => p.id !== plantId) }
        : b
    ));
  };

  // Check if a cell is occupied
  const getCellOccupant = (bed, row, col) => {
    for (const plant of bed.plants) {
      const plantData = recommendations?.plants.find(p => p.name === plant.name);
      const size = Math.ceil(Math.sqrt(plantData?.spaceSqFt || 1));
      if (row >= plant.row && row < plant.row + size && 
          col >= plant.col && col < plant.col + size) {
        return { ...plant, size, isOrigin: row === plant.row && col === plant.col };
      }
    }
    return null;
  };

  // Check if a plant can be placed at a given position
  const _canPlacePlantAt = (bed, row, col, plantName) => {
    const plant = recommendations?.plants.find(p => p.name === plantName);
    if (!plant) return false;

    const size = Math.ceil(Math.sqrt(plant.spaceSqFt));

    // Check if plant fits within bed boundaries
    if (row + size > bed.length || col + size > bed.width) {
      return false;
    }

    // Check if any cells are already occupied
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        if (getCellOccupant(bed, r, c)) {
          return false;
        }
      }
    }

    return true;
  };

  // Get cells that would be covered by a plant placement preview
  const getPreviewCells = (bed, row, col, plantName) => {
    if (!plantName || row === null || col === null) return { cells: [], canPlace: false };
    
    const plant = recommendations?.plants.find(p => p.name === plantName);
    if (!plant) return { cells: [], canPlace: false };

    const size = Math.ceil(Math.sqrt(plant.spaceSqFt));
    const cells = [];
    let canPlace = true;

    // Check boundaries
    if (row + size > bed.length || col + size > bed.width) {
      canPlace = false;
    }

    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) {
        // Only add cells that are within bounds
        if (r < bed.length && c < bed.width) {
          const isOccupied = getCellOccupant(bed, r, c) !== null;
          if (isOccupied) canPlace = false;
          cells.push({ row: r, col: c });
        }
      }
    }

    return { cells, canPlace };
  };

  // Group itinerary items by month
  const groupByMonth = (tasks) => {
    const grouped = {};
    tasks.forEach(task => {
      const monthKey = task.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(task);
    });
    return grouped;
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'start': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'sow': return 'bg-green-100 border-green-300 text-green-800';
      case 'transplant': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'harvest': return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'frost': return 'bg-cyan-100 border-cyan-300 text-cyan-800';
      case 'water': return 'bg-sky-100 border-sky-300 text-sky-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Dashboard helpers
  const getTaskId = (task) => {
    return `${task.plant}-${task.task}-${task.date.toISOString().split('T')[0]}`;
  };

  const toggleTaskComplete = (task) => {
    const taskId = getTaskId(task);
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const isTaskComplete = (task) => {
    return completedTasks.has(getTaskId(task));
  };

  // Get tasks for a specific date range
  const getTasksForDateRange = (startDate, endDate) => {
    return itinerary.filter(task => {
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return taskDate >= start && taskDate <= end;
    });
  };

  const getTodaysTasks = () => {
    const today = new Date(currentDate);
    return getTasksForDateRange(today, today);
  };

  const getUpcomingTasks = (days = 7) => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() + 1);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + days);
    return getTasksForDateRange(start, end);
  };

  const getOverdueTasks = () => {
    // Create a clean "today" date at midnight for comparison
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    return itinerary.filter(task => {
      if (task.isMilestone) return false;
      if (isTaskComplete(task)) return false;
      
      // Create a clean task date at midnight for comparison
      const taskDate = new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate());
      
      return taskDate.getTime() < today.getTime();
    });
  };

  // Get completed tasks (for display)
  const getCompletedTasks = () => {
    return itinerary.filter(task => isTaskComplete(task) && !task.isMilestone);
  };

  // Generate recurring watering tasks
  const getWateringTasks = () => {
    const today = new Date(currentDate);
    const tasks = [];
    const placedCounts = getPlacedPlantCounts();
    
    Object.entries(placedCounts).forEach(([plantName, qty]) => {
      const plant = recommendations?.plants.find(p => p.name === plantName);
      if (!plant) return;
      
      // Water frequency based on plant needs
      let frequency = 'Every 2-3 days';
      if (plant.water === 'high') frequency = 'Daily';
      if (plant.water === 'low') frequency = 'Every 4-5 days';
      
      tasks.push({
        date: today,
        plant: plantName,
        quantity: qty,
        task: 'Water plants',
        icon: '💧',
        details: `${frequency} - ${plant.water} water needs`,
        category: 'water',
        isRecurring: true
      });
    });
    
    return tasks;
  };

  // Launch dashboard after completing itinerary
  const launchDashboard = () => {
    setViewMode('dashboard');
  };

  // Generate PDF for download
  const generatePDF = () => {
    const placedCounts = getPlacedPlantCounts();
    const groupedTasks = groupByMonth(itinerary);
    const frostData = frostDatesByRegion[formData.zipCode?.[0] || '5'];
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Garden Planting Itinerary</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 11px; }
          h1 { color: #166534; margin-bottom: 8px; font-size: 1.5rem; }
          h2 { color: #166534; margin-top: 24px; margin-bottom: 12px; font-size: 1.1rem; border-bottom: 2px solid #166534; padding-bottom: 4px; }
          h3 { color: #374151; margin-top: 20px; margin-bottom: 8px; font-size: 1rem; background: #f3f4f6; padding: 8px; border-radius: 4px; }
          h4 { color: #0f766e; margin-top: 12px; margin-bottom: 8px; font-size: 0.9rem; }
          .subtitle { color: #6b7280; margin-bottom: 24px; }
          .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 12px; }
          .info-item label { font-size: 0.7rem; color: #6b7280; display: block; }
          .info-item span { font-weight: 600; }
          .plant-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
          .plant-tag { background: #e5e7eb; padding: 4px 12px; border-radius: 16px; font-size: 0.8rem; }
          .care-box { background: #f0fdfa; border: 1px solid #99f6e4; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
          .care-task { background: white; padding: 8px; border-radius: 4px; margin-bottom: 6px; }
          .care-title { font-weight: 600; color: #0f766e; }
          .care-freq { font-size: 0.75rem; color: #14b8a6; font-weight: 500; }
          .care-details { font-size: 0.7rem; color: #6b7280; margin-top: 4px; }
          .task { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px; page-break-inside: avoid; }
          .task-header { display: flex; gap: 12px; align-items: flex-start; }
          .task-icon { font-size: 1.1rem; }
          .task-content { flex: 1; }
          .task-plant { font-weight: 600; }
          .task-action { font-size: 0.85rem; color: #374151; }
          .task-details { font-size: 0.75rem; color: #6b7280; margin-top: 4px; }
          .task-date { font-weight: 600; font-size: 0.85rem; white-space: nowrap; }
          .task-instructions { background: #fafafa; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 0.75rem; }
          .task-instructions div { margin-bottom: 4px; }
          .task-instructions .label { font-weight: 600; }
          .task.start { background: #faf5ff; border-color: #e9d5ff; }
          .task.sow { background: #f0fdf4; border-color: #bbf7d0; }
          .task.transplant { background: #eff6ff; border-color: #bfdbfe; }
          .task.harvest { background: #fffbeb; border-color: #fde68a; }
          .task.frost { background: #ecfeff; border-color: #a5f3fc; }
          .summary { background: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 24px; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 0.7rem; color: #9ca3af; text-align: center; }
          @media print { body { padding: 20px; } .task { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>🌱 Garden Planting Itinerary</h1>
        <p class="subtitle">Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <div class="info-box">
          <strong>Growing Zone Information</strong>
          <div class="info-grid">
            <div class="info-item">
              <label>ZIP Code</label>
              <span>${formData.zipCode || 'N/A'}</span>
            </div>
            <div class="info-item">
              <label>Last Frost Date</label>
              <span>${new Date(formData.lastFrostDate || frostData?.defaultDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="info-item">
              <label>Zone</label>
              <span>${frostData?.zone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <h2>Your Plants (${getTotalPlantsPlaced()} total)</h2>
        <div class="plant-list">
          ${Object.entries(placedCounts).map(([name, qty]) => 
            `<span class="plant-tag">${name} ×${qty}</span>`
          ).join('')}
        </div>

        <h2>Planting Schedule</h2>
        ${Object.entries(groupedTasks).map(([month, tasks]) => {
          const monthlyCareTasks = getMonthlyCareTasks(month, tasks);
          return `
            <h3>📅 ${month}</h3>
            
            ${monthlyCareTasks.length > 0 ? `
              <div class="care-box">
                <h4>🔄 Recurring Tasks for ${month.split(' ')[0]}</h4>
                ${monthlyCareTasks.map(care => `
                  <div class="care-task">
                    <span>${care.icon}</span>
                    <span class="care-title">${care.title}</span>
                    <span class="care-freq"> — ${care.frequency}</span>
                    <div class="care-details">${care.details}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${tasks.map(task => `
              <div class="task ${task.category}">
                <div class="task-header">
                  <span class="task-icon">${task.icon}</span>
                  <div class="task-content">
                    <div class="task-plant">${task.plant}${task.quantity > 1 ? ` ×${task.quantity}` : ''}</div>
                    <div class="task-action">${task.task}</div>
                    ${task.details ? `<div class="task-details">${task.details}</div>` : ''}
                  </div>
                  <div class="task-date">${formatDate(task.date)}</div>
                </div>
                ${task.instructions ? `
                  <div class="task-instructions">
                    ${task.instructions.depth ? `<div><span class="label">📏 Planting depth:</span> ${task.instructions.depth}</div>` : ''}
                    ${task.instructions.spacing ? `<div><span class="label">↔️ Spacing:</span> ${task.instructions.spacing} apart</div>` : ''}
                    ${task.instructions.germination ? `<div><span class="label">🌱 Germination:</span> ${task.instructions.germination} days</div>` : ''}
                    ${task.instructions.watering ? `<div><span class="label">💧 Watering:</span> ${task.instructions.watering}</div>` : ''}
                    ${task.instructions.tips ? `<div style="margin-top:6px; padding-top:6px; border-top:1px solid #e5e7eb;"><span class="label">💡 Tips:</span> ${task.instructions.tips}</div>` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          `;
        }).join('')}

        <div class="summary">
          <strong>Summary</strong>
          <div class="summary-grid">
            <div>Total Tasks: ${itinerary.length}</div>
            <div>Plants: ${getTotalPlantsPlaced()}</div>
            <div>Varieties: ${Object.keys(placedCounts).length}</div>
            <div>Garden Beds: ${gardenBeds.length}</div>
            <div>First Task: ${formatDate(itinerary[0]?.date)}</div>
            <div>Last Task: ${formatDate(itinerary[itinerary.length - 1]?.date)}</div>
          </div>
        </div>

        <div class="footer">
          Created with Garden Planner • For best results, adjust dates based on local weather conditions
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const renderStep5 = () => {
    const groupedTasks = groupByMonth(itinerary);
    const months = Object.keys(groupedTasks);
    const placedCounts = getPlacedPlantCounts();
    const totalPlaced = getTotalPlantsPlaced();

    return (
      <div className="space-y-6">
        <button onClick={() => setStep(4)} className="text-green-600 hover:text-green-800 flex items-center gap-1">
          ← Back to Garden Plan
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-green-800">Your Planting Itinerary</h2>
            <p className="text-gray-600 mt-1">
              {itinerary.length} tasks for {totalPlaced} plants ({Object.keys(placedCounts).length} varieties)
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            🖨️ Print
          </button>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg flex items-center gap-3">
          <span className="text-2xl">❄️</span>
          <div>
            <div className="font-bold text-cyan-800">Last Frost Date</div>
            <div className="text-cyan-700">
              {new Date(formData.lastFrostDate || recommendations.frostDates.defaultDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap text-xs">
          <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">🏠 Start indoors</span>
          <span className="px-2 py-1 rounded bg-green-100 text-green-800">🌱 Direct sow</span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">🪴 Transplant</span>
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-800">🥬 Harvest</span>
        </div>

        <div className="space-y-8">
          {months.map(month => {
            const monthlyCareTasks = getMonthlyCareTasks(month, groupedTasks[month]);
            
            return (
              <div key={month}>
                <h3 className="text-lg font-bold text-gray-700 mb-3 sticky top-0 bg-gradient-to-b from-green-50 to-transparent py-2 z-10">
                  📅 {month}
                </h3>
                
                {/* Monthly recurring care tasks */}
                {monthlyCareTasks.length > 0 && (
                  <div className="mb-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
                    <h4 className="font-bold text-teal-800 mb-3 flex items-center gap-2">
                      🔄 Recurring Tasks for {month.split(' ')[0]}
                    </h4>
                    <div className="space-y-3">
                      {monthlyCareTasks.map((care, idx) => (
                        <div key={idx} className="bg-white/70 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{care.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-teal-900">{care.title}</div>
                              <div className="text-sm text-teal-700 font-medium">{care.frequency}</div>
                              <div className="text-sm text-gray-600 mt-1">{care.details}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Individual tasks for this month */}
                <div className="space-y-3">
                  {groupedTasks[month].map((task, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        task.isMilestone 
                          ? 'bg-cyan-50 border-cyan-400' 
                          : getCategoryColor(task.category)
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{task.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                {task.plant}
                                {task.quantity > 1 && (
                                  <span className="text-sm font-normal bg-white/50 px-2 py-0.5 rounded">
                                    ×{task.quantity}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-medium">{task.task}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatDate(task.date)}</div>
                            </div>
                          </div>
                          {task.details && (
                            <div className="text-sm opacity-75 mt-1">{task.details}</div>
                          )}
                          
                          {/* Detailed instructions */}
                          {task.instructions && (
                            <div className="mt-3 bg-white/50 rounded-lg p-3 text-sm space-y-2">
                              <div className="font-medium text-gray-700 border-b pb-1">📋 How to do this:</div>
                              {task.instructions.depth && (
                                <div><span className="font-medium">📏 Planting depth:</span> {task.instructions.depth}</div>
                              )}
                              {task.instructions.spacing && (
                                <div><span className="font-medium">↔️ Spacing:</span> {task.instructions.spacing} apart</div>
                              )}
                              {task.instructions.germination && (
                                <div><span className="font-medium">🌱 Germination:</span> {task.instructions.germination} days</div>
                              )}
                              {task.instructions.watering && (
                                <div><span className="font-medium">💧 Watering:</span> {task.instructions.watering}</div>
                              )}
                              {task.instructions.tips && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <span className="font-medium">💡 Tips:</span> {task.instructions.tips}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg print:hidden">
          <h3 className="font-bold text-gray-800 mb-2">📊 Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total tasks: {itinerary.length}</div>
            <div>Plants: {totalPlaced}</div>
            <div>Varieties: {Object.keys(placedCounts).length}</div>
            <div>Space: {getTotalSpaceUsed()} sq ft</div>
            <div>First task: {formatDate(itinerary[0]?.date)}</div>
            <div>Last task: {formatDate(itinerary[itinerary.length - 1]?.date)}</div>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            onClick={generatePDF}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📄 Download PDF
          </button>
          <button
            onClick={launchDashboard}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            🏡 Launch My Garden →
          </button>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg print:hidden">
          <p className="text-sm text-amber-800">
            <strong>💡 Tip:</strong> Download your itinerary as a PDF to keep a printable copy. 
            The "My Garden" dashboard is a premium feature for tracking daily tasks and progress.
          </p>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const todaysTasks = getTodaysTasks();
    const wateringTasks = getWateringTasks();
    const overdueTasks = getOverdueTasks();
    const upcomingTasks = getUpcomingTasks(7);
    const completedTasks = getCompletedTasks();
    const placedCounts = getPlacedPlantCounts();

    // Combine today's scheduled tasks with watering
    const allTodaysTasks = [...todaysTasks, ...wateringTasks];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-green-800">🏡 My Garden</h2>
            <p className="text-gray-600">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={() => setViewMode('setup')}
            className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            ⚙️ Edit Garden
          </button>
        </div>

        {/* Date Navigator (for testing) */}
        <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(prev => {
              const d = new Date(prev);
              d.setDate(d.getDate() - 1);
              return d;
            })}
            className="px-3 py-1 bg-white rounded hover:bg-gray-50"
          >
            ← Previous Day
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(prev => {
              const d = new Date(prev);
              d.setDate(d.getDate() + 1);
              return d;
            })}
            className="px-3 py-1 bg-white rounded hover:bg-gray-50"
          >
            Next Day →
          </button>
        </div>

        {/* Garden Visualization */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="font-bold text-amber-800 mb-3">🗺️ Garden View</h3>
          <div className="space-y-4">
            {gardenBeds.map(bed => (
              <div key={bed.id} className="bg-white p-3 rounded-lg border">
                <div className="font-medium mb-2">{bed.name}</div>
                <div className="overflow-x-auto">
                  <div 
                    className="inline-grid gap-0.5 bg-amber-900 p-1 rounded"
                    style={{ 
                      gridTemplateColumns: `repeat(${bed.width}, 32px)`,
                      gridTemplateRows: `repeat(${bed.length}, 32px)`
                    }}
                  >
                    {Array.from({ length: bed.length }).map((_, row) =>
                      Array.from({ length: bed.width }).map((_, col) => {
                        const occupant = getCellOccupant(bed, row, col);
                        return (
                          <div
                            key={`${row}-${col}`}
                            className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm
                              ${occupant 
                                ? `${getPlantColor(occupant.name)} ${occupant.isOrigin ? '' : 'opacity-60'}`
                                : 'bg-amber-700'
                              }
                            `}
                            title={occupant?.name || 'Empty'}
                          >
                            {occupant?.isOrigin && (
                              <span className="drop-shadow-sm">{getPlantEmoji(occupant.name)}</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="font-bold text-red-800 mb-3">⚠️ Overdue Tasks ({overdueTasks.length})</h3>
            <div className="space-y-2">
              {overdueTasks.map((task, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                    isTaskComplete(task) 
                      ? 'bg-gray-100 border-gray-200 opacity-50' 
                      : 'bg-white border-red-200'
                  }`}
                >
                  <button
                    onClick={() => toggleTaskComplete(task)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isTaskComplete(task)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-red-300 hover:bg-red-50'
                    }`}
                  >
                    {isTaskComplete(task) && '✓'}
                  </button>
                  <div className="text-xl">{task.icon}</div>
                  <div className="flex-1">
                    <div className={`font-medium ${isTaskComplete(task) ? 'line-through' : ''}`}>
                      {task.plant} {task.quantity > 1 && `×${task.quantity}`}
                    </div>
                    <div className="text-sm text-gray-600">{task.task}</div>
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {formatDate(task.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-3">
            📋 Today's Tasks ({allTodaysTasks.length})
          </h3>
          {allTodaysTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks scheduled for today! 🎉</p>
          ) : (
            <div className="space-y-2">
              {allTodaysTasks.map((task, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                    isTaskComplete(task) 
                      ? 'bg-gray-100 border-gray-200' 
                      : `${getCategoryColor(task.category)}`
                  }`}
                >
                  <button
                    onClick={() => toggleTaskComplete(task)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isTaskComplete(task)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-400 hover:bg-white'
                    }`}
                  >
                    {isTaskComplete(task) && '✓'}
                  </button>
                  <div className="text-xl">{task.icon}</div>
                  <div className="flex-1">
                    <div className={`font-medium ${isTaskComplete(task) ? 'line-through text-gray-500' : ''}`}>
                      {task.plant} {task.quantity > 1 && `×${task.quantity}`}
                    </div>
                    <div className={`text-sm ${isTaskComplete(task) ? 'text-gray-400' : 'opacity-75'}`}>
                      {task.task}
                    </div>
                    {task.details && (
                      <div className={`text-xs mt-1 ${isTaskComplete(task) ? 'text-gray-400' : 'opacity-60'}`}>
                        {task.details}
                      </div>
                    )}
                  </div>
                  {task.isRecurring && (
                    <span className="text-xs bg-white/50 px-2 py-1 rounded">🔄 Daily</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-3">📅 Coming Up (Next 7 Days)</h3>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 5).map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-blue-100 flex items-center gap-3"
                >
                  <div className="text-xl">{task.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {task.plant} {task.quantity > 1 && `×${task.quantity}`}
                    </div>
                    <div className="text-sm text-gray-600">{task.task}</div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {formatDate(task.date)}
                  </div>
                </div>
              ))}
              {upcomingTasks.length > 5 && (
                <p className="text-sm text-blue-600 text-center">
                  +{upcomingTasks.length - 5} more tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {getCompletedTasks().length > 0 && (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-3">
              ✅ Completed Tasks ({getCompletedTasks().length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {getCompletedTasks()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white border border-gray-200 flex items-center gap-3"
                >
                  <button
                    onClick={() => toggleTaskComplete(task)}
                    className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-500 text-white flex items-center justify-center hover:bg-green-600"
                    title="Click to undo"
                  >
                    ✓
                  </button>
                  <div className="text-xl opacity-50">{task.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-500 line-through">
                      {task.plant} {task.quantity > 1 && `×${task.quantity}`}
                    </div>
                    <div className="text-sm text-gray-400">{task.task}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(task.date)}
                  </div>
                  <button
                    onClick={() => toggleTaskComplete(task)}
                    className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Undo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-3xl font-bold text-green-600">{getTotalPlantsPlaced()}</div>
            <div className="text-sm text-gray-600">Plants Growing</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{Object.keys(placedCounts).length}</div>
            <div className="text-sm text-gray-600">Varieties</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-600">Tasks Done</div>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{getTotalBedSpace()}</div>
            <div className="text-sm text-gray-600">Total Sq Ft</div>
          </div>
        </div>

        {/* Plant Legend */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-bold text-gray-800 mb-3">🌱 Your Plants</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(placedCounts).map(([name, qty]) => (
              <div key={name} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className={`w-6 h-6 rounded flex items-center justify-center text-sm ${getPlantColor(name)}`}>
                  {getPlantEmoji(name)}
                </span>
                <span className="text-sm font-medium">{name}</span>
                <span className="text-xs text-gray-500">×{qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Let's Plan Your Garden!</h2>
      <p className="text-gray-600">Tell us about what you'd like to grow.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What kind of garden?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'vegetable', label: '🥕 Vegetable', desc: 'Tomatoes, peppers, greens...' },
              { value: 'flower', label: '🌸 Flower', desc: 'Cut flowers & ornamentals' },
              { value: 'herb', label: '🌿 Herb', desc: 'Culinary & medicinal herbs' },
              { value: 'mixed', label: '🌻 Mixed', desc: 'A little of everything' },
            ].map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('gardenType', type.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.gardenType === type.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-gray-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            maxLength={5}
            placeholder="Enter your ZIP code"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value.replace(/\D/g, ''))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">Used to estimate frost dates and growing zone</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sun Exposure</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'full', label: '☀️ Full Sun', desc: '6+ hours direct sun' },
              { value: 'partial', label: '⛅ Partial Sun', desc: '3-6 hours sun' },
              { value: 'shade', label: '🌥️ Shade', desc: 'Less than 3 hours' },
            ].map(sun => (
              <button
                key={sun.value}
                type="button"
                onClick={() => handleInputChange('sunExposure', sun.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.sunExposure === sun.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-medium text-sm">{sun.label}</div>
                <div className="text-xs text-gray-500">{sun.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'beginner', label: '🌱 Beginner', desc: 'First garden or two' },
              { value: 'intermediate', label: '🪴 Intermediate', desc: 'A few seasons' },
              { value: 'expert', label: '🌳 Expert', desc: 'Ready for a challenge' },
            ].map(exp => (
              <button
                key={exp.value}
                type="button"
                onClick={() => handleInputChange('experience', exp.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.experience === exp.value 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-medium text-sm">{exp.label}</div>
                <div className="text-xs text-gray-500">{exp.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Will kids be involved?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('kidFriendly', true)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.kidFriendly === true 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              👦 Yes, kid-friendly plants only
            </button>
            <button
              onClick={() => handleInputChange('kidFriendly', false)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.kidFriendly === false 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              🧑 No, all plants okay
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          generateRecommendations();
          setStep(2);
        }}
        disabled={!formData.gardenType || !formData.zipCode || !formData.sunExposure || !formData.experience || formData.kidFriendly === null}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        See Plant Recommendations →
      </button>
    </div>
  );

  const renderStep2 = () => {
    if (!recommendations) return null;

    const allSelected = selectedPlants.size === recommendations.plants.length;

    return (
      <div className="space-y-6">
        <button onClick={() => setStep(1)} className="text-green-600 hover:text-green-800 flex items-center gap-1">
          ← Back
        </button>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">Your Growing Zone Info</h3>
          <p className="text-sm text-gray-600 mt-1">Based on ZIP code {recommendations.zipCode}</p>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-xs text-gray-500">Last Frost</div>
              <div className="font-medium text-sm">{recommendations.frostDates.lastFrost}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">First Frost</div>
              <div className="font-medium text-sm">{recommendations.frostDates.firstFrost}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Zone</div>
              <div className="font-medium text-sm">{recommendations.frostDates.zone}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Choose Your Plants</h2>
          <p className="text-gray-600 mb-4">
            Select the plants you'd like to grow. You'll decide quantities when you design your garden layout.
          </p>
          
          <div className="mb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={allSelected ? deselectAllPlants : selectAllPlants}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
              {selectedPlants.size > 0 && !allSelected && (
                <button
                  onClick={deselectAllPlants}
                  className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <span className="font-medium text-green-700">{selectedPlants.size} / {recommendations.plants.length} selected</span>
          </div>
          
          <div className="space-y-2">
            {recommendations.plants.map((plant, idx) => {
              const isSelected = selectedPlants.has(plant.name);
              const size = Math.ceil(Math.sqrt(plant.spaceSqFt));
              
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div 
                      className="flex items-start gap-3 flex-1 cursor-pointer"
                      onClick={() => togglePlantSelection(plant.name)}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${isSelected ? getPlantColor(plant.name) : 'bg-gray-100'}`}>
                        {isSelected ? '✓' : getPlantEmoji(plant.name)}
                      </div>
                      <div>
                        <div className="font-medium text-lg">{plant.name}</div>
                        <div className="text-sm text-gray-600">{plant.notes}</div>
                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
                          <span>📐 {size}×{size} ft</span>
                          <span>☀️ {plant.sunNeeds}</span>
                          <span>💧 {plant.water}</span>
                          <span>⏱️ {plant.daysToHarvest || plant.daysToBloom} days</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlantInfoModal(plant.name);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="More info"
                    >
                      ℹ️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t">
          <button
            onClick={() => setStep(3)}
            disabled={selectedPlants.size === 0}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {selectedPlants.size === 0 
              ? 'Select at least one plant' 
              : `Design Garden Layout with ${selectedPlants.size} plants →`}
          </button>
        </div>

        {/* Plant Info Modal */}
        {plantInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              {(() => {
                const info = getPlantInfo(plantInfoModal);
                if (!info) return null;
                
                return (
                  <>
                    <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${getPlantColor(info.name)}`}>
                          {getPlantEmoji(info.name)}
                        </span>
                        <div>
                          <h3 className="font-bold text-xl">{info.name}</h3>
                          <p className="text-sm text-gray-500">{info.daysToHarvest ? 'Vegetable/Herb' : 'Flower'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPlantInfoModal(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">📝 About</h4>
                        <p className="text-gray-600">{info.notes}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Space Needed</div>
                          <div className="font-bold">{info.spaceSqFt} sq ft ({info.size}×{info.size})</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Days to {info.daysToHarvest ? 'Harvest' : 'Bloom'}</div>
                          <div className="font-bold">{info.daysToHarvest || info.daysToBloom} days</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Sun Needs</div>
                          <div className="font-bold capitalize">{info.sunNeeds} sun</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-500">Water Needs</div>
                          <div className="font-bold capitalize">{info.water}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">💡 Growing Tips</h4>
                        <ul className="space-y-2">
                          {info.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {(info.companions.good.length > 0 || info.companions.bad.length > 0) && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">🤝 Companion Planting</h4>
                          {info.companions.good.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm text-green-700 font-medium">Good neighbors: </span>
                              <span className="text-sm text-gray-600">{info.companions.good.join(', ')}</span>
                            </div>
                          )}
                          {info.companions.bad.length > 0 && (
                            <div>
                              <span className="text-sm text-red-700 font-medium">Keep apart from: </span>
                              <span className="text-sm text-gray-600">{info.companions.bad.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (!selectedPlants.has(info.name)) {
                              togglePlantSelection(info.name);
                            }
                            setPlantInfoModal(null);
                          }}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            selectedPlants.has(info.name)
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {selectedPlants.has(info.name) ? '✓ Already Selected' : '+ Add to Garden'}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => {
    if (!recommendations) return null;
    
    const placedCounts = getPlacedPlantCounts();
    const currentBed = gardenBeds.find(b => b.id === currentBedId);
    const totalPlaced = getTotalPlantsPlaced();
    const totalSpaceUsed = getTotalSpaceUsed();
    const totalBedSpace = getTotalBedSpace();

    return (
      <div className="space-y-6">
        <button onClick={() => setStep(2)} className="text-green-600 hover:text-green-800 flex items-center gap-1">
          ← Back to Plant Selection
        </button>

        <h2 className="text-2xl font-bold text-green-800">Design Your Garden Layout</h2>
        <p className="text-gray-600">Define your garden beds and place plants on the grid. Each square = 1 sq ft.</p>

        {/* Stats Bar */}
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span><strong>{totalPlaced}</strong> plants placed</span>
            <span><strong>{totalSpaceUsed}</strong> / {totalBedSpace} sq ft used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="h-2 rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.min(100, (totalSpaceUsed / totalBedSpace) * 100)}%` }}
            />
          </div>
        </div>

        {/* Bed Management */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">Garden Beds</h3>
            <button
              onClick={addGardenBed}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              + Add Bed
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {gardenBeds.map(bed => (
              <button
                key={bed.id}
                onClick={() => setCurrentBedId(bed.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  currentBedId === bed.id
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <div className="font-medium">{bed.name}</div>
                <div className="text-xs text-gray-500">{bed.width}×{bed.length} ft • {bed.plants.length} plants</div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Bed Editor */}
        {currentBed && (
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={currentBed.name}
                  onChange={(e) => updateBed(currentBed.id, { name: e.target.value })}
                  className="text-lg font-bold border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none"
                />
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Width:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={currentBed.width}
                      onChange={(e) => updateBed(currentBed.id, { width: parseInt(e.target.value) || 1 })}
                      className="w-16 p-1 border rounded text-center"
                    />
                    <span className="text-sm text-gray-500">ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Length:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={currentBed.length}
                      onChange={(e) => updateBed(currentBed.id, { length: parseInt(e.target.value) || 1 })}
                      className="w-16 p-1 border rounded text-center"
                    />
                    <span className="text-sm text-gray-500">ft</span>
                  </div>
                </div>
              </div>
              {gardenBeds.length > 1 && (
                <button
                  onClick={() => removeBed(currentBed.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove bed"
                >
                  🗑️
                </button>
              )}
            </div>

            {/* Grid */}
            <div 
              className="overflow-x-auto"
              onMouseLeave={() => setHoveredCell(null)}
            >
              {(() => {
                // Calculate preview cells based on hovered position
                const preview = hoveredCell && draggedPlant
                  ? getPreviewCells(currentBed, hoveredCell.row, hoveredCell.col, draggedPlant)
                  : { cells: [], canPlace: false };
                const previewSet = new Set(preview.cells.map(c => `${c.row}-${c.col}`));

                return (
                  <div 
                    className="inline-grid gap-0.5 bg-amber-900 p-2 rounded-lg"
                    style={{ 
                      gridTemplateColumns: `repeat(${currentBed.width}, 48px)`,
                      gridTemplateRows: `repeat(${currentBed.length}, 48px)`
                    }}
                  >
                    {Array.from({ length: currentBed.length }).map((_, row) =>
                      Array.from({ length: currentBed.width }).map((_, col) => {
                        const occupant = getCellOccupant(currentBed, row, col);
                        const isInPreview = previewSet.has(`${row}-${col}`);
                        const isPreviewOrigin = hoveredCell?.row === row && hoveredCell?.col === col;
                        
                        // Determine cell styling
                        let cellClass = '';
                        if (occupant) {
                          cellClass = `${getPlantColor(occupant.name)} ${occupant.isOrigin ? 'ring-2 ring-white' : 'opacity-75'}`;
                        } else if (isInPreview) {
                          cellClass = preview.canPlace 
                            ? 'bg-green-400 opacity-70' 
                            : 'bg-red-400 opacity-70';
                        } else {
                          cellClass = 'bg-amber-700 hover:bg-amber-600';
                        }
                        
                        return (
                          <div
                            key={`${row}-${col}`}
                            className={`
                              w-12 h-12 rounded flex items-center justify-center text-lg
                              transition-all cursor-pointer
                              ${cellClass}
                            `}
                            onMouseEnter={() => {
                              if (draggedPlant && !occupant) {
                                setHoveredCell({ row, col });
                              }
                            }}
                            onTouchStart={() => {
                              // Set hovered cell on touch for mobile preview
                              if (draggedPlant && !occupant) {
                                setHoveredCell({ row, col });
                              }
                            }}
                            onClick={() => {
                              if (occupant && occupant.isOrigin) {
                                removePlantFromBed(currentBed.id, occupant.id);
                              } else if (!occupant && draggedPlant) {
                                // Calculate canPlace directly for touch/click (don't rely on hover preview)
                                const clickPreview = getPreviewCells(currentBed, row, col, draggedPlant);
                                if (clickPreview.canPlace) {
                                  placePlant(currentBed.id, row, col, draggedPlant);
                                  setHoveredCell(null);
                                }
                              }
                            }}
                            title={
                              occupant 
                                ? `${occupant.name} - Click to remove` 
                                : draggedPlant 
                                  ? (preview.canPlace ? `Click to place ${draggedPlant}` : `Not enough space for ${draggedPlant}`)
                                  : 'Select a plant to place'
                            }
                          >
                            {occupant?.isOrigin && (
                              <span className="drop-shadow-md">{getPlantEmoji(occupant.name)}</span>
                            )}
                            {isPreviewOrigin && !occupant && draggedPlant && (
                              <span className={`drop-shadow-md ${preview.canPlace ? '' : 'opacity-50'}`}>
                                {getPlantEmoji(draggedPlant)}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })()}
            </div>
            
            <div className="mt-2 text-sm text-gray-500 text-center">
              {currentBed.width * currentBed.length} sq ft • {currentBed.plants.length} plants
            </div>
          </div>
        )}

        {/* Plants Palette */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-3">Your Plants</h3>
          
          <p className="text-sm text-gray-600 mb-3">
            Click a plant to select it, then click on the grid to place it. Place as many as you need!
          </p>

          <div className="flex flex-wrap gap-2">
            {Array.from(selectedPlants).map(name => {
              const placed = placedCounts[name] || 0;
              const plant = recommendations?.plants.find(p => p.name === name);
              const size = Math.ceil(Math.sqrt(plant?.spaceSqFt || 1));
              
              return (
                <button
                  key={name}
                  onClick={() => setDraggedPlant(draggedPlant === name ? null : name)}
                  className={`
                    p-3 rounded-lg border-2 text-left transition-all
                    ${draggedPlant === name 
                      ? 'border-green-500 bg-green-100 ring-2 ring-green-300' 
                      : 'border-gray-200 bg-white hover:border-green-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded flex items-center justify-center ${getPlantColor(name)}`}>
                      {getPlantEmoji(name)}
                    </span>
                    <div>
                      <div className="font-medium text-sm">{name}</div>
                      <div className="text-xs text-gray-500">
                        {size}×{size} ft • {placed} placed
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {draggedPlant && (
            <div className="mt-3 p-2 bg-green-200 rounded text-sm text-green-800">
              🌱 Placing: <strong>{draggedPlant}</strong> — Click on the grid to place
              <button 
                onClick={() => setDraggedPlant(null)}
                className="ml-2 underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="text-sm text-gray-500">
          <strong>Tips:</strong> Click a planted cell to remove it. Plants that need more space will occupy multiple squares.
        </div>

        <button
          onClick={() => setStep(4)}
          disabled={totalPlaced === 0}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            totalPlaced > 0 
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-600'
          }`}
        >
          {totalPlaced > 0 ? 'Continue to Garden Plan →' : 'Place at least one plant to continue'}
        </button>
      </div>
    );
  };

  const renderStep4 = () => {
    if (!recommendations) return null;
    
    // Get planted data from garden beds
    const placedCounts = getPlacedPlantCounts();
    const plantedData = Object.entries(placedCounts).map(([name, qty]) => ({
      ...recommendations.plants.find(p => p.name === name),
      quantity: qty
    })).filter(p => p.name);

    const regionKey = formData.zipCode ? formData.zipCode[0] : '5';
    const frostData = frostDatesByRegion[regionKey] || frostDatesByRegion['5'];
    const medianFrostDate = getMedianFrostDate(frostData.historicalDates);
    const totalSpaceUsed = getTotalSpaceUsed();
    const totalBedSpace = getTotalBedSpace();

    return (
      <div className="space-y-6">
        <button onClick={() => setStep(3)} className="text-green-600 hover:text-green-800 flex items-center gap-1">
          ← Back to Layout Builder
        </button>

        <h2 className="text-2xl font-bold text-green-800">Your Garden Plan</h2>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-3">📅 Set Your Last Frost Date</h3>
          <p className="text-sm text-blue-700 mb-3">
            Enter your last expected spring frost date to generate a personalized planting schedule.
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Frost Date</label>
              <input
                type="date"
                value={formData.lastFrostDate || medianFrostDate}
                onChange={(e) => handleInputChange('lastFrostDate', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Historical frost dates */}
          <div className="mt-3 p-3 bg-white rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-2">📊 Last 5 Years in Your Area:</div>
            <div className="flex flex-wrap gap-2">
              {frostData.historicalDates.map((date, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="font-medium text-blue-600">Median date: </span>
              {new Date(medianFrostDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              <span className="text-gray-400"> (used as default)</span>
            </div>
          </div>
        </div>

        <button
          onClick={generateItinerary}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          📋 Generate Planting Itinerary
        </button>

        <hr className="border-gray-200" />

        {/* Garden Layout Preview */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="font-bold text-amber-800 mb-3">🗺️ Your Garden Layout</h3>
          <div className="space-y-4">
            {gardenBeds.map(bed => (
              <div key={bed.id} className="bg-white p-3 rounded-lg border">
                <div className="font-medium mb-2">{bed.name} ({bed.width}×{bed.length} ft)</div>
                <div className="overflow-x-auto">
                  <div 
                    className="inline-grid gap-0.5 bg-amber-900 p-1 rounded"
                    style={{ 
                      gridTemplateColumns: `repeat(${bed.width}, 24px)`,
                      gridTemplateRows: `repeat(${bed.length}, 24px)`
                    }}
                  >
                    {Array.from({ length: bed.length }).map((_, row) =>
                      Array.from({ length: bed.width }).map((_, col) => {
                        const occupant = getCellOccupant(bed, row, col);
                        return (
                          <div
                            key={`${row}-${col}`}
                            className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs
                              ${occupant 
                                ? `${getPlantColor(occupant.name)} ${occupant.isOrigin ? '' : 'opacity-60'}`
                                : 'bg-amber-700'
                              }
                            `}
                          >
                            {occupant?.isOrigin && (
                              <span className="drop-shadow-sm">{getPlantEmoji(occupant.name)}</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800 mb-2">Your Frost Dates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Last Spring Frost</div>
              <div className="font-medium">{recommendations.frostDates.lastFrost}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">First Fall Frost</div>
              <div className="font-medium">{recommendations.frostDates.firstFrost}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-green-800 mb-3">
            Your Plants ({getTotalPlantsPlaced()} plants, {plantedData.length} varieties)
          </h3>
          <div className="space-y-4">
            {plantedData.map((plant, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded flex items-center justify-center ${getPlantColor(plant.name)}`}>
                      {getPlantEmoji(plant.name)}
                    </span>
                    <div className="font-bold text-lg text-green-800">{plant.name}</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    ×{plant.quantity}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{plant.notes}</div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Space Used</div>
                    <div className="font-medium">{plant.spaceSqFt * plant.quantity} sq ft</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-xs text-gray-500">Days to {plant.daysToHarvest ? 'Harvest' : 'Bloom'}</div>
                    <div className="font-medium">{plant.daysToHarvest || plant.daysToBloom}</div>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs font-medium text-blue-800 mb-2">⏰ TIMING</div>
                  {plant.directSow ? (
                    <div className="text-sm">
                      <span className="font-medium">Direct sow outdoors: </span>
                      {plant.sowBeforeFrost 
                        ? `${plant.sowBeforeFrost} weeks before last frost`
                        : `${plant.sowAfterFrost} weeks after last frost`}
                    </div>
                  ) : (
                    <div className="text-sm space-y-1">
                      {plant.startIndoors > 0 && (
                        <div>
                          <span className="font-medium">Start seeds indoors: </span>
                          {plant.startIndoors} weeks before transplant
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Transplant outdoors: </span>
                        {plant.transplantBeforeFrost 
                          ? `${plant.transplantBeforeFrost} weeks before last frost`
                          : `${plant.transplantAfterFrost} weeks after last frost`}
                      </div>
                    </div>
                  )}
                  <div className="text-sm mt-1">
                    <span className="font-medium">{plant.harvestWindow ? 'Harvest' : 'Bloom'} window: </span>
                    {plant.harvestWindow || plant.bloomWindow}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">📊 Garden Summary</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>Total Plants: {getTotalPlantsPlaced()}</div>
            <div>Varieties: {plantedData.length}</div>
            <div>Garden Beds: {gardenBeds.length}</div>
            <div>Total Bed Space: {totalBedSpace} sq ft</div>
          </div>
          <div className="mt-2 font-medium text-green-600">
            ✓ {totalBedSpace - totalSpaceUsed} sq ft remaining
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto p-6">
        {viewMode === 'setup' ? (
          <>
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-green-800">🌱 Garden Planner</h1>
              <p className="text-gray-600 mt-2">Plan your perfect garden in minutes</p>
              
              <div className="flex justify-center gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((s, i) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-full transition-all ${
                      step >= s ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    title={['Basics', 'Plants', 'Layout', 'Plan', 'Itinerary'][i]}
                  />
                ))}
              </div>
            </header>

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </>
        ) : (
          renderDashboard()
        )}
      </div>
    </div>
  );
};

export default GardenPlanner;
