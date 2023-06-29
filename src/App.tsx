import { useEffect, useState } from "react";

interface Artist {
  id: string;
  artist: string;
  attendees: string[];
  attending: boolean;
  timeStart: string;
  timeEnd: string;
}

interface Stage {
  stage: string;
  artists: Artist[];
}

interface Day {
  date: string;
  weekDay: string;
  stages: Stage[];
}

interface Schedule {
  weekName: string;
  weekNumber: number;
  days: Day[];
}

interface ScheduleAPIResponse {
  me: string;
  owner: string;
  schedule: Schedule[];
}

const App = () => {
  const [secretUUID, setSecretUUID] = useState("");

  const [showMoveCopiedToClipboard, setShowMoveCopiedToClipboard] =
    useState(false);
  const [showShareError, setShowShareError] = useState(false);
  const [showShareCopiedToClipboard, setShareCopiedToClipboard] =
    useState(false);

  const [title, setTitle] = useState("Unnamed");

  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);

  const [schedule, setSchedule] = useState([] as Schedule[]);

  const fetchLatestSchedule = () => {
    fetch("https://planevent.me/api/schedule", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data: ScheduleAPIResponse) => {
        setSchedule(data.schedule);
      });
  };

  const fetchSecret = () => {
    fetch("https://planevent.me/api/secret", {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((body: string) => {
        setSecretUUID(body);
      });
  };

  const postLogin = (secretId: string) => {
    return fetch("https://planevent.me/api/login?secretId=" + secretId, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (!response.ok)
        throw new Error("Something went wrong when logging user in");
    });
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const subPaths = window.location.pathname.split("/");
      if (subPaths[1] === "move") {
        await postLogin(subPaths[2]);
        window.history.replaceState({}, "Home", "/");
      }

      fetchLatestSchedule();
      fetchSecret();
    };

    fetchAPI();
  }, []);

  const changeWeek = (changedWeek: number) => {
    setCurrentWeek(changedWeek);
  };

  const changeDay = (changedDay: number) => {
    setCurrentDay(changedDay);
  };

  const changeStage = (changedStage: number) => {
    const currentDayStageCount =
      schedule[currentWeek].days[currentDay].stages.length;

    // If we change from stage 0 back - loop around from first stage
    if (changedStage === -1) {
      changedStage = currentDayStageCount - 1;
    }

    // If we change from last stage + 1 - loop around from last stage
    if (changedStage >= currentDayStageCount) {
      changedStage = 0;
    }

    setCurrentStage(changedStage);
  };

  const updateAttendanceStatus = (
    slotId: string,
    newAttendingStatus: boolean
  ) => {
    fetch(
      "https://planevent.me/api/attend?eventId=" +
        slotId +
        "&attending=" +
        newAttendingStatus,
      {
        method: "POST",
        credentials: "include",
      }
    ).then((response) => {
      if (!response.ok)
        throw new Error("Something went wrong when updating attendance");
    });
    fetchLatestSchedule();
  };

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const handleMoveSchedule = async () => {
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.hostname +
        "/move/" +
        secretUUID
    );

    setShowMoveCopiedToClipboard(true);
    await timeout(2000);
    setShowMoveCopiedToClipboard(false);
  };

  const handleShareSchedule = async () => {
    if (title === "Unnamed") {
      setShowShareError(true);
      return;
    }
    navigator.clipboard.writeText(
      window.location.protocol +
        "//" +
        window.location.hostname +
        "/share/" +
        secretUUID
    );

    setShareCopiedToClipboard(true);
    await timeout(2000);
    setShareCopiedToClipboard(false);
  };

  const handleDonateClick = () => {
    window.open("https://buy.stripe.com/6oE7tu7UM3235dCeUU", "_blank");
  };

  const handleTitleChange = (newTitle: string) => {
    setShowShareError(false);
    setTitle(newTitle);
  };

  return (
    <div>
      <div id="top-buttons-container">
        <div id="top-buttons">
          <div className="top-button-container">
            {!showMoveCopiedToClipboard && (
              <>
                <button
                  id="move-schedule"
                  className="button-black"
                  onClick={handleMoveSchedule}
                >
                  <img
                    src="/device.png"
                    alt="Move schedule to a different device"
                  />
                </button>
                <div className="top-button-description">
                  Move schedule to a new device
                </div>
              </>
            )}
            {showMoveCopiedToClipboard && (
              <>
                <button className="success-checkmark-button button-green">
                  <img
                    src="/checkmark.png"
                    alt="Copied move link to clipboard"
                  />
                </button>
                <div className="top-button-description text-green">
                  Link copied to clipboard
                  <br />
                </div>
              </>
            )}
          </div>
          <div className="top-button-container">
            {showShareError && (
              <>
                <button id="share-error" className="button-orange">
                  <img
                    src="/exclamation.png"
                    alt="Please add title, before sharing"
                  />
                </button>
                <div className="top-button-description text-orange">
                  Please add title, before sharing
                </div>
              </>
            )}
            {!showShareError && !showShareCopiedToClipboard && (
              <>
                <button
                  id="share-schedule"
                  className="button-black"
                  onClick={handleShareSchedule}
                >
                  <img src="/share.png" alt="Share schedule with others" />
                </button>
                <div className="top-button-description">
                  Share schedule with others
                </div>
              </>
            )}
            {!showShareError && showShareCopiedToClipboard && (
              <>
                <button className="success-checkmark-button button-green">
                  <img
                    src="/checkmark.png"
                    alt="Copied share link to clipboard"
                  />
                </button>
                <div className="top-button-description text-green">
                  Link copied to clipboard
                </div>
              </>
            )}
          </div>
          <div className="top-button-container">
            <button id="donate" onClick={handleDonateClick}>
              <img src="/heart.png" alt="Donate" />
            </button>
            <div className="top-button-description">Donate</div>
          </div>
        </div>
      </div>
      <div id="title-and-edit-button">
        <Title
          warningFont={showShareError}
          title={title}
          handleTitleChange={handleTitleChange}
        />
      </div>
      <DaySelector
        schedule={schedule}
        currentWeek={currentWeek}
        currentDay={currentDay}
        currentStage={currentStage}
        changeWeek={changeWeek}
        changeDay={changeDay}
        changeStage={changeStage}
      />
      <TodaysSchedule
        schedule={
          schedule[currentWeek]?.days[currentDay]?.stages[currentStage]
            ?.artists || []
        }
        updateAttendanceStatus={updateAttendanceStatus}
      />
    </div>
  );
};

