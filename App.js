import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import deleteicon from './trash.png';
import settingsicon from './settings.png'

function Alert({ message, onClose }) {
  return (
    <div className="alert">
      <div className="alert-message">{message}</div>
      <button className="alert-close" onClick={onClose}>
        X
      </button>
    </div>
  );
}

const DeleteConfirmation = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation">
      <div className="confirmation-message">{message}</div>
      <div className="button-group">
        <button className="yes-button" onClick={onConfirm}>
          Kyllä
        </button>
        <button className="no-button" onClick={onCancel}>
          Ei
        </button>
      </div>
    </div>
  );
};

const SettingsMenu = ({ toggleLanguage, toggleTheme, language, theme, onClose }) => {
  return (
    <div className="settings-menu">
      <h2>Asetukset</h2>
      <div className="settings-option">
        <div className="option-label">Kieli:</div>
        <div className="language-toggle">
          <div
            className={`language-option ${language === 'fi' ? 'active' : ''}`}
            onClick={() => toggleLanguage('fi')}
          >
            Suomi
          </div>
          <div
            className={`language-option ${language === 'en' ? 'active' : ''}`}
            onClick={() => toggleLanguage('en')}
          >
            English
          </div>
          <div className="language-indicator" style={{ left: language === 'fi' ? '0' : '50%' }}></div>
        </div>
      </div>
      <div className="settings-option">
        <div className="option-label">Teema:</div>
        <div className="theme-toggle">
          <div
            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
            onClick={() => toggleTheme('light')}
          >
            Vaalea
          </div>
          <div
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => toggleTheme('dark')}
          >
            Tumma
          </div>
          <div className="theme-indicator" style={{ left: theme === 'light' ? '0' : '50%' }}></div>
        </div>
      </div>
      <button className='closing-button' onClick={onClose}>X</button>
    </div>
  );
};

