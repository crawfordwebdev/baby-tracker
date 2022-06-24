import { Router } from 'express'
import * as babyCtrl from '../controllers/baby.js'
import { isLoggedIn } from '../middleware/middleware.js'
import { isCareGiver } from '../middleware/middleware.js'


const router = Router()

// GET localhost:3000/baby
router.get('/', isLoggedIn, babyCtrl.index)

// GET localhost:3000/baby/:id
router.get('/:id', isLoggedIn, isCareGiver, babyCtrl.show)

// GET localhost:3000/baby/:id/edit
router.get('/:id/edit', isLoggedIn, isCareGiver, babyCtrl.edit)

// POST localhost:3000/baby
router.post('/', isLoggedIn, babyCtrl.create)

// PUT localhost:3000/baby/:id
router.put('/:id', isLoggedIn, isCareGiver, babyCtrl.update)

// DELETE localhost:3000/baby/:id
router.delete('/:id', isLoggedIn, isCareGiver, babyCtrl.delete)

export {
  router
}