let functions = require('firebase-functions')
functions = functions.region('southamerica-east1')

const { firestore, admin } = require('./firebase')

exports.newUser = functions.firestore.document('/users/{docID}').onCreate(async (snap, context) => {
  const document = snap.data()

  try {
    if (document.userId) {
      await createUser(document.name, document.email, document.userId)
    }
  } catch (err) {
    firestore
      .collection('users')
      .doc(document.id)
      .set({ error: JSON.stringify(err) }, { merge: true })
  }

  return null
})

function createUser(displayName, email, uid = null) {
  const newUser = {
    displayName,
    email,
  }

  if (uid) {
    newUser.uid = uid
  }

  return admin.auth().createUser(newUser)
}
