import "./style.scss"
import "mustache"
import '@alenaksu/json-viewer';
import EventBus from 'core/src/utils/EventBusClient'

const Client = new EventBus()

Client.on('response.JSON', (r) => {
  console.warn(r)
  document.getElementById('json').data = r;
})

window.Client = Client