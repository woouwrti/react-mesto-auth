function InfoPopup({ message, onClose }) {
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) onClose(event);
  }

  return (
    <div
      className={`popup popup_type_info` + (message ? " popup_opened" : "")}
      onClick={handleOverlayClick}
    >
      <div className="popup__container popup__container_info">
        <div className={"popup__info-message" +
          (message
            ? message.isSuccess
              ? " popup__info-message_type_success"
              : " popup__info-message_type_fail"
            : "")
        }></div>
        <p
          className={"popup__error-message"}
        >
          {message ? message.text : " "}
        </p>

        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрыть окно"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default InfoPopup;
