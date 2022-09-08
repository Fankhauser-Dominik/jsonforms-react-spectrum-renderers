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
  Categorization,
  Category,
  JsonSchema,
  Layout,
  RuleEffect,
  SchemaBasedCondition,
} from '@jsonforms/core';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderForm } from '../util';
import { SpectrumCategorizationRendererTester } from '../../src/complex/SpectrumCategorizationRenderer';

const category: Category = {
  type: 'Category',
  label: 'B',
  elements: [],
};

const fixture = {
  data: {},
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  },
  uischema: {
    type: 'Categorization',
    label: 'A',
    elements: [category],
  },
};

describe('Spectrum Categorization tester', () => {
  test('tester', () => {
    expect(SpectrumCategorizationRendererTester(undefined, undefined)).toBe(-1);
    expect(SpectrumCategorizationRendererTester(null, undefined)).toBe(-1);
    expect(SpectrumCategorizationRendererTester({ type: 'Foo' }, undefined)).toBe(-1);
    expect(SpectrumCategorizationRendererTester({ type: 'Categorization' }, undefined)).toBe(-1);
  });

  test('tester with null elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: null,
    };
    expect(SpectrumCategorizationRendererTester(uischema, undefined)).toBe(-1);
  });

  test('tester with empty elements and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: [],
    };
    expect(SpectrumCategorizationRendererTester(uischema, undefined)).toBe(-1);
  });

  test('apply tester with single unknown element and no schema', () => {
    const uischema: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Foo',
        },
      ],
    };
    expect(SpectrumCategorizationRendererTester(uischema, undefined)).toBe(-1);
  });

  test('tester with single category and no schema', () => {
    const categorization = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
        },
      ],
    };
    expect(SpectrumCategorizationRendererTester(categorization, undefined)).toBe(1);
  });

  test('tester with nested categorization and single category and no schema', () => {
    const nestedCategorization: Layout = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
        },
      ],
    };
    const categorization: Layout = {
      type: 'Categorization',
      elements: [nestedCategorization],
    };
    expect(SpectrumCategorizationRendererTester(categorization, undefined)).toBe(-1);
  });

  test('tester with nested categorizations, but no category and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
        },
      ],
    };
    expect(SpectrumCategorizationRendererTester(categorization, undefined)).toBe(-1);
  });

  test('tester with nested categorizations, null elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          label: 'Test',
          elements: null,
        },
      ],
    };
    expect(SpectrumCategorizationRendererTester(categorization, undefined)).toBe(-1);
  });

  test('tester with nested categorizations, empty elements and no schema', () => {
    const categorization: any = {
      type: 'Categorization',
      elements: [
        {
          type: 'Categorization',
          elements: [],
        },
      ],
    };
    expect(SpectrumCategorizationRendererTester(categorization, undefined)).toBe(-1);
  });
});

