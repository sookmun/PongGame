import { interval, fromEvent, from, zip, observable, pipe, timer, Subscription} from 'rxjs'
import { map, scan, filter, merge, flatMap, take, concat,takeUntil} from 'rxjs/operators'
type Key = 'ArrowLeft' | 'ArrowDown' | 'ArrowUp' | 'Space'
type Event = 'keydown' | 'keyup'




function pong() {
  
    // Inside this function you will use the classes and functions 
    // from rx.js
    // to add visuals to the svg element in pong.html, animate them, and make them interactive.
    // Study and complete the tasks in observable exampels first to get ideas.
    // Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/ 
    // You will be marked on your functional programming style
    // as well as the functionality that you implement.
    // Document your code!  
    //to keep and maintain the state of the game
    type State ={
      scorePlayer:number,
      scoreBot:number,
      objCount:number,
      gameOver:boolean

    }
    //to keep and maintain the state of the ball
    type ball ={
      x : number
      y : number
      r : number
      speedx : number
      speedy : number

    }
    const initialState = 
    <State>{
      scorePlayer:0,
      scoreBot:0,
      objCount:1,
      gameOver:false
    };

 
    const initialball:ball = {
      x : 300,
      y : 300,
      r : 10,
      speedx : 2,
      speedy : 2
   }
     
    
    initialState.gameOver? null : startGame()
    
      //for arrowkeys    
      const paddle = document.getElementById("paddleUser")!;
      var keyDown = fromEvent<KeyboardEvent>(document.body, 'keydown').pipe(filter(e =>[38,40].includes(e.keyCode)))
      const up =keyDown.pipe(filter(e=>e.key=='ArrowUp'),map(e=>{return {x:0,y:-1}}))
    
      keyDown.pipe(filter(e=>e.key=='ArrowDown'),map(e=>{return {x:0,y:1}}),merge(up)).subscribe(e=>{
        paddle.setAttribute('y',String(e.y + Number(paddle.getAttribute('y'))))
      })
      // for user mouse
      const svg  = document.getElementById("canvas")!;
        // control user's paddle using mouse`
      const paddleUser = document.getElementById("paddleUser")
      const mouse = fromEvent<MouseEvent>(svg, "mousemove")
      mouse.pipe(
      filter(({x, y}) => x < 600 && y < 600),
      map(({clientX, clientY}) => ({x: clientX, y: clientY-150})))
      .subscribe(e => {
        paddleUser.setAttribute('y', String(e.y))
        })
    
      
      function startGame(){
        //for paddle bot to follow ball  and ball movement
        const paddleUser =document.getElementById("paddleUser")
        const ballmove = document.getElementById("ball")!;    
        const paddlefollow = document.getElementById("paddleBot")
        const subscription = interval(10).subscribe(() =>{
        //giving the ball its consistant speed
        initialball.x =  initialball.speedx +initialball.x;
        initialball.y =  initialball.speedy +initialball.y;
        //ball movement
        if (initialball.x <initialball.r|| 
          initialball.x > 600- initialball.r) {
            // initialball.speedx *= -1;
            initialball.x <initialball.r? score(2) : 0;
            initialball.x > 600- initialball.r? score(1) : 0;
            
        }
        if (initialball.y < initialball.r || 
          initialball.y > 600 - (initialball.r*2)) {
            initialball.speedy *= -1;
            
        }
        // Detect collision with paddle
        //bouce away when hit paddle
        //This is for paddle bot
        if ((initialball.y > Number(paddlefollow.getAttribute("y")) &&
        initialball.y < Number(paddlefollow.getAttribute("y")) + 150) &&
          (initialball.x + (initialball.r) >= Number(paddlefollow.getAttribute("x")))) {
          initialball.speedx *= -1;
        }
        //this is for user paddle 
        if ((initialball.y > Number(paddleUser.getAttribute("y")) &&
        initialball.y < Number(paddleUser.getAttribute("y")) + 150) &&
          (initialball.x - (initialball.r) == Number(paddleUser.getAttribute("x"))+10)) {
              initialball.speedx *= -1;
        }

        //basically drawing the ball/setting the ball to the correct position
        ballmove.setAttribute("cy",String(initialball.y))
        ballmove.setAttribute("cx",String(initialball.x))
        //for the paddlebot to follow the ball
        paddlefollow.setAttribute("y", String(Number(ballmove.getAttribute("cy"))-75))
        //cheking if the game is over 
        if(initialState.gameOver) {
          subscription.unsubscribe();
          //getting the svg text element and adding the appopraite test
          initialState.scoreBot ==7? document.getElementById("Winner").innerHTML="Bot Wins" : document.getElementById("Winner").innerHTML="Player Wins"
          document.getElementById("GG").innerHTML ="Game Over"
          restart()
          
        }
      })
      
      
      
      
  }
   function restart(){
    const ballmove = document.getElementById("ball")
    const space = fromEvent<KeyboardEvent>(document.body, 'keydown').pipe(filter(e=>e.keyCode== 32)).subscribe(e=>{
      //getting rid of the text
      document.getElementById("Winner").innerHTML=""
      document.getElementById("GG").innerHTML=""
      //initialize the state back to is original state
      initialState.gameOver=false
      initialState.objCount=1
      initialState.scoreBot=0
      initialState.scorePlayer=0
      initialball.x=300
      initialball.y=300
      initialball.speedx=2
      initialball.speedy=2
      ballmove.setAttribute("cy",String(initialball.y))
      ballmove.setAttribute("cx",String(initialball.x))
      document.getElementById(String(1)).innerHTML= String(initialState.scorePlayer)
      document.getElementById(String(2)).innerHTML=String(initialState.scoreBot)
      startGame()
  
    })
    
    
   }
   

    function score(player:number){
      //who scored
      const score= player==1? initialState.scorePlayer+=1 :initialState.scoreBot+=1
      //checking if the score is 7 if so flag that the game is over
      score>=7? initialState.gameOver=true : initialState.gameOver=false
      document.getElementById(String(player)).innerHTML= String(score)
      //resetting the ball to its original start place
      initialball.x=300
      initialball.y=300
   
    }
    
    


 
  }
  
  
  // the following simply runs your pong function on window load.  Make sure to leave it in place.
  if (typeof window != 'undefined')
    window.onload = ()=>{
      pong();
      
    }
  
  


