import { useState } from "react";
import { newVisit } from "../services/visitServices";
import { ChevronLeft , CheckCircle, ThumbsDown, PhoneOff} from "lucide-react";
import GenericBackPage from "./GenericBackPage"
import "./NewVisitModal.css"; // Import the external CSS file

const NewVisitModal = ({ location, onClose }) => {
  const [visitNotes, setVisitNotes] = useState("");
  const [visitOutcome, setVisitOutcome] = useState(""); 

  return (
      <GenericBackPage title = "New Visit" onBack={onClose}>
        <h4 className="modal-subtitle"> How did the visit go? </h4>
        <div className="button-row">
          <button
            className={`visit-button ${visitOutcome === "Receptive" ? "selected" : ""}`}
            onClick={() => setVisitOutcome("Receptive")}
          >
            <CheckCircle size={24} />
            <span>Receptive</span>
          </button>

          <button
            className={`visit-button ${visitOutcome === "Not Interested" ? "selected" : ""}`}
            onClick={() => setVisitOutcome("Not Interested")}
          >
            <ThumbsDown size={24} />
            <span>Not Interested</span>
          </button>

          <button
            className={`visit-button ${visitOutcome === "No Answer" ? "selected" : ""}`}
            onClick={() => setVisitOutcome("No Answer")}
          >
            <PhoneOff size={24} />
            <span>No Answer</span>
          </button>
        </div>
          <h4 className="modal-subtitle"> Notes </h4>
          <textarea
            className="modal-textarea"
            placeholder="Any notes about the visit..."
            onChange={(event) => setVisitNotes(event.target.value)}
            value={visitNotes}
          />
          <button
            className="new-visit-button"
            onClick={() => {
              newVisit(location.id, 1, visitOutcome, visitNotes);
              onClose();
            }}
          >
            Submit Visit
          </button>
      </GenericBackPage>

 
  );
};

export default NewVisitModal;

