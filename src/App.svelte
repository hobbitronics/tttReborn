<script>
	export let name;
	let grid = ['','','','','','','','',''];
	let winner;
    let cpMove;
    let turnCount = 0;
	
	const reset = () => {
	  grid = ['','','','','','','','',''];
	  winner = undefined;
	  turnCount = 0;
    }

	//winning conditions Across rows	
  function winA (player) {
    for (let i = 0; i < 7 ; i+=3) {  // i is 0 then 3 then 6
      if (grid[i] === player && grid[i+1] === player && grid[i+2] === player){  // covers 0,1,2/ 3,4,5/ 6,7,8
          winner = player;
        }
      }
    //winning conditions down colums
    for (let h = 0; h < 3 ; h++) {  // h 0, 1, 2
      if (grid[h] === player && grid[h+3] === player && grid[h+6] === player){  // covers 0,3,6  1,4,7  2,5,8
        winner = player;
        }
      }
    //diagonal winning conditions
        if ( (grid[0] + grid[4] + grid[8]) === (player+player+player) || (grid[2] + grid[4] + grid[6]) === (player+player+player)){  // covers 0,3,6  1,4,7  2,5,8
          winner = player;
        }
	}
	
	//generates random number for pc player
	const rand = () => {
        let number = Math.floor(Math.random()*9);
		if (winner === 'O'){
			return null;	//will return and exit function
		} else if (grid[number] !== 'X' && grid[number] !== 'O') //making sure the square is not used already
        {
        return number;     //the choice is accepted!
        } else {return rand()}  //taken already, try again
      }

	//called when a box is clicked
	const play = choice => {
		let success = false;
      	if (grid[choice] !== 'X' && grid[choice] !== 'O' && winner === undefined){  //checks that box isn't already full and no winner
		  grid[choice] = 'O';                            //sets the grid number on the board to 'O'
		  success = true;
		}
		if (success === true) {	//prevent computer from going if you click on an X or O
		winA('O');   //check for a win
		turnCount +=1;
		
		if (turnCount === 9 && winner === undefined){   //checks for a tie
        winner = 'tie';
      	}
		cpMove = rand();   	//computers choice
		grid[cpMove] = 'X';	//computer move, sets random board space not already moved on
		winA('X');
		turnCount +=1;
		}
	}
	
</script>

<main>
	<h1>Welcome to {name}!</h1>
	{#if winner === 'O'}
		<h3>Congratulations, you won!</h3>
	{:else if winner === 'X'}
		<h3>The computer won.</h3>
	{:else if winner === 'tie'}
		<h3>It's a tie!</h3>
	{/if}
	{#each grid as grid, i}	
	<div class="grid-container">
		<div on:click={() => play(i)} class="grid-item">{grid}</div>
	</div>
	{/each}

	<button id="reset" on:click={() => reset()}>Reset The Game</button>

	
	<p>Visit <a href="https://github.com/hobbitronics" target="blank">my Github page</a> to see more of my projects.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 80%;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: none;
		font-size: 3em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.grid-container {
		display: grid;
		grid-template-columns: auto auto auto;
		background-color: #2196F3;
		grid-gap: 10px;
		padding: 10px;
		height: 450px;
		width: 600px;
		margin: 10px auto;
	}

	.grid-item {
		background-color: rgba(255, 255, 255, 0.8);
  		border: 1px solid rgba(0, 0, 0, 0.8);
  		padding: auto;
  		font-size: 50px;
  		text-align: center;
	}

	#reset {
      font-size: 40px;
      background-color: aqua;
    }

</style>