function NoteApp() {
  const startDate = new Date('2024-04-29');

  const [notes, setNotes] = useState([
    {
      id: 1,
      name: 'Ohjelmointi 1',
      desc: 'TS137',
      color: 'green',
      date: new Date('2024-04-30'),
      time: '10:00'
    },
    {
      id: 2,
      name: 'Ohjelmointi 3',
      desc: 'TS137',
      color: 'blue',
      date: new Date('2024-05-02'),
      time: '10:00'
    },
    {
      id: 3,
      name: 'Ohjelmointi 4',
      desc: 'TS137',
      color: 'red',
      date: new Date('2024-05-01'),
      time: '10:00'
    },
    {
      id: 4,
      name: 'Ohjelmointi 2',
      desc: 'TS137',
      color: 'yellow',
      date: new Date('2024-05-03'),
      time: '10:00'
    },
    {
      id: 5,
      name: 'Ohjelmointi 5',
      desc: 'TS137',
      color: 'red',
      date: new Date('2024-05-04'),
      time: '10:00'
    },
    {
      id: 6,
      name: 'Ohjelmointi 6',
      desc: 'TS137',
      color: 'blue',
      date: new Date('2024-05-05'),
      time: '10:00'
    },
    {
      id: 7,
      name: 'Ohjelmointi 7',
      desc: 'TS137',
      color: 'green',
      date: new Date('2024-04-29'),
      time: '10:00'
    }
  ]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [selectedColorOption, setSelectedColorOption] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const days = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'];
  const [nextId, setNextId] = useState(notes.length + 1);
  const [showDayView, setShowDayView] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState('fi');
  const [theme, setTheme] = useState('light');

  const toggleLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    const indicatorPosition = selectedLanguage === 'fi' ? '0' : '50%';
    document.querySelector('.language-indicator').style.left = indicatorPosition;
  };

  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });
  });

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    const indicatorPosition = selectedTheme === 'light' ? '0' : '50%';
    document.querySelector('.theme-indicator').style.left = indicatorPosition;
  };

  const toggleSettingsMenu = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    filterNotesByDay(currentDay);
  }, [currentDay, notes]);

  const addNote = () => {
    if (editMode) {
      const updatedNotes = notes.map(note => {
        if (note.id === editNoteId) {
          return {
            ...note,
            name: name,
            desc: desc,
            time: time,
            color: selectedColor,
            date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + currentDay),
            completed: false
          };
        }
        return note;
      });
      setNotes(updatedNotes);
      setEditMode(false);
      setEditNoteId(null);
      setShowInputs(false);
      setName('');
      setDesc('');
      setTime('');
      setSelectedColor('');
      setSelectedColorOption(null);
    } else {
      if (name && selectedColor && time) {
        if (/^\d{1,2}:\d{2}$/.test(time)) {
          const newNote = {
            id: nextId,
            name: name,
            desc: desc,
            time: time,
            color: selectedColor,
            date: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + currentDay),
            completed: false
          };
          setNotes(prevNotes => [...prevNotes, newNote]);
          setShowInputs(false);
          setName('');
          setDesc('');
          setTime('');
          setSelectedColor('');
          setSelectedColorOption(null);
          setNextId(nextId + 1);
          filterNotesByDay();
        }
      } else {
        setAlertMessage('Valitse vähintään väri, nimi ja aika');
      }
    }
  };

  const handleHourChange = (e) => {
    let selectedHour = parseInt(e.target.value);
    selectedHour = Math.min(selectedHour || 0, 23);
    const formattedHour = selectedHour.toString().padStart(2, "0");
    setTime(formattedHour + ":" + time.split(":")[1]);
  };

  const handleMinuteChange = (e) => {
    let selectedMinute = parseInt(e.target.value);
    selectedMinute = Math.min(selectedMinute || 0, 59);
    const formattedMinute = selectedMinute.toString().padStart(2, "0");
    setTime(time.split(":")[0] + ":" + formattedMinute);
  };

  const handleDeleteNote = id => {
    const confirmDelete = (
      <DeleteConfirmation
        message="Haluatko varmasti poistaa muistion?"
        onConfirm={() => {
          const updatedNotes = notes.filter(note => note.id !== id);
          setNotes(updatedNotes);
          setName('');
          setTime('');
          setDesc('');
          setSelectedColor('');
          setSelectedColorOption(null);
          setShowInputs(false);
          setEditMode(false);
          setEditNoteId(null);
          setAlertMessage('');
        }}
        onCancel={() => {
          setAlertMessage('');
        }}
      />
    );
    setAlertMessage(confirmDelete);
  };

  const handleEditNote = id => {
    const noteToEdit = notes.find(note => note.id === id);
    setName(noteToEdit.name);
    setTime(noteToEdit.time);
    setDesc(noteToEdit.desc);
    setSelectedColor(noteToEdit.color);
    setSelectedNoteId(id);
    setEditMode(true);
    setEditNoteId(id);
    setShowInputs(true);
    setSelectedColorOption(noteToEdit.color);
  };

  const handleColorSelect = color => {
    setSelectedColor(color);
    setSelectedColorOption(color);
  };

  const handleNoteCompletionToggle = id => {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        return {
          ...note,
          completed: !note.completed
        };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const handleClose = () => {
    setName('');
    setTime('');
    setDesc('');
    setSelectedColor('');
    setSelectedColorOption(null);
    setShowInputs(false);
    setEditMode(false);
    setEditNoteId(null);
  };

  const getCurrentDate = () => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + currentDay);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const prevDay = () => {
    setCurrentDay(currentDay === 0 ? 6 : currentDay - 1);
  };

  const nextDay = () => {
    setCurrentDay(currentDay === 6 ? 0 : currentDay + 1);
  };

  const toggleDayView = (dayIndex) => {
    setCurrentDay(dayIndex);
    setShowDayView(!showDayView);
  };

  const filterNotesByDay = (dayIndex) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + dayIndex);
    const filteredNotes = notes.filter(note => {
      const noteDate = new Date(note.date);
      return (
        noteDate.getFullYear() === currentDate.getFullYear() &&
        noteDate.getMonth() === currentDate.getMonth() &&
        noteDate.getDate() === currentDate.getDate()
      );
    });
    return filteredNotes;
  };

  return (
    <div className="note-app">
      {!showDayView && (
        <header className="app-header">
          <div className="header-container">
            <h1>Note App</h1>
          </div>
        </header>
      )}
      {showDayView && (
        <header className="app-header">
          <div className="header-container">
            <h1>Note App</h1>
          </div>
          <div className='week-number'>
            <p>Viikko 17</p>
          </div>
          <div className='weekdays'>
            <p>29.4-1.5</p>
          </div>
          <div> <button className="day-settings" onClick={toggleSettingsMenu}>
            <img src={settingsicon} alt="Asetukset" className="settings-icon" />
          </button>
            {showSettings && (
              <SettingsMenu
                toggleLanguage={toggleLanguage}
                toggleTheme={toggleTheme}
                language={language}
                theme={theme}
                onClose={toggleSettingsMenu}
              />
            )}
          </div>
        </header>
      )}
      {showDayView ? (
        <div className="days-container">
          {days.map((day, index) => (
            <div className="day" key={index} onClick={() => toggleDayView(index)}>
              <div className="day-name">{day}</div>
              {filterNotesByDay(index).length > 0 && (
                <div className="day-note" style={{ borderColor: filterNotesByDay(index)[0].color }}>
                  <h3>{filterNotesByDay(index)[0].time} {filterNotesByDay(index)[0].name}</h3>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="notes-container">
          <div className="selected-day">
            <span className="current-day">{days[currentDay]}</span>
            <span className="current-date">{getCurrentDate()}</span>
            <button className="back-button" onClick={() => setShowDayView(true)}>
              X
            </button>
          </div>
          {filterNotesByDay().map((note, index) => (
            <div
              className={`note ${note.completed ? 'completed' : ''}`}
              key={note.id}
              style={{ borderColor: note.color }}
              onClick={() => handleEditNote(note.id)}
            >
              <div className="note-details" onClick={() => handleEditNote(note.id)}>
                <h3>{note.time} {note.name}</h3>
                <p>{note.desc}</p>
              </div>
              <div className="note-actions">
                <input
                  type="checkbox"
                  className='custom-checkbox'
                  checked={note.completed}
                  onChange={() => handleNoteCompletionToggle(note.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {showInputs && (
        <div className="note-creation-box">
          <div className="input-group">
            <div className="input-label">Valitse väri</div>
            <div className="color-options">
              <div className={`color-option ${selectedColorOption === 'red' ? 'selected' : ''}`} style={{ backgroundColor: 'red' }} onClick={() => handleColorSelect('red')}></div>
              <div className={`color-option ${selectedColorOption === 'blue' ? 'selected' : ''}`} style={{ backgroundColor: 'blue' }} onClick={() => handleColorSelect('blue')}></div>
              <div className={`color-option ${selectedColorOption === 'green' ? 'selected' : ''}`} style={{ backgroundColor: 'green' }} onClick={() => handleColorSelect('green')}></div>
              <div className={`color-option ${selectedColorOption === 'yellow' ? 'selected' : ''}`} style={{ backgroundColor: 'yellow' }} onClick={() => handleColorSelect('yellow')}></div>
              <button className='close-button' onClick={handleClose}>X</button>
            </div>
          </div>
          <div className="input-group">
            <div className="input-label">Nimi</div>
            <input
              type="text"
              placeholder="Anna muistion nimi"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <div className="input-label">Aika</div>
            <div className="time-picker">
              <select value={parseInt(time.split(":")[0])} onChange={handleHourChange}>
                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                  <option key={hour} value={hour}>{hour.toString().padStart(2, "0")}</option>
                ))}
              </select>
              <span>:</span>
              <select value={parseInt(time.split(":")[1])} onChange={handleMinuteChange}>
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                  <option key={minute} value={minute}>{minute.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="input-group">
            <div className="input-label">Kuvaus</div>
            <textarea
              placeholder="Anna muistion kuvaus"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="button-group">
            {editMode && (
              <button className="delete-button" onClick={() => handleDeleteNote(editNoteId)}>
                <img src={deleteicon} alt="Poista" className="delete-icon" />
              </button>
            )}
            {editMode ? (
              <button className="update-note-button confirm-button" onClick={addNote}>
                &#x2713;
              </button>
            ) : (
              <button className="checkmark-button confirm-button" onClick={addNote}>
                &#x2713;
              </button>
            )}
          </div>
        </div>
      )}
      {!showDayView && (
        <div className="notes-container">
          {filterNotesByDay(currentDay).map((note, index) => (
            <div
              className={`note ${note.completed ? 'completed' : ''}`}
              key={note.id}
              style={{ borderColor: note.color }}
              onClick={() => handleEditNote(note.id)}
            >
              <div className="note-details" onClick={() => handleEditNote(note.id)}>
                <h3>{note.time} {note.name}</h3>
                <p>{note.desc}</p>
              </div>
              <div className="note-actions">
                <input
                  type="checkbox"
                  className='custom-checkbox'
                  checked={note.completed}
                  onChange={() => handleNoteCompletionToggle(note.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {!showDayView && (
        <div className="bottom-container">
            <button className="leftbutton" onClick={prevDay}>&#x21E6;</button>
            <button className="rightbutton" onClick={nextDay}>&#x21E8;</button>
        </div>
      )}
      {!showDayView && (
        <button className="add-note-button" onClick={() => setShowInputs(true)}>
          +
        </button>
      )}
      {alertMessage && (
        <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
      )}
    </div>
  );
}

const App = () => {
  return (
    <div className="mobile-container">
      <NoteApp />
    </div>
  );
};

export default NoteApp && App;