import React, { Component, PropTypes } from 'react';

export default class CalendarDay extends Component {
  handleClick = () => {
    if (!this.props.options.disabled) {
      const returnDate = this.props.date.format(this.props.returnFormat);
      this.props.onClick(returnDate);
    }
  };


  render() {
    const { options, date, format } = this.props;
    let className = 'calendar-day ';
    let event = null;

    if (options.className) className += options.className;
    if (options.disabled) className += ' disabled';

    if (options.event) {
      let eventClassName = 'day-event';
      if (options.event.className) eventClassName += ` ${eventClassName}`;
      event = <span className={eventClassName}>{options.event.text}</span>;
    }

    if (this.props.selected) {
      className += ' selected';
    }

    return (
      <div className={className} onClick={this.handleClick}>
        {date.format(format)}
        {event}
      </div>
    );
  }
}


CalendarDay.propTypes = {
  date: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  returnFormat: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  options: PropTypes.shape({
    className: PropTypes.string,
    disabled: PropTypes.bool,
    event: PropTypes.shape({
      className: PropTypes.string,
      text: PropTypes.node
    })
  })
};

CalendarDay.defaultProps = {
  select: false,
  options: {
    className: null,
    disabled: false,
    event: {
      className: null,
      text: null
    }
  }
};
