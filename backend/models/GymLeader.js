const mongoose = require('mongoose');

const REGIONS = ['Kanto','Johto','Hoenn'];
const TYPES = [
    'Normal',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Ice',
    'Rock',
    'Ground',
    'Steel',
    'Fairy',
    'Bug',
    'Flying',
    'Fighitng',
    'Ghost',
    'Psychic',
    'Poison',
    'Dragon'
]

const gymLeaderSchema =  new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minLength: [2, 'Name should be a minimum of 2 characters']
        },
        region: {
            type: String,
            required: [true, 'Region is required'],
            enum: {values: REGIONS, message: 'Must be regions Kanto, Johto, and Hoenn'}
        },
        town: {
            type: String,
            required: [true, 'Town is required'],
            trim: true
        },
        badge: {
            type: String,
            required: [true, 'Badge is required'], 
            trim: true
        },
        specialty: {
            type: String,
            required: [true, 'Specialty is required'],
            enum: {values: TYPES, message: 'Specialty must be a valid type of Pokemon'}
        },
        aceLevel: {
            type: Number,
            required: [true, 'Ace level is required'],
            min: [1, 'Ace Lvl must be from 1 - 100'],
            max: [100, 'Ace Lvl must be from 1 - 100'],
            validate: {validator: Number.isInteger, message: 'Ace Lvl must be a WHOLE NUMBER'}
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('GymLeader', gymLeaderSchema);