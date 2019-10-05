/*global chrome*/
import React from 'react'
import ReactDOM from 'react-dom'
import Frame, { FrameContextConsumer } from 'react-frame-component'
import Begin from './components/Begin'
import Chat from './components/Chat'
import './content.css'
import 'shards-ui/dist/css/shards.min.css'

const cssUrl =
  process.env.NODE_ENV === 'development'
    ? ''
    : chrome.runtime.getURL('/static/css/content.css')

let url
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    toggle()
    url = request.url
    console.log(url)
  }
})

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chat: false,
    }
  }

  render() {
    return (
      <Frame
        head={[<link type="text/css" rel="stylesheet" href={cssUrl}></link>]}
      >
        <FrameContextConsumer>
          {// Callback is invoked with iframe's window and document instances
          ({ document, window }) => {
            // Render Children
            document.body.style = 'background-color: #282c34;'
            return (
              <div>
                <Begin url={url} />
                {/* <Chat></Chat> */}
              </div>
            )
          }}
        </FrameContextConsumer>
      </Frame>
    )
  }
}

const app = document.createElement('div')
app.id = 'my-extension-root'

document.body.appendChild(app)
ReactDOM.render(<Main />, app)

app.style.display = 'none'

function toggle() {
  if (app.style.display === 'none') {
    app.style.display = 'block'
  } else {
    app.style.display = 'none'
  }
}
