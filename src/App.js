import './style.css';
import supabase from './supabase';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import NewFactForm from './components/NewFactForm';
import CategoryFilter from './components/CategoryFilter';
import FactList from './components/FactList';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  /* Get data from supabase */
  useEffect(function() {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");

      if (currentCategory !==  "all") {
        query = query.eq("category", currentCategory)
      }
      const { data: facts, error } = await query
        .order("votesInteresting", { ascending: false })
        .limit(1000);
      // console.log(facts);

      if(!error) {
        setFacts(facts);
        setIsLoading(false);
      } else {
        alert("There was a problem getting data");
      }
    }

    getFacts();
  }, [currentCategory]);

  return (
    <>
      {/* Header */}
      <Header showForm={showForm} setShowForm={setShowForm}/>
      
      {/* Fact Form */}
      {showForm ? 
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> : 
        null}

      {/* Main boby */}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory}/>
        {isLoading ? 
          <Loader /> : 
          <FactList facts={facts} setFacts={setFacts}/>}
      </main>
    </>
  );
}

function Loader() {
  return <p className='message'>loading...</p>
}

export default App;
