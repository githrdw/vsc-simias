import "./style.scss"
import "mustache"
import EventBus from 'core/src/utils/EventBusClient'

const Client = new EventBus()

const actionREST = document.getElementById("action-rest")
const requestREST = async () => {
  const url = document.getElementById("url").value || 'https://jsonplaceholder.cypress.io/todos'
  const { response: { data } } = await Client.emit('simias.request.REST', {
    // url: 'http://slowwly.robertomurray.co.uk/delay/10000/url/https://jsonplaceholder.cypress.io/todos/1'
    // url: 'https://jsonplaceholder.cypress.io/todos',
    url,
    options: {
      method: 'GET',
      // body: {
      //   title: "est",
      //   completed: false
      // }
    }
  })
  const buffer = new Uint8Array([...data])
  const text = new TextDecoder().decode(buffer)
  const json = JSON.parse(text)
  console.warn({ data, text, json })

  Client.emit('simias.response.JSON', json)
}
actionREST.addEventListener('click', requestREST)

window.Client = Client