/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

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
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry
} from '@jsonforms/core';
import {
  materialAllOfControlTester,
  MaterialAllOfRenderer,
  materialAnyOfControlTester,
  MaterialAnyOfRenderer,
  MaterialArrayControlRenderer,
  materialArrayControlTester,
  materialObjectControlTester,
  MaterialObjectRenderer,
  materialOneOfControlTester,
  MaterialOneOfRenderer
} from './complex';
import {
  MaterialLabelRenderer,
  materialLabelRendererTester,
  MaterialListWithDetailRenderer,
  materialListWithDetailTester
} from './additional';
import {
  MaterialAnyOfStringOrEnumControl,
  materialAnyOfStringOrEnumControlTester,
  MaterialDateControl,
  materialDateControlTester,
  MaterialDateTimeControl,
  materialDateTimeControlTester,
  MaterialEnumControl,
  materialEnumControlTester,
  SpectrumIntegerControl,
  spectrumIntegerControlTester,
  MaterialNativeControl,
  materialNativeControlTester,
  MaterialOneOfEnumControl,
  materialOneOfEnumControlTester,
  MaterialRadioGroupControl,
  materialRadioGroupControlTester,
  MaterialSliderControl,
  materialSliderControlTester,
  SpectrumBooleanControl,
  spectrumBooleanControlTester,
  SpectrumNumberControl,
  spectrumNumberControlTester,
  SpectrumTextControl,
  spectrumTextControlTester
} from './controls';
import {
  MaterialArrayLayout,
  materialArrayLayoutTester,
  MaterialCategorizationLayout,
  materialCategorizationTester,
  MaterialGroupLayout,
  materialGroupTester,
  MaterialHorizontalLayout,
  materialHorizontalLayoutTester,
  MaterialVerticalLayout,
  materialVerticalLayoutTester
} from './layouts';
import {
  MaterialDateCell,
  materialDateCellTester,
  MaterialEnumCell,
  materialEnumCellTester,
  MaterialTextCell,
  materialTextCellTester,
  MaterialTimeCell,
  materialTimeCellTester,
  SpectrumBooleanCell,
  spectrumBooleanCellTester,
  SpectrumIntegerCell,
  spectrumIntegerCellTester,
  SpectrumNumberCell,
  spectrumNumberCellTester
} from './cells';
import MaterialCategorizationStepperLayout, {
  materialCategorizationStepperTester
} from './layouts/MaterialCategorizationStepperLayout';

export * from './complex';
export * from './controls';
export * from './layouts';
export * from './cells';
export * from './mui-controls';
export * from './util';

export const materialRenderers: JsonFormsRendererRegistryEntry[] = [
  // controls
  {
    tester: materialArrayControlTester,
    renderer: MaterialArrayControlRenderer
  },
  { tester: spectrumBooleanControlTester, renderer: SpectrumBooleanControl },
  { tester: materialNativeControlTester, renderer: MaterialNativeControl },
  { tester: materialEnumControlTester, renderer: MaterialEnumControl },
  { tester: spectrumIntegerControlTester, renderer: SpectrumIntegerControl },
  { tester: spectrumNumberControlTester, renderer: SpectrumNumberControl },
  { tester: spectrumTextControlTester, renderer: SpectrumTextControl },
  { tester: materialDateTimeControlTester, renderer: MaterialDateTimeControl },
  { tester: materialDateControlTester, renderer: MaterialDateControl },
  { tester: materialSliderControlTester, renderer: MaterialSliderControl },
  { tester: materialObjectControlTester, renderer: MaterialObjectRenderer },
  { tester: materialAllOfControlTester, renderer: MaterialAllOfRenderer },
  { tester: materialAnyOfControlTester, renderer: MaterialAnyOfRenderer },
  { tester: materialOneOfControlTester, renderer: MaterialOneOfRenderer },
  {
    tester: materialRadioGroupControlTester,
    renderer: MaterialRadioGroupControl
  },
  {
    tester: materialOneOfEnumControlTester,
    renderer: MaterialOneOfEnumControl
  },
  // layouts
  { tester: materialGroupTester, renderer: MaterialGroupLayout },
  {
    tester: materialHorizontalLayoutTester,
    renderer: MaterialHorizontalLayout
  },
  { tester: materialVerticalLayoutTester, renderer: MaterialVerticalLayout },
  {
    tester: materialCategorizationTester,
    renderer: MaterialCategorizationLayout
  },
  {
    tester: materialCategorizationStepperTester,
    renderer: MaterialCategorizationStepperLayout
  },
  { tester: materialArrayLayoutTester, renderer: MaterialArrayLayout },
  // additional
  { tester: materialLabelRendererTester, renderer: MaterialLabelRenderer },
  {
    tester: materialListWithDetailTester,
    renderer: MaterialListWithDetailRenderer
  },
  {
    tester: materialAnyOfStringOrEnumControlTester,
    renderer: MaterialAnyOfStringOrEnumControl
  }
];

export const materialCells: JsonFormsCellRendererRegistryEntry[] = [
  { tester: spectrumBooleanCellTester, cell: SpectrumBooleanCell },
  { tester: materialDateCellTester, cell: MaterialDateCell },
  { tester: materialEnumCellTester, cell: MaterialEnumCell },
  { tester: spectrumIntegerCellTester, cell: SpectrumIntegerCell },
  { tester: spectrumNumberCellTester, cell: SpectrumNumberCell },
  { tester: materialTextCellTester, cell: MaterialTextCell },
  { tester: materialTimeCellTester, cell: MaterialTimeCell }
];
