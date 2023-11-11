import { useState } from 'react'

// TODO WIP Reduce types used.
type Values = { [field: string]: any }
type ValuesSetter = React.Dispatch<React.SetStateAction<Values>>
type ValueSetter = (value: any) => void
type Fields = { [fieldName: string]: FormField }
export type Rules = { [fieldName: string]: FieldRules }
type FieldRules = {
  required?: boolean,
}
type Touched = { [fieldName: string]: boolean }
type TouchedSetter = React.Dispatch<React.SetStateAction<Touched>>


export function useForm(
  fieldNames: string[], initialValues: Values = {}, rules: Rules,
): Form {
  // TODO WIP Wrap `[var, setVar]` into a better state accessor object.
  const [fields, setFields] = useState<Values>(initialValues)
  const [touched, setTouched] = useState<Touched>({})
  return new Form(
    fieldNames, initialValues, fields, setFields, rules, touched, setTouched,
  )
}

export class Form {
  private fieldNames: string[]
  private initialValues: Values
  private _values: Values
  private setValues: ValuesSetter
  private fields: Fields = {}
  private _pristine: boolean | undefined
  private rules: Rules
  private touched: Touched
  private setTouched: TouchedSetter

  /**
   * Use `useForm` instead.
   */
  constructor(
    fieldNames: string[],
    initialValues: Values, values: Values, valuesSetter: ValuesSetter,
    rules: Rules, touched: Touched, setTouched: TouchedSetter,
  ) {
    this.fieldNames = fieldNames
    this.initialValues = initialValues
    this._values = values
    this.setValues = valuesSetter
    this.rules = rules
    this.touched = touched
    this.setTouched = setTouched
  }

  /**
   * Whether the form remains untouched by the user or not.
   */
  get pristine(): boolean {
    if (this._pristine !== undefined) return this._pristine
    return this._pristine = Object.keys(this._values).reduce((acc, fName) => (
      acc && this._values[fName] === this.initialValues[fName]
    ), true)
  }

  /**
   * Returns the form field handler for a particular field.
   */
  field(fieldName: string): FormField {
    if (this.fields[fieldName] !== undefined) return this.fields[fieldName]
    const field = new FormField(
      this.initialValues[fieldName],
      this.values[fieldName],
      v => this.setValues(this._values = {
        ...this._values,
        [fieldName]: v,
      }),
      this.rules[fieldName],
      this.touched[fieldName],
      t => this.setTouched(this.touched = {
        ...this.touched,
        [fieldName]: t,
      }),
    )
    return this.fields[fieldName] = field
  }

  /**
   * Touches all fields in the form.
   * 
   * Check `FormField.touch(…)` for more information.
   */
  touch() {
    this.fieldNames.forEach(fN => this.field(fN).touch())
  }

  /**
   * Whether the value of all fields in the form have no errors.
   */
  get valuesOk() {
    return this.fieldNames
      .reduce((acc, fN) => (acc && this.field(fN).valueOk), true)
  }

  /**
   * Returns the current value of all the form fields.
   */
  get values(): Values {
    return this._values
  }
}

export class FormField {
  private initialValue: any
  private _value: any
  private setValue: ValueSetter
  private touched: boolean
  private setTouched: (touched: boolean) => void
  private rules: FieldRules
  private _errors?: ValidationError[]
  private _errorMessage?: string | null

  /**
   * Use `Form.formField(…)` instead.
   */
  constructor(
    initialValue: any,
    value: any, setter: ValueSetter,
    rules: FieldRules,
    touched: boolean, touchSetter: (touched: boolean) => void,
  ) {
    this.initialValue = initialValue
    this._value = value
    this.setValue = setter
    this.touched = touched
    this.setTouched = touchSetter
    this.rules = rules
  }

  /**
   * Whether the field remains untouched by the user or not.
   */
  get pristine(): boolean {
    return this._value === this.initialValue
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
   */
  set value(value: any) {
    if (typeof (value) === 'string' && value.trim() === '') value = undefined
    this.setValue(this._value = value)
  }

  /**
   * Signals that this form field had the user attention.
   * 
   * This will cause the component using the form (`useForm`) to re-render.
   */
  touch() {
    if (this.touched) return
    this.setTouched(this.touched = true)
  }

  /**
   * Whether the value has no errors or not.
   */
  get valueOk() {
    return !this.errors.length
  }

  /**
   * Returns all the errors on this field's value.
   */
  get errors() {
    if (this._errors !== undefined) return this._errors
    const errors = []
    if (this.rules?.required) {
      const v = this.value
      if (
        v === undefined ||
        v === null ||
        typeof (v) === 'string' && v.trim() === ''
      ) errors.push(ValidationError.Required)
    }

    return this._errors = errors
  }

  /**
   * An error message in case the field value does not conform to its rules.
   */
  get errorMessage(): string | null {
    if (this._errorMessage !== undefined) return this._errorMessage

    if (this.pristine && !this.touched) return this._errorMessage = null
    if (this.errors.length) {
      const message = validationErrorMessages.get(this.errors[0])
      if (!message) throw new Error(
        `No validation message defined for ${this.errors[0]}`
      )
      return this._errorMessage = message
    }
    return this._errorMessage = null
  }
}

enum ValidationError {
  Required = 'Required',
}

const validationErrorMessages = new Map<ValidationError, string>([
  [ValidationError.Required, 'Required'],
])
