const express = require('express')
const { create_aircraft, get_all_aircraft, get_single_aircraft, get_create_aircraft } = require('../controller/aircraft')
const router = express.Router()
const authUser = require('../middleware/authmiddel')

router.get('/', authUser, get_create_aircraft)
router.post('/', authUser, create_aircraft)
router.get('/manage-aircraft', authUser, get_all_aircraft)
router.get('/:id', authUser, get_single_aircraft)

module.exports = router