import React, {useState, useEffect} from 'react';
import api from '../../Api/Api';
import close from './close-icon.svg'

const Ballot = () => {
  const [ ballotData, setBallotData ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState('')

  
  useEffect(() =>{
    let isMounted = true;
    async function fetchData(){
      try{
  const data = await api.getBallotData()
  if(isMounted){
  setBallotData(data);
  setIsLoading(false)
  }
  const initialSelected = data.items.reduce(
    (acc, category) => [...acc, ...category.items.filter(item => item.initiallySelected)], []
  );
  selectCardOnClick(initialSelected);

      }catch(error){
        console.log(error)
        if(isMounted){
        setIsLoading(false)
        }
      }
    }
    fetchData();
    return () => { 
      isMounted = false; 
    };
  }, [])
  if(isLoading){
    return(
      <div>Loading data</div>
    )
  }
  const selectCardOnClick = (item) =>{
    const selected = activeCard.includes(item)
    if(selected){
      setActiveCard(activeCard.filter((card) => card !== item))
    } else{
      setActiveCard([...activeCard, item])
    }
  }

  const onSubmit = () =>{
    let length = activeCard.length;
    if(length > 0){
   setSubmissionStatus(`${length} nominees selected Successfuly`)
    }else{
      setSubmissionStatus('No selected nominees')
    }
  }

  const onClosing = () =>{
    setSubmissionStatus('')
  }
  
  return (
    <div className='ballot'>
   {
    ballotData.items.map(category=>(
<section className="category-container" key={category.id}>
  <div className="cat-title">
    <h1>{category.title}</h1>
  </div>
<div className='all-cards'>
  {category.items.map(item =>(
  <article className={`card ${activeCard.includes(item) ? 'active': ''}`} onClick={() => selectCardOnClick(item)}>
    <div className='card-name'>
    <h3>{item.title}</h3>
    </div>
    <div className='image-div'>
      <img src={item.photoUrL} alt='nominee' className='item-image' />
    </div>
    <div className='btn-div'>
      <button type='submit' className='select-btn'>Select Button</button>
    </div>
  </article>
  ))}
  </div>
</section>
    ))}
    <div className='submit-btn-div'>
      <button className='submit-btn' type='submit' onClick={onSubmit}>SUBMIT BALLOT <br />BUTTON</button>
    </div>
    {submissionStatus && (
  <div className='model'>
    <h3>{submissionStatus}</h3>
    <img src={close} alt='close' className='close-btn' onClick={onClosing} />
  </div>
)}
    </div>
  )
}

export default Ballot;