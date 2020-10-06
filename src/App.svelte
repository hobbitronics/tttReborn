<script>
	import { fly, fade } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';

	export let name;
	let grid = ['','','','','','','','',''];
	let winner;
	let turnCount = 0;
	let pcTurnCount = 0;
	$: totalCount = turnCount + pcTurnCount;
	let success = false;
	let blocked = false;
	
	const reset = () => {
	  grid = ['','','','','','','','',''];
	  winner = undefined;
	  turnCount = 0;
	  pcTurnCount = 0;
	}
	
	function spin(node, { duration }) {
		return {
			duration,
			css: t => {
				const eased = elasticOut(t);

				return `
					transform: scale(${eased}) rotate(${eased * 720}deg);
					color: hsl(
						${~~(t * 360)},
						${Math.min(100, 1000 - 1000 * t)}%,
						${Math.min(50, 500 - 500 * t)}%
					);`
			}
		};
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
		const number = Math.floor(Math.random()*9);
		if (winner === 'O'){
			return null;	//will return and exit function
		} else if (grid[number] !== 'X' && grid[number] !== 'O') //making sure the square is not used already
        {
			return number;     //the choice is accepted!
        } else {return rand()}  //taken already, try again
      }

	//called with mousedown on a box
	const play = choice => {
      	if (grid[choice] !== 'X' && grid[choice] !== 'O' && winner === undefined && turnCount === pcTurnCount && !blocked){  //checks that box isn't already full and no winner
		  turnCount +=1;
		  grid[choice] = 'O';                            //sets the grid number on the board to 'O'
		  success = true;
		  winA('O');   //check for a win
		  console.log(totalCount)
		  console.log(winner)
		}
	}
	//called on mouseup
	const computer = async () => {
		if (success === true && turnCount === (1 + pcTurnCount) && totalCount < 9) {	//prevent computer from going if you click on an X or O
			console.log(totalCount)
			pcTurnCount+=1;
			const delay = new Promise(resolve => setTimeout(() => resolve('completed'), 500));		
			await delay//.then((message) => {
			const cpMove = rand();		//computers choice 	
			grid[cpMove] = 'X';			//computer move, sets random board space not already moved on
			winA('X');
			success = false;
			//})
		}

	}
</script>

<main>
	<h1>Welcome to {name}!</h1>
	{#if winner === 'O'}
		<h3 in:spin="{{duration: 6000}}">Congratulations, you won!</h3>
	{:else if winner === 'X'}
		<h3 transition:fly="{{ y: -100, duration: 2000 }}">The computer won.</h3>
	{:else if totalCount >= 9}
		<h3 transition:fly="{{ y: -100, duration: 2000 }}">It's a tie!</h3>
	{/if}
	<div class="grid-container">
		{#each grid as square, i}	
			<div on:mousedown={() => play(i)} on:mouseup={() => computer()} class="grid-item">
				{#if square}
				<p transition:fade
				on:introstart={() => blocked = true}
				on:introend={() => blocked = false}	
					>{square}</p>
				{/if}
			</div>
		{/each}
	</div>

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
		font-size: 2.5em;
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
		height: 500px;
		width: 500px;
		margin: 10px auto;
	}

	.grid-item {
		background-color: rgba(255, 255, 255, 0.8);
  		border: 1px solid rgba(0, 0, 0, 0.8);
  		font-size: 50px;
  		text-align: center;
		width: 155px;
		height: 155px;
	}

	#reset {
      font-size: 40px;
      background-color: aqua;
    }

</style>