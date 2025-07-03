import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css'],
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = 'Select an option';
    @Input() options: Array<string | { label: string; value: string }> = [];
    @Input() width: string = '100%';
    @Input() height: string = '48px'; // Increased for consistency with form inputs
    @Input() margin: string = '0';

    value: string = '';
    isDisabled = false;

    onChange = (value: any) => { };
    onTouched = () => { };

    writeValue(value: any): void {
        this.value = value ?? '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onSelectChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    isObjectOption(option: any): option is { label: string; value: string } {
        return typeof option === 'object' && option !== null && 'value' in option && 'label' in option;
    }
}