describe('Spectrum Categorization renderer', () => {
  test('render', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstname: {
          type: 'string',
        },
        lastname: {
          type: 'string',
        },
        color: {
          type: 'string',
        },
      },
    };
    const firstnameControl = {
      type: 'Control',
      label: 'Firstname',
      scope: '#/properties/firstname',
    };
    const lastnameControl = {
      type: 'Control',
      label: 'Lastname',
      scope: '#/properties/lastname',
    };
    const colorControl = {
      type: 'Control',
      label: 'Color',
      scope: '#/properties/color',
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Blah',
      elements: [
        {
          type: 'Category',
          label: 'Foo',
          elements: [firstnameControl, lastnameControl],
        },
        {
          type: 'Category',
          label: 'Bar',
          elements: [colorControl],
        },
      ],
    };

    const { getByRole } = renderForm(uischema, schema, fixture.data);

    const tabList = getByRole('tablist');
    const tabs = tabList.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(2);

    const fooTab = tabs[0];
    const barTab = tabs[1];
    expect(fooTab).toHaveTextContent('Foo');
    expect(fooTab.className).toContain('is-selected');
    expect(barTab).toHaveTextContent('Bar');
    expect(barTab.className).not.toContain('is-selected');

    const panel = getByRole('tabpanel');
    expect(panel).toHaveTextContent('Firstname');
    expect(panel).toHaveTextContent('Lastname');
    expect(panel).not.toHaveTextContent('Color');
  });

  test('render on click', () => {
    const data = { name: 'John', color: 'Pink' };
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        color: {
          type: 'string',
        },
      },
    };
    const nameControl = {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name',
    };
    const colorControl = {
      type: 'Control',
      label: 'Color',
      scope: '#/properties/color',
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: 'Blah',
      elements: [
        {
          type: 'Category',
          label: 'Foo',
          elements: [nameControl],
        },
        {
          type: 'Category',
          label: 'Bar',
          elements: [colorControl],
        },
        {
          type: 'Category',
          label: 'Baz',
          elements: null,
        },
      ],
    };

    const { getByRole } = renderForm(uischema, schema, data);

    const tabList = getByRole('tablist');
    const tabs = tabList.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(3);

    const fooTab = tabs[0];
    const barTab = tabs[1];
    const bazTab = tabs[2];
    const panel = getByRole('tabpanel');

    expect(fooTab).toHaveTextContent('Foo');
    expect(barTab).toHaveTextContent('Bar');
    expect(bazTab).toHaveTextContent('Baz');

    expect(fooTab.className).toContain('is-selected');
    expect(barTab.className).not.toContain('is-selected');
    expect(bazTab.className).not.toContain('is-selected');
    expect(panel).toHaveTextContent('Name');
    expect(panel).not.toHaveTextContent('Color');

    userEvent.click(barTab);
    expect(fooTab.className).not.toContain('is-selected');
    expect(barTab.className).toContain('is-selected');
    expect(bazTab.className).not.toContain('is-selected');
    expect(panel).not.toHaveTextContent('Name');
    expect(panel).toHaveTextContent('Color');

    userEvent.click(bazTab);
    expect(fooTab.className).not.toContain('is-selected');
    expect(barTab.className).not.toContain('is-selected');
    expect(bazTab.className).toContain('is-selected');
    expect(panel).toHaveTextContent(/^$/);
  });

  test('hide', () => {
    const condition: SchemaBasedCondition = {
      scope: '',
      schema: {},
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'Foo',
          elements: [],
        },
      ],
      rule: {
        effect: RuleEffect.HIDE,
        condition,
      },
    };

    const { queryByRole } = renderForm(uischema, fixture.schema, fixture.data);
    expect(queryByRole('tablist')).not.toBeInTheDocument();
  });

  test('show by default', () => {
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'Foo',
          elements: [],
        },
      ],
    };

    const { queryByRole } = renderForm(uischema, fixture.schema, fixture.data);
    expect(queryByRole('tablist')).toBeInTheDocument();
  });

  test('hide single category', () => {
    const condition: SchemaBasedCondition = {
      scope: '',
      schema: {},
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'Foo',
          elements: [],
        },
        {
          type: 'Category',
          label: 'Bar',
          elements: [],
          rule: {
            effect: RuleEffect.HIDE,
            condition,
          },
        },
      ],
    };

    const { getByRole } = renderForm(uischema, fixture.schema, fixture.data);

    const tabList = getByRole('tablist');
    const tabs = tabList.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(1);
    expect(tabs[0]).toHaveTextContent('Foo');
  });

  test('disable', () => {
    const condition: SchemaBasedCondition = {
      scope: '',
      schema: {},
    };
    const nameControl = {
      type: 'Control',
      label: 'Name',
      scope: '#/properties/name',
    };
    const uischema: Categorization = {
      type: 'Categorization',
      label: '',
      elements: [
        {
          type: 'Category',
          label: 'Foo',
          elements: [nameControl],
        },
      ],
      rule: {
        effect: RuleEffect.DISABLE,
        condition,
      },
    };

    const { getByRole } = renderForm(uischema, fixture.schema, fixture.data);

    const tabList = getByRole('tablist');
    const tabs = tabList.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(1);
    expect(tabs[0].className).toContain('is-disabled');
  });
});
