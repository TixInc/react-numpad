import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {MdCheck} from 'react-icons/md';
import {MdCheckCircle} from 'react-icons/md';
import {MdCancel} from 'react-icons/md';
import Button from './KeypadButton';
import Display from './Display';
import { media } from '../styles/media-templates';
import { NButton } from './ui';
import listenForOutsideClick from '../utils/outsideclick';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 264px;
  ${media.mobile`width: 100%;`} height: 300px;
  background: ${props => props.theme.body.backgroundColor};
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px;
`;

const Label = styled.div`
  overflow: hidden;
  font-size: 1.3em;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 5px;
  align-items: center;
  color: ${props => props.theme.header.secondaryColor};
  background: ${props => props.theme.header.backgroundColor};
  user-select: none;
`;

const Keys = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  button {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  button:nth-child(3n) {
    border-right: none;
  }
  button:nth-child(-n + 3) {
    border-top: 1px solid #ddd;
  }
`;

const KeyPad = (props) => {
  const keyPadRef = useRef(null);
  const { value, sync, validation, update, confirm, cancel, keyValid, dateFormat, show } = props;
  const [input, setInput] = useState(value);
  const [listening, setListening] = useState(false);
  const [mounted, setMounted] = useState(false);
  const numericKeys = [...Array(10).keys()];
  const inputRef = useRef(input);
  inputRef.current = input;

  useEffect(() => {
    const keyDown = (event) => {
      event.preventDefault();
      const { key } = event;
      if (key === 'Enter' && validation(input)) {
        confirm(input);
      } else if (key === 'Backspace') {
        cancelLastInsert();
      } else if (key === 'Escape') {
        cancel();
      } else if (numericKeys.includes(parseInt(key, 10)) || key === '.' || key === '-') {
        handleClick(key);
      }
    };

    document.addEventListener('keydown', keyDown);
    return () => document.removeEventListener('keydown', keyDown);
  }, [input, validation, confirm, cancel, numericKeys]);

  useEffect(() => {
    if (sync && validation(input)) {
      update(input);
    }
  }, [input, sync, validation, update]);

  const handleClickOutside = () => {
    if (validation(inputRef.current)) {
      confirm(inputRef.current);
    } else {
      cancel();
    }
  };

  useEffect(listenForOutsideClick(
    listening,
    setListening,
    keyPadRef,
    handleClickOutside
  ));


  const cancelLastInsert = useCallback(() => {
    setInput(prevInput => prevInput.slice(0, -1));
  }, []);

  const handleClick = useCallback((key) => {
    var isSelected = document.getSelection().toString() === input;

    if (keyValid(input, key, dateFormat)) {
      if (key === '-') {
        setInput(prevInput => 
          prevInput.charAt(0) === '-' ? prevInput.substr(1) : `-${prevInput}`
        );
      } else {
        if (isSelected) {
          setInput(key.toString());
        } else {
          setInput(prevInput => prevInput + key);
        }
      }
    }
  }, [input, keyValid, dateFormat]);

  const {
    displayRule,
    label,
    theme
  } = props;

  return (
      <Content id='numPadContent' ref={keyPadRef}>
        <Header>
          <NButton onClick={cancel}>
            <MdCancel />
          </NButton>
          <Label>{label}</Label>
          <NButton
            onClick={() => confirm(input)}
            disabled={!validation(input)}
          >
            {validation(input) ? <MdCheckCircle /> : <MdCheck />}
          </NButton>
        </Header>
        <Display
          value={input}
          displayRule={displayRule}
          dateFormat={dateFormat}
          cancel={cancelLastInsert}
        />
        <Keys>
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, '-', 0, '.'].map(key => (
            <Button
              key={`button-${key}`}
              theme={theme}
              click={clickedKey => handleClick(clickedKey)}
              value={key}
              disabled={!keyValid(input, key, dateFormat)}
            />
          ))}
        </Keys>
      </Content>
  );
};

KeyPad.displayName = 'KeyPad';

KeyPad.propTypes = {
  label: PropTypes.string,
  theme: PropTypes.string,
  confirm: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  displayRule: PropTypes.func.isRequired,
  validation: PropTypes.func.isRequired,
  keyValid: PropTypes.func.isRequired,
  dateFormat: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sync: PropTypes.bool.isRequired,
};

KeyPad.defaultProps = {
  label: undefined,
  theme: undefined,
  dateFormat: 'MM/DD/YYYY',
  value: '',
};

export default KeyPad;
