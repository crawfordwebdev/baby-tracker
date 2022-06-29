import { Router } from 'express'
import * as babyCtrl from '../controllers/baby.js'
import { isLoggedIn } from '../middleware/middleware.js'
import { isCareGiver } from '../middleware/middleware.js'


const router = Router()

// GET localhost:3000/baby
router.get('/', isLoggedIn, babyCtrl.index)

// POST localhost:3000/baby
router.post('/', isLoggedIn, babyCtrl.create)

// GET localhost:3000/baby/:id
router.get('/:id', isLoggedIn, babyCtrl.show)

// GET localhost:3000/baby/:id/edit
router.get('/:id/edit', isLoggedIn, babyCtrl.edit)

// PUT localhost:3000/baby/:id
router.put('/:id', isLoggedIn, babyCtrl.update)

// DELETE localhost:3000/baby/:id
router.delete('/:id', isLoggedIn, babyCtrl.delete)

// GET localhost:3000/baby/:id/addData
router.get('/:id/addData', isLoggedIn, babyCtrl.showAddData)

// POST localhost:3000/baby/:id/feeding
router.post('/:id/feeding', isLoggedIn, babyCtrl.createFeeding)

// DELETE localhost:3000/baby/:id/feeding/:feedid
router.delete('/:id/feeding/:feedid', isLoggedIn, babyCtrl.deleteFeeding)

// PUT localhost:3000/baby/:id
router.put('/:id', isLoggedIn, babyCtrl.update)

// PUT localhost:3000/baby/:id/feeding/:feedid
router.put('/:id/feeding/:feedid', isLoggedIn, babyCtrl.updateFeeding)

// GET localhost:3000/baby/:id/feeding/:feedid/edit
router.get('/:id/feeding/:feedid/edit', isLoggedIn, babyCtrl.editFeeding)


export {
  router
}