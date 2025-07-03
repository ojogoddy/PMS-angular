import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-analytics-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics-card.component.html'
})
export class AnalyticsCardComponent {
    @Input() title!: string;
    @Input() value!: string | number;
    @Input() subtitle!: string;
   
}