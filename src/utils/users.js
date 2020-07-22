const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
        error: 'Username and room are required!'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
      return {
          error: 'Username is in use.'
      }
  }

  // Store user
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  // if a match is not found, findIndex will return -1, otherwise it will return the index of the user
  if (index !== -1) {
    return users.splice(index, 1)[0]    
  }
}

const getUser = (id) => {
  return user = users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  return arrayOfUsers = users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
