import "./GameWin.css"

const GameWin = ({ retry, score }) => {
  return (
    <div>
      <h1>Parabéns!</h1>
      <h2>Você acertou todas as palavras!</h2>
      <h2>A sua pontuação foi: <span>{score}</span></h2>
      <button onClick={retry}>Jogar novamente</button>
    </div>
  )
}

export default GameWin