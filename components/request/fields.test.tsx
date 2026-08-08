import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxField, ErrorBanner, SelectField, TextField, US_STATES } from './fields';

/** Guards ACCESSIBILITY_AUDIT.md B2 and M2: before this, every wizard field was
    labelled by a bare <span>, so a screen reader announced "edit text, blank" on
    the only conversion flow in the product. */
describe('TextField', () => {
  it('associates its visible label with the input', () => {
    render(<TextField label="Email" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement);
  });

  it('wires an error to the input via aria-invalid and aria-describedby', () => {
    render(<TextField label="Email" value="" onChange={() => {}} error="Email is required" />);
    const input = screen.getByLabelText('Email');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email is required');
  });

  it('leaves aria-invalid off when the field is valid', () => {
    render(<TextField label="Email" value="a@b.co" onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  });

  it('gives each instance a unique id so labels do not cross-wire', () => {
    render(
      <>
        <TextField label="City" value="" onChange={() => {}} />
        <TextField label="ZIP code" value="" onChange={() => {}} />
      </>,
    );
    expect(screen.getByLabelText('City').id).not.toBe(screen.getByLabelText('ZIP code').id);
  });
});

describe('SelectField', () => {
  it('exposes an accessible name', () => {
    render(
      <SelectField label="Licensed state" value="" onChange={() => {}} options={US_STATES} />,
    );
    expect(screen.getByRole('combobox', { name: 'Licensed state' })).toBeInTheDocument();
  });

  it('describes itself with its error message', () => {
    render(
      <SelectField
        label="State"
        value=""
        onChange={() => {}}
        options={US_STATES}
        error="State is required"
      />,
    );
    expect(screen.getByRole('combobox', { name: 'State' })).toHaveAccessibleDescription(
      'State is required',
    );
  });
});

/** The attestation gate. Submission is blocked until it is checked, so a control
    outside the tab order meant no keyboard-only provider could submit at all. */
describe('CheckboxField', () => {
  it('renders a real checkbox named by its copy', () => {
    render(
      <CheckboxField checked={false} onChange={() => {}}>
        I confirm I am a licensed healthcare provider.
      </CheckboxField>,
    );
    expect(
      screen.getByRole('checkbox', { name: /licensed healthcare provider/i }),
    ).toBeInTheDocument();
  });

  it('is operable by keyboard alone', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CheckboxField checked={false} onChange={onChange}>
        I confirm I am a licensed healthcare provider.
      </CheckboxField>,
    );

    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();

    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('ErrorBanner', () => {
  it('announces itself and can receive focus', () => {
    render(<ErrorBanner count={2} detail="Email is required" />);
    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent('2 fields need attention.');
    alert.focus();
    expect(alert).toHaveFocus();
  });
});

describe('a rendered step has no axe violations', () => {
  it('passes with fields in both valid and error states', async () => {
    const { container } = render(
      <form>
        <TextField label="Name" value="" onChange={() => {}} />
        <TextField label="Email" value="" onChange={() => {}} error="Email is required" />
        <SelectField label="Licensed state" value="" onChange={() => {}} options={US_STATES} />
        <CheckboxField checked={false} onChange={() => {}}>
          I confirm I am a licensed healthcare provider.
        </CheckboxField>
        <ErrorBanner count={1} detail="Email is required" />
      </form>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
