import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import CalendarDay from './day';


export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: this.getSelectedDay(),
      startDay: this.getFirstDisplayDate(),
      visibleMonths: this.props.visibleMonths
    };
  }


  onDaySelect = (date) => {
    this.setState({ selected: date }, () => {
      if (this.state.selected) {
        this.props.onSelect(date);
      }
    });
  };


  getSelectedDay() {
    if (this.props.minDate && moment(this.props.minDate).isAfter(this.props.selected)) {
      return moment(this.props.minDate).format();
    }

    return this.props.selected;
  }


  getFirstDisplayDate() {
    const today = moment();

    if (this.props.mode === 'YEAR_VIEW') {
      const i = today.month();
      const january = today.subtract(i, 'months');
      return moment(january.format());
    }

    return today.format();
  }


  getDaysForMonth(date) {
    const days = [];
    const monthStart = date.startOf('month');
    const diff = monthStart.weekday();


    for (let i = 1; i < diff; i++) {
      const day = moment(monthStart.format()).subtract(i, 'days');
      days.push({ day, className: 'prev-month', disabled: true });
    }

    const numberOfDays = date.daysInMonth();

    for (let i = 1; i <= numberOfDays; i++) {
      const day = moment([date.year(), date.month(), i]);
      let disabled = false;

      if (this.props.minDate) {
        disabled = day.isBefore(this.props.minDate);
      }

      if (this.props.maxDate) {
        disabled = day.isAfter(this.props.maxDate);
      }

      if (this.props.minDate && this.props.maxDate) {
        disabled = !day.isBetween(this.props.minDate, this.props.maxDate);
      }

      days.push({ day, disabled, className: 'current-month' });
    }

    let i = 1;
    while (days.length % 7 !== 0) {
      const day = moment(date.endOf('month').format()).add(i, 'days');
      days.push({ day, className: 'disabled next-month', disabled: true });
      i++;
    }

    return days;
  }


  getMonths() {
    const months = [];
    const startDay = moment(this.state.startDay);

    months.push({
      date: startDay,
      days: this.getDaysForMonth(startDay)
    });

    if (this.props.visibleMonths) {
      for (let i = 1; i < this.props.visibleMonths; i++) {
        const nextMonth = moment(startDay.format()).add(i, 'months');

        months.push({
          date: nextMonth,
          days: this.getDaysForMonth(nextMonth)
        });
      }
    }

    return months;
  }


  daysOfWeek() {
    const daysOfWeek = [];

    for (let i = 1; i < 8; i++) {
      daysOfWeek.push(moment().weekday(i).format('dd'));
    }

    return daysOfWeek;
  }

  switchMonth(i) {
    const interval = i * parseInt(this.props.visibleMonths, 10);
    const startDay = moment(this.state.startDay).add(interval, 'months');
    this.setState({ startDay: startDay.format(this.props.dateFormat) }, () => {
      if (this.props.onMonthChange) {
        this.props.onMonthChange(startDay.month() + 1);
      }
    });
  }

  showPrevMonth = () => {
    this.switchMonth(-1);
  };


  showNextMonth = () => {
    this.switchMonth(1);
  };


  renderDay = (date, i) => {
    const key = date.day.format(this.props.dateFormat);

    const options = {
      className: date.className,
      disabled: date.disabled
    };

    const isSelected = date.day.isSame(this.state.selected);

    if (this.props.days[key]) {
      const day = this.props.days[key];
      options.className += day.className || '';
      options.event = day.event || null;

      if (day.hasOwnProperty('disabled')) {
        options.disabled = day.disabled;
      }
    }

    return (
      <CalendarDay
        date={date.day}
        selected={isSelected}
        format={this.props.dayFormat}
        returnFormat={this.props.dateFormat}
        options={options}
        key={i}
        onClick={this.onDaySelect}
      />
    );
  };


  renderWeekDay(date, i) {
    let className = 'calendar-day week-day';
    if (i === 0) className += ' left-border';

    return (
      <div className={className} key={i}>
        {date}
      </div>
    );
  }


  renderMonth = (month, i) => {
    let width = `${98 / this.props.monthsInRow}%`;
    let marginLeft = 0;

    if (this.props.monthsInRow === 3) {
      marginLeft = (i % this.props.monthsInRow > 0) ? '1%' : 0;
    }

    if (this.props.monthsInRow === 2) {
      marginLeft = (i % this.props.monthsInRow > 0) ? '2%' : 0;
    }

    if (this.props.visibleMonths === 1 || this.props.monthsInRow === 1) {
      width = '100%';
    }

    const styles = {
      width,
      marginLeft
    };

    let className = `month month-${this.props.monthsInRow}`;

    if (i % this.monthsInRow > 0) {
      className += ' with-margin';
    }

    return (
      <div className={className} key={i} style={styles}>
        <h4>{month.date.format('MMMM YYYY')}</h4>
        {this.daysOfWeek().map(this.renderWeekDay)}
        {month.days.map(this.renderDay)}
        <div className="clearfix" />
      </div>
    );
  };


  renderControls() {
    return (
      <div className="controls">
        <div className="control prev" onClick={this.showPrevMonth}>
          {this.props.leftArrow}
        </div>
        <div className="control next" onClick={this.showNextMonth}>
          {this.props.rightArrow}
        </div>
      </div>
    );
  }


  render() {
    return (
      <div className="calendar">
        {this.renderControls()}
        {this.getMonths().map(this.renderMonth)}
        <div className="clearfix" />
      </div>
    );
  }
}

Calendar.propTypes = {
  selected: PropTypes.string,
  dateFormat: PropTypes.string,
  dayFormat: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  days: PropTypes.object,
  visibleMonths: PropTypes.number,
  monthsInRow: React.PropTypes.oneOf([1, 2, 3]),
  leftArrow: PropTypes.node,
  rightArrow: PropTypes.node,
  onSelect: PropTypes.func,
  onMonthChange: PropTypes.func,
  mode: PropTypes.oneOf([null, 'YEAR_VIEW'])
};

Calendar.defaultProps = {
  selected: moment().format('YYYY-MM-DD'),
  dateFormat: 'YYYY-MM-DD',
  dayFormat: 'D',
  minDate: moment().add(1, 'days').format('YYYY-MM-DD'),
  visibleMonths: 12,
  monthsInRow: 3,
  mode: 'WEEK_VIEW',
  days: {
    '2016-01-29': {
      disabled: true,
      event: {
        className: 'event-2',
        text: 2
      }
    }
  },
  onSelect: (date) => { console.log(date); },
  onMonthChange: (date) => { console.log(date); },
  leftArrow: <i className="glyphicon glyphicon-chevron-left" />,
  rightArrow: <i className="glyphicon glyphicon-chevron-right" />
};
