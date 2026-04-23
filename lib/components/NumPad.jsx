import React, { useState, useEffect, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';
import { ThemeProvider } from 'styled-components';
import Slide from '@mui/material/Slide';
import { InputField, Wrapper } from '../elements';
import styles from '../styles';

const getTransition = (show, position) => {
  let transition = Slide;
  let transitionProps = {
    in: show,
    direction: 'up',
    mountOnEnter: true,
    unmountOnExit: true,
  };
  if (position === 'flex-start') {
    transitionProps.direction = 'down';
  }
  if (position !== 'flex-start' && position !== 'flex-end') {
    transition = 'span';
    transitionProps = {};
  }
  return { transition, transitionProps };
};

const updateCoords = {
  startBottomLeft: coords => ({
    top: `${coords.bottom + window.pageYOffset}px`,
    left: `${coords.left + window.pageXOffset}px`,
  }),
  startBottomRight: coords => ({
    top: `${coords.bottom + window.pageYOffset}px`,
    right: `${window.innerWidth - coords.right + window.pageXOffset}px`,
  }),
  startTopLeft: coords => ({
    top: `${coords.top + window.pageYOffset - 300}px`,
    left: `${coords.left + window.pageXOffset}px`,
  }),
  startTopRight: coords => ({
    top: `${coords.top + window.pageYOffset - 300}px`,
    right: `${window.innerWidth - coords.right + window.pageXOffset}px`,
  }),
};

export default ({
  element,
  validation,
  formatInputValue,
  displayRule,
  inputButtonContent,
  keyValid,
}) => {
  const NumPad = (props) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(formatInputValue(props.value));
    const [inputCoords, setInputCoords] = useState(undefined);

    useEffect(() => {
      if (props.value !== value) {
        setValue(formatInputValue(props.value));
      }
    }, [props.value]);

    const toggleKeyPad = (coords = {}) => {
      const { position } = props;
      const newInputCoords =
        !show && updateCoords[position] ? updateCoords[position](coords) : undefined;
      setShow(prevShow => !prevShow);
      setInputCoords(newInputCoords);
      
      // Use setTimeout to ensure state update happens before scrolling
      setTimeout(() => {
        var numPadContent = document.getElementById('numPadContent');
        if (numPadContent) {
          numPadContent.scrollIntoView();
        }
      }, 0);
    };

    const update = (newValue) => {
      const { dateFormat, onChange } = props;
      onChange(displayRule(newValue, dateFormat));
    };

    const confirm = (newValue) => {
      if (show && validation(newValue)) {
        setValue(newValue);
        update(newValue);
      }
      setShow(prevShow => !prevShow);
    };

    const {
      placeholder,
      label,
      theme,
      dateFormat,
      locale,
      weekOffset,
      markers,
      dates,
      min,
      max,
      position,
      sync,
      nodeId,
      children,
      onChange
    } = props;
    
    const customTheme = typeof theme === 'object' ? theme : styles(theme);
    customTheme.position = position;
    customTheme.coords = inputCoords;

    const display = position !== 'flex-start' && position !== 'flex-end' ? show : true;
    const { transition, transitionProps } = getTransition(show, position);

    return (
        <Fragment>
          <ThemeProvider theme={customTheme}>
            <InputField
              placeholder={placeholder}
              showKeyPad={toggleKeyPad}
              inputValue={value}
              dateFormat={dateFormat}
              displayRule={displayRule}
              label={label}
              disabled={show}
              buttonContent={inputButtonContent}
            >
              {children}
            </InputField>
          </ThemeProvider>
          <Portal node={document && nodeId && document.getElementById(nodeId)}>
            {display &&
              React.createElement(
                transition,
                transitionProps,
                <ThemeProvider theme={customTheme}>
                  <Wrapper show>
                    {React.createElement(
                      element,
                      {
                        cancel: toggleKeyPad,
                        confirm: confirm,
                        update: update,
                        eventTypes: ['click', 'touchend'],
                        displayRule,
                        validation,
                        keyValid,
                        label,
                        locale,
                        markers,
                        dates,
                        weekOffset,
                        dateFormat,
                        min,
                        max,
                        value,
                        sync,
                        show,
                      },
                      null
                    )}
                  </Wrapper>
                </ThemeProvider>
              )}
          </Portal>
        </Fragment>
      );
    };

  NumPad.defaultProps = {
    children: undefined,
    placeholder: undefined,
    position: 'flex-end',
    label: undefined,
    theme: undefined,
    dateFormat: 'MM/DD/YYYY',
    weekOffset: 0,
    locale: 'en',
    value: '',
    min: undefined,
    max: undefined,
    sync: false,
    markers: [],
    dates: {},
  };

  NumPad.propTypes = {
    onChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.element)]),
    placeholder: PropTypes.string,
    position: PropTypes.string,
    label: PropTypes.string,
    locale: PropTypes.string,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    dateFormat: PropTypes.string,
    weekOffset: PropTypes.number,
    markers: PropTypes.arrayOf(PropTypes.string),
    dates: PropTypes.objectOf(PropTypes.array),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min: PropTypes.string,
    max: PropTypes.string,
    sync: PropTypes.bool,
    nodeId: PropTypes.string,
  };

  return NumPad;
};
