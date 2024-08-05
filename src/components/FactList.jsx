import Fact from "./Fact";

const FactList = ({ facts, setFacts }) => {
  if (facts.length === 0) {
    return (
      <p className='message'>
        No facts for this category yet 🙁 <br/> 
        Create the first one ✌️ 
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts}/>
        ))}
      </ul>
      <p>There are  
        <span style={{color: "#ef4444"}}> {facts.length} </span> 
        facts in the database. Share your own ideas.</p>
    </section>
  );
}

export default FactList;
