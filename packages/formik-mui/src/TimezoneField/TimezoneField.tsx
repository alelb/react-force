import React, { ReactNode } from 'react';
import Autocomplete, {
    AutocompleteRenderInputParams,
} from '@material-ui/lab/Autocomplete';
import { Timezone, timezones, TzUtils } from '@react-force/date-utils';
import { useField } from 'formik';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

const { findTimezone } = TzUtils;

interface AutocompleteInjectedProps {
    disableClearable: boolean;
    autoComplete: boolean;
    autoHighlight: boolean;
    value: Timezone;
    options: Timezone[];
    getOptionLabel: (option: Timezone) => string;
    renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
    onChange: (
        event: object,
        value: Timezone | Timezone[] | null,
        reason: string
    ) => void;
}

export interface TimezoneFieldProps {
    name: string;
    label?: string;
    renderContainer?: (props: AutocompleteInjectedProps) => JSX.Element;
}

/**
 * Formik field to select a timezone.
 *
 * The internal implementation uses <AutoComplete> which is always given
 * TimeZone objects:
 *
 * interface Timezone {
 *   name: string;
 *   label: string;
 * }
 *
 * When exchanging with formik field, the objects are converted to timezone
 * strings and vice-versa.
 */
export function TimezoneField({
    name,
    label,
    renderContainer = (props) => <Autocomplete {...props} />,
}: TimezoneFieldProps) {
    const [field, meta, helpers] = useField(name);

    // Field value is always a string representing the timezone
    const tz: string = field.value;

    const handleChange = (event: any, timezone: any) => {
        // Set field to only the name part
        helpers.setValue(timezone.name);
    };

    return renderContainer({
        disableClearable: true,
        autoComplete: true,
        autoHighlight: true,
        value: findTimezone(timezones, tz) as Timezone,
        options: timezones,
        getOptionLabel: (option: Timezone) => option.label,
        renderInput: ({ helperText, ...params }: TextFieldProps) => (
            <TextField
                label={label}
                helperText={
                    meta.touched && meta.error ? meta.error : helperText
                }
                error={!!(meta.touched && meta.error)}
                margin="normal"
                {...params}
            />
        ),
        onChange: handleChange,
    });
}