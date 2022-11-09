/*
  The MIT License

  Copyright (c) 2020 headwire.com, Inc
  https://github.com/headwirecom/jsonforms-react-spectrum-renderers

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
export * from './InputBooleanButton';
export * from './InputCheckbox';
export * from './InputDate';
export * from './InputDateTime';
export * from './InputEnum';
export * from './InputEnumAutocomplete';
export * from './InputEnumAutocompleteWithBadge';
export * from './InputInteger';
export * from './InputNumber';
export * from './InputRating';
export * from './InputSlider';
export * from './InputSwitch';
export * from './InputText';
export * from './InputTextAndButton';
export * from './InputTextArea';
export * from './InputTime';
export * from './Label';
export * from './MediaPreview';

/**
 * Additional props for Spectrum input controls
 */
export interface SpectrumInputProps {
  required?: boolean;
  label?: string;
  schema?: {
    [key: string]: any;
    readOnly?: boolean;
  };
}
