import {Component, EventEmitter, Input, Output, OnInit, AfterViewInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  styles: [`
    .form-group.hidden {
      width: 0;
      margin: 0;
      border: none;
      padding: 0;
    }
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `]
})
export class DatepickerRangeComponent implements OnInit, AfterViewInit {

  @Output() dateSelection = new EventEmitter();
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
  }

  ngOnInit() {
    this.getDefaultSelectedDate();
  }

  ngAfterViewInit(){
  }

  getDefaultSelectedDate(): void {
    const dateSelectionObject = this.getDateSelectionObject();
    this.dateSelection.emit(dateSelectionObject);
  }

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    const dateSelectionObject = this.getDateSelectionObject();
    this.dateSelection.emit(dateSelectionObject);
  }

  getDateSelectionObject(): { toDate: Date, fromDate: Date } {
    const fromDate: Date = new Date(
      this.fromDate.year,
      this.fromDate.month - 1,
      this.fromDate.day
    );

    const toDate: Date = new Date(
      this.toDate && this.toDate.year,
      this.toDate && this.toDate.month - 1,
      this.toDate && this.toDate.day
    );

    return { toDate, fromDate }
  }

  /**
   * Event handler to hover event for daterange picker
   *
   * @param {NgbDate} date
   * @return {*}
   * @memberof DatepickerRangeComponent
   */
  isHovered(date: NgbDate): boolean {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  /**
   * Function will check if date given in in range
   *
   * @param {NgbDate} date
   * @return {*}
   * @memberof DatepickerRangeComponent
   */
  isInside(date: NgbDate): boolean {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   * Function will check the range for daterange picker
   *
   * @param {NgbDate} date
   * @return {*}
   * @memberof DatepickerRangeComponent
   */
  isRange(date: NgbDate): boolean {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  /**
   * Function will validate date input
   *
   * @param {(NgbDate | null)} currentValue
   * @param {string} input
   * @return {*}  {(NgbDate | null)}
   * @memberof DatepickerRangeComponent
   */
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  formatDate(ngbDate: NgbDate) {
    if (!ngbDate) return ''
    const jsDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);

    return moment(jsDate).format('DD/MM/YYYY');
  }

  getEndDate() {
    return this.toDate ? this.formatDate(this.toDate) : this.formatDate(this.fromDate);
  }
}