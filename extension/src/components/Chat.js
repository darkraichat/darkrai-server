import React from 'react'
import { Formik } from 'formik'
import { FormInput, Form, Button } from 'shards-react'
import Bubble from './Bubble'
import './Chat.css'

export default () => {
  const height = window.innerHeight - 200

  const messages = [{ by: 'fire', content: 'lorem ipsum' }]
  return (
    <div className="Chat-wrapper">
      <div>
        <h1 style={{ color: 'white', margin: 10 }}>Darkrai</h1>
      </div>
      <div style={{ height }}>
        {messages.map(message => {
          return <Bubble by={message.by} content={message.content} />
        })}
      </div>
      <div style={{ padding: 30 }}>
        <Formik
          initialValues={{
            message: '',
          }}
          onSubmit={values => {
            console.log(values.message)
          }}
          render={({ handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormInput
                type="text"
                name="message"
                onChange={handleChange}
                style={{ marginRight: 10 }}
              />
              <Button theme="light" type="submit">
                Send
              </Button>
            </Form>
          )}
        />
      </div>
    </div>
  )
}
