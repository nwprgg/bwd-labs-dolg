import { useState } from "react";
import { Event } from "../../../types/event";
import { User } from "../../../types/user";
import { deleteEvent, updateEvent } from "@api/eventService";
import styles from "./EventList.module.scss";

interface EventListProps {
  events: Event[];
  onEventUpdate: () => void;
  user: User | null;
}

const EventList = ({ events, onEventUpdate, user }: EventListProps) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  console.log(events);

  const handleDeleteClick = (id: string) => {
    setEventToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await deleteEvent(eventToDelete);
      onEventUpdate();
    } catch (error) {
      setError("Ошибка при удалении мероприятия");
      console.error("Ошибка при удалении мероприятия:", error);
    } finally {
      setShowDeleteConfirm(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      category: event.category,
    });
    setError("");
  };

  const handleSave = async () => {
    if (!editingEvent) return;

    try {
      await updateEvent(editingEvent.id, formData);
      setEditingEvent(null);
      onEventUpdate();
    } catch (error: any) {
       if (error.response?.status === 403) {
        setError("Можно редактировать только свои мероприятия");
      } else {
        setError("Ошибка при обновлении мероприятия");
        console.error("Ошибка при обновлении мероприятия:", error);
      }
    }
  };

  return (
    <>
      {error && (
        <div className={styles.errorBanner} onClick={() => setError("")}>
          {error}
          <span className={styles.closeError}>×</span>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationBox}>
            <p>Вы уверены, что хотите удалить мероприятие?</p>
            <div className={styles.confirmationButtons}>
              <button onClick={handleDelete} className={styles.confirmButton}>
                Удалить
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {events?.length === 0 ? (
        <div className={styles.emptyState}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
            alt="Нет мероприятий"
            className={styles.emptyIcon}
          />
          <h3>Мероприятий пока нет</h3>
        </div>
      ) : (
        <ul className={styles.eventList}>
          {events?.map((event) => (
            <li key={event.id} className={styles.eventCard}>
              {editingEvent?.id === event.id ? (
                <div className={styles.editForm}>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Название"
                    className={styles.inputField}
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Описание"
                    className={styles.textareaField}
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className={styles.inputField}
                  />
                  <div className={styles.formActions}>
                    <button onClick={handleSave} className={styles.saveButton}>
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditingEvent(null)}
                      className={styles.cancelButton}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.eventHeader}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    {event.createdBy && (
                      <span className={styles.eventAuthor}>
                        Автор: {event.createdBy}
                      </span>
                    )}
                  </div>
                  <p className={styles.eventDescription}>{event.description}</p>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventDate}>
                      📅 {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className={styles.eventCategory}>
                      🏷️ {event.category}
                    </span>
                  </div>
                  <div className={styles.eventActions}>
                    {user && event.createdBy === user.id && (
                      <>
                        <button
                          onClick={() => handleEdit(event)}
                          className={styles.editButton}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id)}
                          className={styles.deleteButton}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default EventList;