import { useState } from 'react'

type Values = { [field: string]: any }
type ValuesSetter = React.Dispatch<React.SetStateAction<Values>>
type Fields = { [fieldName: string]: FormField }
type FieldSetter = (value: any) => void

export function useForm(initialValues: Values = {}): Form {
  const [fields, setFields] = useState<Values>(initialValues)
  return new Form(initialValues, fields, setFields)
}

export class Form {
  private _initialValues: Values
  private _values: Values
  private _setValues: ValuesSetter
  private _fields: Fields = {}
  private _pristine: boolean | undefined

  /**
   * Use `useForm` instead.
   */
  constructor(
    initialValues: Values, values: Values, valuesSetter: ValuesSetter,
  ) {
    this._initialValues = initialValues
    this._values = values
    this._setValues = valuesSetter
  }

  /**
   * Whether the form remains untouched by the user or not.
   */
  get pristine(): boolean {
    if (this._pristine !== undefined) return this._pristine
    return this._pristine = Object.keys(this._values).reduce((acc, fName) => (
      acc && this._values[fName] === this._initialValues[fName]
    ), true)
  }

  /**
   * Returns the form field handler for a particular field.
   */
  field(fieldName: string): FormField {
    const field = this._fields[fieldName]
    if (field !== undefined) return field
    const newField = new FormField(
      this._initialValues[fieldName],
      this.values[fieldName],
      v => this._setValues({
        ...this._values,
        [fieldName]: v,
      })
    )
    this._fields[fieldName] = newField
    return newField
  }

  /**
   * Returns the current value of all the form fields.
   */
  get values(): Values {
    return this._values
  }
}

export class FormField {
  private _initialValue: any
  private _value: any
  private _set: FieldSetter

  /**
   * Use `Form.formField(…)` instead.
   */
  constructor(initialValue: any, value: any, setter: FieldSetter) {
    this._initialValue = initialValue
    this._value = value
    this._set = setter
  }

  /**
   * Whether the field remains untouched by the user or not.
   */
  get pristine(): boolean {
    return this._value === this._initialValue
  }

  /**
   * 
   * ### GETTER 
   * 
   * Returns the value of the field.
   */
  get value() {
    return this._value
  }

  /**
   * 
   * ----
   * ### SETTER
   * 
   * Sets the form field value by dispatching a React state update.
   * 
   * This will cause the component using the form (`useForm`) to re-render.
   * 
   * Note that the new value will only be available while getting
   * `formField.value` on the next render.
   */
  set value(value: any) {
    this._set(value)
  }
}
