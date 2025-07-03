import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../select/select-component';

@Component({
    selector: 'app-property-form',
    templateUrl: './property-form.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule, ToastrModule, CommonModule, SelectComponent ]
})
export class PropertyFormComponent implements OnInit {
    @Input() property: Property | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    imageFile: File | null = null;
    imagePreview: string |ArrayBuffer | null = null;
    propertyForm: FormGroup;
    editMode = false;
    isSubmitting = false
    // propertyId: string | null = null;
    nigerianStates = [
        { label: 'Select a state', value: '' },
        { label: 'Abia', value: 'Abia' },
        { label: 'Adamawa', value: 'Adamawa' },
        { label: 'Akwa Ibom', value: 'Akwa Ibom' },
        { label: 'Anambra', value: 'Anambra' },
        { label: 'Bauchi', value: 'Bauchi' },
        { label: 'Bayelsa', value: 'Bayelsa' },
        { label: 'Benue', value: 'Benue' },
        { label: 'Borno', value: 'Borno' },
        { label: 'Cross River', value: 'Cross River' },
        { label: 'Delta', value: 'Delta' },
        { label: 'Ebonyi', value: 'Ebonyi' },
        { label: 'Edo', value: 'Edo' },
        { label: 'Ekiti', value: 'Ekiti' },
        { label: 'Enugu', value: 'Enugu' },
        { label: 'FCT', value: 'FCT' },
        { label: 'Gombe', value: 'Gombe' },
        { label: 'Imo', value: 'Imo' },
        { label: 'Jigawa', value: 'Jigawa' },
        { label: 'Kaduna', value: 'Kaduna' },
        { label: 'Kano', value: 'Kano' },
        { label: 'Katsina', value: 'Katsina' },
        { label: 'Kebbi', value: 'Kebbi' },
        { label: 'Kogi', value: 'Kogi' },
        { label: 'Kwara', value: 'Kwara' },
        { label: 'Lagos', value: 'Lagos' },
        { label: 'Nasarawa', value: 'Nasarawa' },
        { label: 'Niger', value: 'Niger' },
        { label: 'Ogun', value: 'Ogun' },
        { label: 'Ondo', value: 'Ondo' },
        { label: 'Osun', value: 'Osun' },
        { label: 'Oyo', value: 'Oyo' },
        { label: 'Plateau', value: 'Plateau' },
        { label: 'Rivers', value: 'Rivers' },
        { label: 'Sokoto', value: 'Sokoto' },
        { label: 'Taraba', value: 'Taraba' },
        { label: 'Yobe', value: 'Yobe' },
        { label: 'Zamfara', value: 'Zamfara' }
    ];
    propertyTypes = [
        { label: 'Select property type', value: '' },
        { label: 'Flat', value: 'flat' },
        { label: 'Duplex', value: 'duplex' },
        { label: 'Bungalow', value: 'bungalow' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Land', value: 'land' }
      ];

    constructor(
        private fb: FormBuilder,
        private propertyService: PropertyService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.propertyForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            location: ['Lagos', [Validators.required]],
            type: ['flat', [Validators.required]],
            price: [0, [Validators.required, Validators.min(0)]],
            bedrooms: [1, [Validators.required, Validators.min(0)]],
            bathrooms: [1, [Validators.required, Validators.min(0)]],
            area: [0, [Validators.required, Validators.min(0)]],
            description: ['', [Validators.required, Validators.minLength(3)]],
        });
    }

    ngOnInit(): void {
        if (this.property) {
            this.editMode = true;
            this.propertyForm.patchValue(this.property);
            this.imagePreview = this.property.imageUrl || null;
        }
    }
    
    onCancel(): void {
        this.close.emit();
    }

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            if (file.size > 5 * 1024 * 1024) {
                this.toastr.error('Image size must be less than 5MB', 'Error');
                return;
            }
            this.imageFile = file;
            // preview
            const reader = new FileReader();
            reader.onload = e => {
                this.imagePreview = reader.result;
                this.propertyForm.patchValue({ imageUrl: this.imagePreview });
            };
            reader.readAsDataURL(this.imageFile);
        }
    }
    removeImage(): void {
        this.imageFile = null;
        this.imagePreview = null;
        this.propertyForm.patchValue({ imageUrl: '' });
      }

    onSubmit(): void {
        if (this.propertyForm.valid) {
            const property: Property = {
                ...this.propertyForm.value,
                imageUrl: this.imagePreview,
                id:this.editMode && this.property ? this.property.id : Math.random().toString(36).substring(2, 9)
            };
            if (this.editMode) {
                // const { id, createdAt, updatedAt, ...propertyData } = property;
                this.propertyService.updateProperty(property.id, property).subscribe(() => {
                    this.toastr.success('Property updated successfully!', 'Success');
                    this.saved.emit();
                    this.close.emit();
                    
                });
            } else {
                this.propertyService.createProperty(property).subscribe(() => {
                    this.toastr.success('Property added successfully!', 'Success');
                    this.saved.emit();
                    this.close.emit();
                });
            }
        } else {
            this.toastr.error('Please fill in all required fields correctly', 'Form Invalid');
        }
    }

}