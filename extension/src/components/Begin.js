import React from 'react'
import { Container, Form, FormInput, Button } from 'shards-react'
import { Formik } from 'formik'
import './Begin.css'

const Begin = props => {
  return (
    <div className="Begin-wrapper">
      <Container>
        <h1 style={{ color: 'white' }}>Hey!</h1>
        <p>Start with what you want to be called</p>
        <Formik
          onSubmit={values => {
            console.log(values, props.url)
          }}
          initialValues={{ name: '' }}
          render={({ handleSubmit, handleChange, values }) => (
            <Form onSubmit={handleSubmit}>
              <FormInput
                name="name"
                type="text"
                value={values.name}
                placeholder="Enter here!"
                onChange={handleChange}
                required
              ></FormInput>
              <br />
              <br />
              <Button theme="light" type="submit">
                Start
              </Button>
            </Form>
          )}
        />
      </Container>
    </div>
  )
}

export default Begin
