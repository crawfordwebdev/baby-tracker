import mongoose from 'mongoose'

const Schema = mongoose.Schema

const babySchema = new mongoose.Schema({
  caregiver: {type: Schema.Types.ObjectId, ref: "Profile"},
  name: String,
  birthday: Date,
  sex: String
}, {
  timestamps: true
})

const Baby = mongoose.model('Baby', babySchema)

export {
  Baby
}
