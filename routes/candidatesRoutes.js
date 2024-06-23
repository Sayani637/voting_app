const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Candidate = require('../models/candidate')
const { jwtAuthMiddleware, generateToken } = require('./../jwt')

const checkAdminRole = async userID => {
  try {
    const user = await User.findById(userID)
    if (user.role === 'admin') {
      return true
    }
  } catch (err) {
    return false
  }
}

// Post route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: 'user does not have admin role' })

    const data = req.body // Assuming the request body contains the candidate data

    const newCandidate = new Candidate(data)

    // Save the new user to the database
    const response = await newCandidate.save()
    console.log('data saved')
    res.status(200).json({ response: response })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// For Update
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: 'User does not have admin role' })

    const candidateID = req.params.candidateID
    const updatedCandidateData = req.body

    const response = await person.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true
      }
    )

    if (!response) {
      return res.status(404).json({ error: 'Candidate not found' })
    }
    console.log('Candidate Data Updated')
    res.status(200).json(response)
  } catch (error) {
    console.error('Error saving data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// For Delete
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: 'User does not have admin role' })
    const candidateID = req.params.candidateID

    const response = await person.findByIdAndDelete(candidateID)

    if (!response) {
      return res.status(404).json({ error: 'Candidate not found' })
    }
    console.log('Candidate Deleted')
    res.status(200).json(response)
  } catch (error) {
    console.error('Error saving data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Lets start vorting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
  candidateID = req.params.candidateID
  userId = req.user.id

  try {
    // Find the candidate document with the specified candidateID
    const candidate = await Candidate.findById(candidateID)
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }

    if (user.isVoted) {
      return res.status(400).json({ message: 'You have already Voted' })
    }

    if (user.role == 'admin') {
      return res.status(403).json({ message: 'Admin is not allowed' })
    }

    // Update the Candidate document to record the vote
    candidate.votes.push({ user: userId })
    candidate.voteCount++
    await candidate.save()

    // Update the user document
    user.isVoted = true
    await user.save()

    res.status(200).json({ message: 'Vote Recorded Successfully' })
  } catch (error) {
    console.error('Error saving data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Vote count
router.get('/vote/count', async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: 'desc' })

    // Map the candidate to only return their name and vote count
    const voteRecord = candidate.map(data => {
      return {
        party: data.party,
        count: data.voteCount
      }
    });
    return res.status(200).json(voteRecord);
  } catch (error) {
    console.error('Error saving data:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

// Get List of all candidates with only name and party fields
router.get('/candidate', async (req, res) => {
  try {
      // Find all candidates and select only the name and party fields, excluding _id
      const candidates = await Candidate.find({}, 'name party -_id');

      // Return the list of candidates
      res.status(200).json(candidates);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
