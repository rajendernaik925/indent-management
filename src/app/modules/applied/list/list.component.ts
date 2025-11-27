import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../../../shared/shared-modules';
import { ReactiveFormsModule } from '@angular/forms';
import { COMMON_EXPORTS } from '../../../core/common-exports.constants';

@Component({
  selector: 'app-clinic',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
    COMMON_EXPORTS
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  city: string = '';
  weatherData: {
    temp: number;
    humidity: number;
    wind: number;
    description: string;
    icon: string;
  } | null = null;
  noDataFound: boolean = false;

  private APIkey = '7b8367f622803c81eb5f01191086fadb';

  constructor(private http: HttpClient) {}

  getWeather(event: Event): void {
    event.preventDefault();
    if (!this.city.trim()) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.APIkey}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.noDataFound = false;
        this.weatherData = {
          temp: Math.round(data.main.temp - 273.15), // Kelvin to Celsius
          humidity: data.main.humidity,
          wind: data.wind.speed,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        };
      },
      error: () => {
        this.noDataFound = true;
        this.weatherData = null;
      }
    });
  }

  getBackgroundClass(): string {
    if (!this.weatherData) return '';

    const condition = this.weatherData.description.toLowerCase();
    if (condition.includes('rain')) return 'bg-rain';
    if (condition.includes('cloud')) return 'bg-cloud';
    if (condition.includes('clear')) return 'bg-clear';
    return 'bg-default';
  }

}
