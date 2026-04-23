export default function listenForOutsideClick(listening, setListening, ref, handleClickOutside) {
    return () => {
      if (listening) return;
      if (!ref.current) return;
      setListening(true);
      let firstClicked = false;
      let firstTouched = false;
      [`click`, `touchstart`].forEach((type) => {
        document.addEventListener(`click`, (evt) => {
            if (type === 'click') {
              if (!firstClicked) {
                firstClicked = true
                return
              }
            }
            if (type === 'touchstart') {
              if (!firstTouched) {
                firstTouched = true
                return
              }
            }

            if (!ref.current) return;
            if (ref.current.contains(evt.target)) return;
            handleClickOutside();
        });
      });
    }
  }