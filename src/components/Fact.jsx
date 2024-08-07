import React, { useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CATEGORIES from "../data";
import supabase from "../supabase";

const Fact = ({ fact, setFacts }) => {
  const category = CATEGORIES.find((cat) => cat.name === fact.category);
  const backgroundColor = category ? category.color : '#a8a29e';
  const [isUpdating, setIsUpdating] = useState(false);
  const [localVotes, setLocalVotes] = useState({
    votesInteresting: fact.votesInteresting,
    votesMindblowing: fact.votesMindblowing,
    votesFalse: fact.votesFalse,
  });
  const [userVotes, setUserVotes] = useState({
    interesting: false,
    mindblowing: false,
    false: false,
  });
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const isDisputed = localVotes.votesInteresting + localVotes.votesMindblowing < localVotes.votesFalse;


  async function handleVote(columnName) {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setIsUpdating(true);

    const voteKey = `votes${columnName.charAt(0).toUpperCase() + columnName.slice(1)}`;
    const increment = userVotes[columnName] ? -1 : 1;
    const newVoteCount = localVotes[voteKey] + increment;

    // update local status
    setLocalVotes(prev => ({
      ...prev,
      [voteKey]: newVoteCount
    }));
    setUserVotes(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));

    // update supabase
    const { data: updatedFacts, error } = await supabase
      .from("facts")
      .update({ [voteKey]: newVoteCount })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    if (!error) {
      setFacts((facts) => facts.map((f) => f.id === fact.id ? updatedFacts[0] : f));
    } else {
      console.error('Error updating vote:', error);
      
      setLocalVotes(prev => ({
        ...prev,
        [voteKey]: prev[voteKey] - increment
      }));
      setUserVotes(prev => ({
        ...prev,
        [columnName]: !prev[columnName]
      }));
    }
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed"> ⛔️ [DISPUTED] </span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank" rel="noreferrer">
          (Source)
        </a>
      </p>
      <span className="tag" style={{ backgroundColor }}>
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          className={userVotes.interesting ? 'active' : ''}
          onClick={() => handleVote('interesting')}
          disabled={isUpdating}
        >
          👍 {localVotes.votesInteresting}
        </button>
        <button
          className={userVotes.mindblowing ? 'active' : ''}
          onClick={() => handleVote('mindblowing')}
          disabled={isUpdating}
        >
          🤯 {localVotes.votesMindblowing}
        </button>
        <button
          className={userVotes.false ? 'active' : ''}
          onClick={() => handleVote('false')}
          disabled={isUpdating}
        >
          ⛔️ {localVotes.votesFalse}
        </button>
      </div>
    </li>
  );
};

export default Fact;