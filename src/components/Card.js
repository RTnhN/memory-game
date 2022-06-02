import '../Styles/Card.css';

function Card(props) {
  return(
    <div onClick={props.onClick} id={props.id}>
      <p>{props.letter}</p>
    </div>
  )
}

export default Card;