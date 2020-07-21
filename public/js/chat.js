const socket = io()

const messageForm = document.querySelector('#message-form')
const formInput = messageForm.querySelector('input')
const formButton = messageForm.querySelector('button')
const messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

const locationButton = document.querySelector('#send-location')

//socket.on receives messages from the server
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
      message: message.text,
      createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationMessage) => { 
  console.log(locationMessage)
  const html = Mustache.render(locationTemplate, {
    url: locationMessage.url,
    createdAt: moment(locationMessage.createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    formButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
      formButton.removeAttribute('disabled')
      formInput.value = ''
      formInput.focus()

      if (error) {
        return console.log(error)
      }

      console.log('Message delivered.')
    })
})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude 
      }, () => {
        locationButton.removeAttribute('disabled')
        console.log('Location shared')
      })
    })
})