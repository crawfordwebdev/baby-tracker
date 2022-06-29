import { Baby } from '../models/baby.js'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(LocalizedFormat)
dayjs.extend(utc)

// Modified from: 
// https://www.techstack4u.com/javascript/convert-milliseconds-to-hours-min-sec-format-in-javascript/
function getHourFormatFromMilliSeconds(millisec) {
  let seconds = (millisec / 1000).toFixed(0)
  let minutes = Math.floor(Number(seconds) / 60).toString()
  let hours
  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60)
    hours = (hours >= 10) ? hours : "0" + hours
    minutes = (Number(minutes) - (hours * 60)).toString()
  }
  minutes = (Number(minutes) >= 10) ? minutes : "0" + minutes
  seconds = Math.floor(Number(seconds) % 60).toString()
  seconds = (Number(seconds) >= 10) ? seconds : "0" + seconds

  if (!hours) { hours = "00" }
  if (!minutes) { minutes = "00" }
  if (!seconds) { seconds = "00" }
  
  return hours + ":" + minutes + ":" + seconds
}

function index(req, res) {
  Baby.find({})
  .then(babyList => {
    res.render('baby/index', {
      babyList,
      todaysDate: dayjs().format('YYYY-MM-DD'),
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
  // Fixing JavaScripts off by one day issue
  const birthDate = new Date(req.body.birthday)
  req.body.birthday = birthDate.toUTCString()
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
    // const unFinishedFeedings = Baby.feedings.find({hasEnded : false})
    // console.log ("unfinished feedings: ", unFinishedFeedings)

    // // This works
    // baby.feedings.forEach(feed => {
    //   if (typeof feed.startTime != "undefined" && typeof feed.endTime != "undefined") {
    //     feed.hasEnded = true
    //   } else {
    //     feed.hasEnded = false
    //   }
    // });
    baby.feedings.forEach(feed => {
      if (feed.startTime && feed.endTime) {
        feed.hasEnded = true
      } else {
        feed.hasEnded = false
      }
    });
    baby.save()
    .then(baby => {
      const unfinishedFeedings = baby.feedings.filter(feeding => feeding.hasEnded === false)
      console.log("unfinishedFeedings: ", unfinishedFeedings)
      baby.unfinishedFeedings = unfinishedFeedings
  
      console.log( "baby.unfinishedFeedings: ", baby.unfinishedFeedings)
      res.render('baby/show',{
        baby,
        title: `${baby.name} Details`,
        dayjs: dayjs,
        todaysDateTimeLocal: dayjs().format('YYYY-MM-DD[T]HH[:]mm'),
        getHourFormatFromMilliSeconds,
      })
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

function edit(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    const birthday = dayjs(baby.birthday).format('YYYY-MM-DD')
    res.render('baby/edit', {
      baby: baby,
      birthday,
      title: `Update ${baby.name}`,
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
      todaysDate: dayjs().format('YYYY-MM-DD'),
      todaysDateTimeLocal: dayjs().format('YYYY-MM-DD[T]HH[:]mm'),
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })
}

function editFeeding(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    const feeding = baby.feedings.id(req.params.feedid)
    console.log()

    // if (feeding.date) {
    //   feeding.date = dayjs(feeding.date).format('YYYY-MM-DD')
    //   console.log("Triggered feeding.date")
    // }
    // if (feeding.startTime) {
    //   console.log("original feed startTime: ", feeding.startTime)
    //   let startTime = feeding.startTime.toISOString().slice(0,16)
    //   feeding.startTime = startTime
    //   console.log("Updated feed startTime: ", feeding.startTime.toISOString().slice(0,16))
    // }
    // if (feeding.endTime) {
    //   feeding.endTime = dayjs(feeding.endTime).format('YYYY-MM-DD[T]HH[:]MM')
    // }


    // const formattedDate = feeding.date ? feeding.date.toISOString().slice(0,10) : dayjs().format('YYYY-MM-DD')
    // const formattedStartTime = feeding.startTime.toISOString().slice(0,16)
    // const formattedEndtime = feeding.endtime ?  feeding.endTime.toISOString().slice(0,16) : dayjs().format('YYYY-MM-DD[T]HH[:]MM')



    // console.log("toISOString StartTime: ", feeding.startTime.toISOString().slice(0,16))
    // console.log("feeding.startTime dayjs: ", dayjs(feeding.startTime).format('YYYY-MM-DD[T]HH[:]MM'))


    console.log("feeding.startTime: ", feeding.startTime)

    const formattedDate = feeding.date ? dayjs(feeding.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
    const formattedStartTime = feeding.startTime ? dayjs(feeding.startTime).format('YYYY-MM-DD[T]HH[:]mm') : ''
    const formattedEndtime = feeding.endtime ? dayjs(feeding.endTime ).format('YYYY-MM-DD[T]HH[:]mm') : dayjs().format('YYYY-MM-DD[T]HH[:]mm')

    


    console.log("formattedStartTime ", formattedStartTime)
    console.log("formattedEndtime ", formattedEndtime)

    // console.log("Feeding: ", feeding)

    res.render(`baby/feeding/edit`,{
      baby,
      feed: feeding,
      formattedDate,
      formattedStartTime,
      formattedEndtime,
      title: `${baby.name} Update Feeding`,
      todaysDate: dayjs().format('YYYY-MM-DD'),
      todaysDateTimeLocal: dayjs().format('YYYY-MM-DD[T]HH[:]mm'),
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect("/baby")
  })

}


function createFeeding(req, res) {
  console.log("REQ BODY: ", req.body)
  console.log("dayjs UTC", dayjs(req.body.date).utc().format())
  Baby.findById(req.params.id)
  .then(baby => {
    // Take care of any information left out
    for (let key in req.body) {
      if (req.body[key] === '') delete req.body[key]
    }

    // Handling Javascript off by one day issues
    if (req.body.date) {
      req.body.date = dayjs(req.body.date).utc().format()
    }
    if (req.body.startTime) {
      req.body.startTime = dayjs(req.body.startTime).utc().format()
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

function updateFeeding(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {

    for (let key in req.body) {
      if (req.body[key] === '') delete req.body[key]
    }

    if (req.body.date) {
      req.body.date = dayjs(req.body.date).utc().format()
    }
    if (req.body.startTime) {
      req.body.startTime = dayjs(req.body.startTime).utc().format()
    }
    if (req.body.endTime) {
      req.body.endTime = dayjs(req.body.endTime).utc().format()
    }

    const feeding = baby.feedings.id(req.params.feedid)
    feeding.set(req.body)
    if (req.body.startTime && req.body.endTime) {
      feeding.hasEnded = true
      console.log("has it ended: ", feeding.hasEnded)
    }
    console.log("Full baby: ", JSON.stringify(baby))
    
    baby.save()
    .then(feeding=> {
      console.log("Feeding Saved: ", feeding)
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



function deleteFeeding(req, res) {
  Baby.findById(req.params.id)
  .then(baby => {
    console.log("req.params.feedid: ", req.params.feedid)
    baby.feedings.remove({_id: req.params.feedid})
    baby.save()
    .then(feeding => {
      console.log("Feeding: ", feeding)
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
  createFeeding,
  editFeeding,
  updateFeeding,
  deleteFeeding,
}