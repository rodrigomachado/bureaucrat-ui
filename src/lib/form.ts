import { edit, useRib } from './rib'

type Values = { [field: string]: any }
type Fields = { [fieldName: string]: FormField }
export type Rules = { [fieldName: string]: FieldRules }
type FieldRules = {
  required?: boolean,
}
type Touched = { [fieldName: string]: boolean }


export function useForm(
  fieldNames: string[], initialValues: Values = {}, rules: Rules,
): Form {
  const fields = useRib<Values>(initialValues)
  const touched = useRib<Touched>({})
  return new Form(fieldNames, initialValues, fields, rules, touched)
}

export class Form {
  private fieldNames: string[]
  private initialValues: Values
  private _values: Values
  private fields: Fields = {}
  private _pristine: boolean | undefined
  private rules: Rules
  private touched: Touched

  /**
   * Use `useForm` instead.
   */
  constructor(
    fieldNames: string[],
    initialValues: Values, values: Values,
    rules: Rules, touched: Touched,
  ) {
    this.fieldNames = fieldNames
    this.initialValues = initialValues
    this._values = values
    this.rules = rules
    this.touched = touched
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
      fieldName,
      this.initialValues,
      this.values,
      this.rules,
      this.touched,
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
  private _field: string
  private _initialValues: Values
  private _values: Values
  private _touched: Touched
  private _rules: Rules
  private _errors?: ValidationError[]
  private _errorMessage?: string | null

  /**
   * Use `Form.formField(…)` instead.
   */
  constructor(
    field: string,
    initialValues: Values,
    values: Values,
    rules: Rules,
    touched: Touched,
  ) {
    this._field = field
    this._initialValues = initialValues
    this._values = values
    this._touched = touched
    this._rules = rules
  }

  /**
   * Whether the field remains untouched by the user or not.
   */
  get pristine(): boolean {
    return this._values[this._field] === this._initialValues[this._field]
  }

  /**
   * 
   * ### GETTER 
   * 
   * Returns the value of the field.
   */
  get value() {
    return this._values[this._field]
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
    if (typeof (value) === 'string' && value.trim() === '') value = null
    edit(this._values, vs => {
      vs[this._field] = value
    })
  }

  /**
   * Signals that this form field had the user attention.
   * 
   * This will cause the component using the form (`useForm`) to re-render.
   */
  touch() {
    if (this._touched[this._field]) return
    edit(this._touched, ts => {
      ts[this._field] = true
    })
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
    if (this._rules[this._field]?.required) {
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

    if (this.pristine && !this._touched[this._field])
      return this._errorMessage = null
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
