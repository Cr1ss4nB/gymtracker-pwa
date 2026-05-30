const express = require('express')
const router = express.Router()
const { getProfile, createOrUpdateProfile } = require('../controllers/profile.controller')
const { verifyToken } = require('../middleware/auth.middleware')

router.get('/', verifyToken, getProfile)
router.put('/', verifyToken, createOrUpdateProfile)

module.exports = router
