import { Baby } from '../models/baby.js'

function todaysDate() {
  return new Date().toISOString().slice(0, 16)
}



function index(req, res) {
  Baby.find({})
  .then(babyList => {
    res.render('baby/index', {
      babyList,
      todaysDate: todaysDate(),
      title: "Baby List",
      user: req.user ? req.user : null
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/")
  })
}

function create(req, res) {
  req.body.caregiver = req.user.profile._id // Can change this to .push for multiple caregiver feature later
  Baby.create(req.body)
  .then(baby => {
    res.redirect('/baby')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/baby')
  })
}

function show(req, res) {
  Baby.findById(req.params.id)
  .populate('caregiver')
  .then(baby => {
    console.log(baby)
    res.render('baby/show',{
      baby,
      title: `${baby.name} Details`
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })
}

function edit(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    res.render('baby/edit', {
      baby: baby,
      title: `Update ${baby.name}`
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/baby')
  })
}

function update(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    if (baby.caregiver.equals(req.user.profile._id)) {
      baby.updateOne(req.body, {new: true})
      .then(updatedbaby => {
        res.redirect(`/baby/${baby._id}`)
      })
    } else {
      throw new Error ('NOT AUTHORIZED')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })
}

function removeBaby(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    if (baby.caregiver.equals(req.user.profile._id)) {
      baby.delete()
      .then(() => {
        res.redirect('/baby')
      })
    } else {
      throw new Error ('NOT AUTHORIZED')
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })
}

function showAddData(req, res) {
  Baby.findById(req.params.id)
  .populate('caregiver')
  .then(baby => {
    console.log(baby)
    res.render(`baby/addData`,{
      baby,
      title: `${baby.name}`,
      todaysDate: todaysDate()
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })
}


function createFeeding(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    // Take care of any information left out
    for (let key in req.body) {
      if (req.body[key] === '') delete req.body[key]
    }
    baby.feedings.push(req.body)
    baby.save()
    .then(() => {
      res.redirect(`/baby/${baby._id}`)
    })
    .catch(err => {
      console.log(err)
      res.redirect("/baby")
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })
}

export {
  index,
  show,
  edit,
  create,
  update,
  removeBaby as delete,
  showAddData,
  createFeeding
}