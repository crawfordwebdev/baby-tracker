import { Router } from 'express'

const router = Router()

router.get('/', function (req, res) {
  res.render('index', { title: 'Dookie Data', user: req.user ? req.user : null })
})

export {
  router
}
