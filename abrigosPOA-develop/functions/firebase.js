const admin = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()
const firestore = getFirestore()

module.exports = {
  firestore,
  admin,
}
