import React from "react";
import ReactDOM from 'react-dom';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmActionPopup from "./ConfirmActionPopup";

import CurrentUserContext from "../contexts/CurrentUserContext";
import AppContext from "../contexts/AppContext";

import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoPopup from "./InfoPopup";

import auth from "../utils/auth";

import Api from "../utils/Api";
import { apiConfig } from "../utils/apiConfig";
const api = new Api(apiConfig);



export default function App() {
  document.title = 'Mesto';

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [toBeDeletedCard, setToBeDeletedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const [infoMessage, setInfoMessage] = React.useState(null);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then(setCurrentUser)
        .catch(console.error);
      api
        .getInitialCards()
        .then(setCards)
        .catch(console.error);
    }
  }, [isLoggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddCardClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setToBeDeletedCard(null);
    setInfoMessage(null);
  }



  function handleCardClick(card) {
    setSelectedCard(card);
  }

  const [isLoading, setIsLoading] = React.useState(false);

  function handleSubmit(request) {
    setIsLoading(true);
    request()
      .then(closeAllPopups)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(userInfo) {
    function makeRequest() {
      return api
        .setUserInfo({ name: userInfo.name, desc: userInfo.about })
        .then((newUserInfo) => {
          setCurrentUser(newUserInfo);
          closeAllPopups();
        })
    }

    handleSubmit(makeRequest);
  }

  function handleUpdateAvatar({ avatar }) {

    function makeRequest() {
      return api
        .setAvatar(avatar)
        .then((newUserInfo) => {
          setCurrentUser(newUserInfo);
          closeAllPopups();
        })
    }

    handleSubmit(makeRequest);
  }

  function handleAddCard(newPlaceData) {

    function makeRequest() {
      return api
        .addNewCard(newPlaceData)
        .then((newCard) => {
          setCards((state) => [newCard, ...state]);
          closeAllPopups();
        })
    }

    handleSubmit(makeRequest);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch(console.error);
  }

  function handleCardDelete(card) {
    setToBeDeletedCard(card);
  }

  function handleConfirmDelete() {

    function makeRequest() {

      const cardId = toBeDeletedCard._id;
      return api
        .deleteCard(cardId)
        .then(() => {
          setCards((state) => state.filter((card) => card._id !== cardId));
          closeAllPopups();
        })
    }

    handleSubmit(makeRequest);
  }

  async function handleLogin(inputs) {
    return auth
      .authorize(inputs)
      .then(res => {
        if (res.token) localStorage.setItem('token', res.token);
        setEmail(inputs.email);
        setIsLoggedIn(true);
        navigate("/");
        return true
      })
      .catch((err) => {
        const text = err.message || "Что-то пошло не так! Попробуйте еще раз.";
        setInfoMessage({
          text: text,
          isSuccess: false,
        });
      });
  }

  async function handleRegister(inputs) {
    return auth
      .register(inputs)
      .then((res) => {
        setInfoMessage({
          text: "Вы успешно зарегистрировались!",
          isSuccess: true,
        });
        navigate("/sign-in");
        return true
      })
      .catch((err) => {
        const text = err.message || "Что-то пошло не так! Попробуйте еще раз.";
        setInfoMessage({
          text: text,
          isSuccess: false,
        });
      });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email)
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch(console.error);
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <AppContext.Provider value={{ isLoading }}>
        <div className="page">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggiedIn={isLoggedIn}>
                  <Header isWrappable={true}>
                    <p className="header__menu-item">{email}</p>
                    <button href="#" className="header__menu-item" onClick={handleLogout}>
                      Выйти
                    </button>
                  </Header>

                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddCardClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    email={email}
                    onLogout={handleLogout}
                  />

                  <Footer />

                  <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                  />

                  <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUserData={handleUpdateUser}
                  />

                  <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddCard}
                  />

                  <ConfirmActionPopup
                    isOpen={toBeDeletedCard}
                    onClose={closeAllPopups}
                    onConfirm={handleConfirmDelete}
                  />

                  <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sign-up"
              element={<Register onRegister={handleRegister} />}
            />
            <Route
              path="/sign-in"
              element={
                <Login
                  onLogin={handleLogin}
                />
              }
            />
            <Route
              path="*"
              element={
                isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
              }
            />
          </Routes>
          <InfoPopup message={infoMessage} onClose={closeAllPopups} />
        </div>
      </AppContext.Provider >
    </CurrentUserContext.Provider >
  );
}