interface TitleProps {
  warningFont: boolean;
  title: string;
  handleTitleChange: (title: string) => void;
}

const Title = (props: TitleProps) => {
  return (
    <input
      style={{ width: "100%" }}
      id="title"
      className={props.warningFont ? "text-orange" : "text-white"}
      type="text"
      maxLength={32}
      onChange={(e) => {
        props.handleTitleChange(e.target.value as string);
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          const target = e.target as HTMLInputElement;
          e.preventDefault();
          target.blur();
        }
      }}
      value={props.title}
    />
  );
};

interface DaySelectorProps {
  schedule: Schedule[];
  currentWeek: number;
  currentDay: number;
  currentStage: number;
  changeWeek: (weekNumber: number) => void;
  changeDay: (weekNumber: number) => void;
  changeStage: (weekNumber: number) => void;
}

const DaySelector = (props: DaySelectorProps) => {
  if (props.schedule.length === 0) {
    return <div>Loading dates...</div>;
  }

  return (
    <div>
      <div id="week-selector">
        {props.schedule.map((slot, i) => {
          return (
            <div
              key={i}
              className={
                `week-day-stage-item week` +
                (i === props.currentWeek ? " active" : "")
              }
              onClick={() => props.changeWeek(i)}
            >
              {slot.weekName}
            </div>
          );
        })}
      </div>
      <div id="day-selector">
        {props.schedule[props.currentWeek]?.days.map((slot, i) => {
          return (
            <div
              key={i}
              className={
                `week-day-stage-item day` +
                (i === props.currentDay ? " active" : "")
              }
              onClick={() => props.changeDay(i)}
            >
              {slot.weekDay}
            </div>
          );
        })}
      </div>
      <div id="stage-selector">
        <div
          className="week-day-stage-item stage-item stage-previous-next"
          onClick={() => {
            props.changeStage(props.currentStage - 1);
          }}
        >
          &lt;
        </div>
        <div id="stage" className="week-day-stage-item stage-item active">
          {
            props.schedule[props.currentWeek]?.days[props.currentDay]?.stages[
              props.currentStage
            ]?.stage
          }
        </div>
        <div
          className="week-day-stage-item stage-item stage-previous-next"
          onClick={() => props.changeStage(props.currentStage + 1)}
        >
          &gt;
        </div>
      </div>
    </div>
  );
};

interface TodaysScheduleProps {
  schedule: Artist[];
  updateAttendanceStatus: (slotId: string, newAttendingStatus: boolean) => void;
}

const TodaysSchedule = (props: TodaysScheduleProps) => {
  if (props.schedule.length === 0) {
    return <div>Loading artists...</div>;
  }

  return (
    <div id="schedule">
      <div id="timeslot-header">
        <div>Time</div>
        <div>Artist</div>
        <div>Attendees</div>
      </div>
      {props.schedule.map((slot: Artist, i: number) => {
        const hourStart = new Date(Date.parse(slot.timeStart));
        const hourEnd = new Date(Date.parse(slot.timeEnd));

        return (
          <div
            key={slot.id}
            className={`timeslot` + (slot.attending ? " attending" : "")}
            onClick={() =>
              props.updateAttendanceStatus(slot.id, !slot.attending)
            }
          >
            <div className="timeslot-sides">
              {(hourStart.getHours() < 10 ? "0" : "") + hourStart.getHours()}:
              {(hourStart.getMinutes() < 10 ? "0" : "") +
                hourStart.getMinutes()}
              -{(hourEnd.getHours() < 10 ? "0" : "") + hourEnd.getHours()}:
              {(hourEnd.getMinutes() < 10 ? "0" : "") + hourEnd.getMinutes()}{" "}
            </div>
            <div className="timeslot-artist">{slot.artist}</div>
            <div className="timeslot-sides">4</div>
          </div>
        );
      })}
    </div>
  );
};

export default App;
