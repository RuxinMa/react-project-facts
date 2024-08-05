import CATEGORIES from "../data";
import supabase from "../supabase";
import { useState } from "react";

const Fact = ({ fact, setFacts }) => {

  const category = CATEGORIES.find((cat) => cat.name === fact.category);
  const backgroundColor = category ? category.color : '#a8a29e';

  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFacts, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);
    // console.log(updatedFacts);
    if(!error) {
      setFacts((facts) => facts.map((f) => 
        f.id === fact.id ? updatedFacts[0] : f))
      };
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? 
          <span className="disputed"> ⛔️ [DISPUTED] </span> : 
          null}
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank" rel="noreferrer"
          >
            (Source)
        </a>
      </p>
      <span 
        className="tag"
        style={{ backgroundColor }}
      >
        {fact.category}
      </span>

      {/* Iterative buttons */}
      <div className="vote-buttons">
        <button
          onClick={() => handleVote(["votesInteresting"])}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote(["votesMindblowing"])}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button
          onClick={() => handleVote(["votesFalse"])}
          disabled={isUpdating}
        >
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default Fact;
