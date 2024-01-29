import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-circle-letter',
  templateUrl: './circle-letter.component.html',
  styleUrls: ['./circle-letter.component.scss']
})
export class CircleLetterComponent implements AfterViewInit {
  @Input() letter: string = '';
  @Input() color: string = '';
  @ViewChild('circle') public circleView!: ElementRef;

  ngAfterViewInit(): void {
    this.color = this.getRandomColor();
    this.circleView.nativeElement.style.backgroundColor = this.color;
  }

  getRandomColor(): string {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var index = 0; index < 6; index++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }
}
