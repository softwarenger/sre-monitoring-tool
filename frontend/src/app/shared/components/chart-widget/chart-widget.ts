import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart-widget',
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './chart-widget.html',
  styleUrl: './chart-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartWidget implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() title: string = '';
  @Input() data: { timestamp: Date; value: number }[] = [];
  @Input() type: 'line' | 'bar' = 'line';
  @Input() color: string = '#3f51b5';
  @Input() label: string = 'Value';

  public chartData: ChartData<'line' | 'bar'> = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        display: true,
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['type'] || changes['color']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    if (!this.data || this.data.length === 0) {
      return;
    }

    const labels = this.data.map(d => {
      const date = new Date(d.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });

    const values = this.data.map(d => d.value);

    this.chartData = {
      labels,
      datasets: [
        {
          data: values,
          label: this.label,
          borderColor: this.color,
          backgroundColor: this.type === 'bar' 
            ? this.color + '80' 
            : this.color + '20',
          fill: this.type === 'line',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4
        }
      ]
    };

    if (this.chart) {
      this.chart.update();
    }
  }
}
