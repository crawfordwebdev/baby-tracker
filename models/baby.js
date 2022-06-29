import mongoose from 'mongoose'

const Schema = mongoose.Schema

const measurementSchema = new mongoose.Schema({
  date: Date,
  height: Number,
  weight: Number,
  headCircumference: Number
}, {
  timestamps: true
})

const miscSchema = new mongoose.Schema({
  date: Date,
  text: String,
  number: Number,
}, {
  timestamps: true 
})

const sleepSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  comments: String
}, {
  timestamps: true 
})

const feedingSchema = new mongoose.Schema({
  date: Date,
  feedType: String,
  amount: Number,
  startTime: Date,
  endTime: Date,
  hasEnded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
})

const poopSchema = new mongoose.Schema({
  color: String,
  consistency: String,
  ploppable: Boolean,
  comments: String
}, {
  timestamps: true 
})

const changingSchema = new mongoose.Schema({
  date: Date,
  diaperSize: Number,
  diaperType: {
    type: String,
    enum: ["cloth", "disposable"]
  },
  diaperWeight: Number,
  poop: [poopSchema], 
  dry: Boolean,
  wet: Boolean,
  soiled: Boolean,
}, {
  timestamps: true 
})

const babySchema = new mongoose.Schema({
  caregiver: {type: Schema.Types.ObjectId, ref: "Profile"},
  name: String,
  birthday: Date,
  sex: String,
  measurements: [measurementSchema],
  misc: [miscSchema],
  sleeps: [sleepSchema],
  feedings: [feedingSchema],
  changings: [changingSchema]
}, {
  timestamps: true
})


const Baby = mongoose.model('Baby', babySchema)

export {
  Baby
}
