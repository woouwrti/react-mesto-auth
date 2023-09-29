import React from "react";
import Card from "./Card";
import Header from "./Header";
import CurrentUserContext from "../contexts/CurrentUserContext";

export default function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete,
  email,
  onLogout
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      {/* <Header isWrappable={true}>
        <p className="header__menu-item">{email}</p>
        <button href="#" className="header__menu-item" onClick={onLogout}>
          Выйти
        </button>
      </Header> */}

      <section className="profile">
        <div className="profile__avatar">
          <img
            src={currentUser.avatar}
            alt="Фотография пользователя"
            className="profile__avatar-image"
          />
          <button
            className="profile__avatar-button"
            type="button"
            aria-label="Обновить аватар"
            onClick={onEditAvatar}
          ></button>
        </div>
        <div className="profile__info">
          <div className="profile__name-line">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              type="button"
              className="profile__edit-button"
              aria-label="Редактировать профиль"
              onClick={onEditProfile}
            ></button>
          </div>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button
          type="button"
          className="profile__add-button"
          aria-label="Добавить фотографию"
          onClick={onAddPlace}
        ></button>
      </section>

      <section className="elements" aria-label="Фотографии">
        {cards.map((card) => (
          <Card
            card={card}
            key={card._id}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}