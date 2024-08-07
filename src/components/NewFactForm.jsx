import { useState } from 'react';
import CATEGORIES from '../data'
import supabase from '../supabase';

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const NewFactForm = ({ setFacts, setShowForm}) => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e){
      // 1. prevent browser reload
      e.preventDefault();
      // console.log(text, source, category);
      
      // 2. Check if data is valid and create a new fact
      if (text && text.length <= 200 && isValidHttpUrl(source) && category) {

        // 3. Crearte a new fact Object
        // const newFact =   {
        //   id: Math.round(Math.random() * 100000),
        //   text,
        //   source,
        //   category,
        //   votesInteresting: 0,
        //   votesMindblowing: 0,
        //   votesFalse: 0,
        //   createdIn: new Date().getFullYear(),
        // };
        // console.log(newFact);

        // 3. upload the new fact to supabase and recieve the new fact opject
        setIsUploading(true);
        const { data: newFact, error } = await supabase
          .from("facts")
          .insert([{ text, source, category }])
          .select();
        
        if (!error) {
          setFacts((facts) => [newFact[0], ...facts]);
          setIsUploading(false);

          // 5. Reset input field
          setText("");
          setSource("");
          setCategory("");

          // 6. Close the form
          setShowForm(false);
        } else {
          console.error("Error inserting fact:", error);
        }
      }
    }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
        <span>{200 - textLength}</span>
        <input 
          type="text" 
          placeholder="Trustworthy source..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          disabled={isUploading}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Choose category</option>
          {CATEGORIES.map((cat) => 
            <option 
              key={cat.name} 
              value={cat.name}
            >
              {cat.name}
            </option>
          )}
        </select>
        <button 
          className="btn btn-large" 
          disabled={isUploading}
        >
          Post
        </button>
    </form>
  );
}

export default NewFactForm;